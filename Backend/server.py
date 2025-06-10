from flask import Flask, jsonify, Response, request, Request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from models import db, User, ExerciseHistory, BlacklistedToken
from flask_cors import CORS
import os
from dotenv import load_dotenv
import cv2
import numpy as np
import openai
import mediapipe as mp 
import threading
import time
import glob
import uuid
from datetime import timedelta, datetime
from jwt.exceptions import ExpiredSignatureError, DecodeError  #InvalidTokenError
import base64



load_dotenv()

app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)





openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    print("ERROR: OpenAI API Key is missing!") 


camera = cv2.VideoCapture(0)


mp_drawing = mp.solutions.drawing_utils  
mp_pose = mp.solutions.pose 
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)



counter = 0 
stage = None 
selected_exercise = 'Arm Raises'  
recording = False  
out = None  
feedback_message = "" 


mp_pose = mp.solutions.pose
pose = mp_pose.Pose()




# def is_pose_complete(landmarks, visibility_threshold=0.8, required_landmark_ratio=0.6):
#     """
#     Check if a sufficient number of landmarks are confidently detected.
#     """
#     visible_landmarks = [lm for lm in landmarks if lm.visibility > visibility_threshold]
#     completeness_ratio = len(visible_landmarks) / len(landmarks)
#     return completeness_ratio >= required_landmark_ratio

# def extract_key_frames(video_path, visibility_threshold=0.8, required_landmark_ratio=0.6):
#     """
#     Extracts only those frames from the video which contain almost all pose landmarks
#     with sufficient confidence.
#     """
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         print("Error: Cannot open video file!")
#         return []

#     pose = mp_pose.Pose()
#     frames = []
#     frames_dir = os.path.join(os.getcwd(), "frames")
#     os.makedirs(frames_dir, exist_ok=True)

#     count = 0
#     saved_count = 0

#     while cap.isOpened():
#         success, frame = cap.read()
#         if not success:
#             break

#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         results = pose.process(rgb_frame)

#         if results.pose_landmarks:
#             if is_pose_complete(results.pose_landmarks.landmark, visibility_threshold, required_landmark_ratio):
#                 # Draw landmarks
#                 mp_drawing.draw_landmarks(
#                     frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
#                     mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
#                     mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
#                 )

#                 # Save the frame
#                 image_path = os.path.join(frames_dir, f"frame_{count}.jpg")
#                 cv2.imwrite(image_path, frame)
#                 frames.append(image_path)
#                 saved_count += 1
#                 print(f"[{saved_count}] Frame saved (complete pose): {image_path}")
#             else:
#                 print(f"[{count}] Incomplete pose — skipped.")
#         else:
#             print(f"[{count}] No pose detected — skipped.")

#         count += 1

#     cap.release()
#     pose.close()
#     print(f"\n Done! Total saved complete-pose frames: {saved_count}")
#     return frames





def extract_key_frames(video_path, interval=30):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Cannot open video file!") 
        return []

    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video Opened | FPS: {frame_rate}, Total Frames: {total_frames}")  

    frame_interval = max(1, int(frame_rate * (interval / 30)))  
    frames = []
    count = 0

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        frames_dir = os.path.join(os.getcwd(), "frames")
        os.makedirs(frames_dir, exist_ok=True)

        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                print(f"Stopped reading at frame {count}")  
                break

            if count % frame_interval == 0:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = pose.process(rgb_frame)

                if results.pose_landmarks:
                    mp.solutions.drawing_utils.draw_landmarks(
                        frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                    )

                image_path = os.path.join(frames_dir, f"frame_{count}.jpg")
                cv2.imwrite(image_path, frame)
                frames.append(image_path)
                print(f"Extracted frame with landmarks: {image_path}")  

            count += 1

    cap.release()
    return frames





def calculate_angle(a, b, c):
    a = np.array(a)  
    b = np.array(b) 
    c = np.array(c)  

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi) 

    if angle > 180:
        angle = 360 - angle  
    return angle




def generate_frames():
    global counter, stage, recording, out, selected_exercise
    
    while True:
        success, frame = camera.read()
        if not success:
            print("Error: No frame captured from camera.")
            break
        
        if recording and out is not None:
            out.write(frame)  
            print("Frame written to output.mp4")
        
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False  
        
        results = pose.process(image)  
        
        image.flags.writeable = True  
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            if selected_exercise == 'squat':
                hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                angle = calculate_angle(hip, knee, ankle)
            
            elif selected_exercise == 'Arm Raises':
                shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                angle = calculate_angle(shoulder, elbow, wrist)
            
            cv2.putText(image, f"Angle: {int(angle)}", tuple(np.multiply(knee if selected_exercise == 'squat' else elbow, [640, 480]).astype(int)),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
            
            if angle > 160:
                stage = "down"
            if angle < (120 if selected_exercise == 'squat' else 90) and stage == "down":
                stage = "up"
                counter += 1  # Increase rep count
                print(f"{selected_exercise.capitalize()} Reps: {counter}")
            
            cv2.putText(image, f"Reps: {counter}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2))
        
        if recording and out is not None:
            out.write(image)  # Save processed frame with overlays to video
            print("Frame written to output.mp4")
        
        
        _, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')



@app.route("/")
@app.route("/home")
def home():
    return jsonify({"message": "Welcome to PhysioFeedy API!"}) 


    
    
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})



@app.route('/login', methods=['POST'])
def login():
    """Login endpoint to authenticate users and issue a JWT token."""
    data = request.get_json()

    # Check if username and password exist in the request
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    # Fetch user from database
    user = User.query.filter_by(username=data['username']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        # Generate a unique JWT token with `jti`
        access_token = create_access_token(
            identity=str(user.id), 
            expires_delta=timedelta(hours=1),  # Token expires in 1 hour
            additional_claims={'jti': str(uuid.uuid4())}  # Unique token ID
        )
        return jsonify({'token': access_token, 'message': 'Login successful'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    history = [
        {'exercise_name': h.exercise_name, 'feedback': h.feedback, 'timestamp': h.timestamp}
        for h in user.history
    ]
    return jsonify({'username': user.username, 'history': history})



@app.route('/store_analysis', methods=['POST'])
@jwt_required()
def store_analysis():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_entry = ExerciseHistory(
        user_id=user_id,
        exercise_name=data['exercise_name'],
        feedback=data['feedback']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Exercise analysis stored successfully'})



@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get("Authorization")  
    if not token:
        return jsonify({"message": "Token is missing"}), 400
    
    try:
        token = token.split("Bearer ")[1]  
        decoded_token = decode_token(token)  
        jti = decoded_token["jti"]  
        
       
        blacklisted_token = BlacklistedToken(jti=jti, created_at=datetime.utcnow())
        db.session.add(blacklisted_token)
        db.session.commit()
        
        return jsonify({"message": "Successfully logged out!"})

    except Exception as e:
        return jsonify({"message": f"Invalid token: {str(e)}"}), 401

def check_token_blacklist(jwt_header, jwt_payload):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"message": "Token is missing"}), 401

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])  
        jti = decoded_token["jti"]
        
        blacklisted_token = BlacklistedToken.query.filter_by(jti=jti).first()
        if blacklisted_token:
            return jsonify({"message": "Token has been revoked"}), 401

    except ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except DecodeError:
        return jsonify({"message": "Invalid token"}), 401


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route('/get_reps', methods=['GET'])
def get_reps():
    return jsonify({"reps": counter})



@app.route('/set_exercise', methods=['POST'])
def set_exercise():
    global selected_exercise, counter
    data = Request.get_json()
    selected_exercise = data.get("exercise", "Arm Raises") 
    counter = 0  
    return jsonify({"message": f"Exercise changed to {selected_exercise}"})




@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording, out, selected_exercise, counter
    data = request.get_json()
    selected_exercise = data.get("exercise", "Arm Raises")  
    counter = 0  
    
    frame_folder = "Backend/frames"
    old_frames = glob.glob(os.path.join(frame_folder, "frame_*.jpg"))
    for frame in old_frames:
        os.remove(frame)
        print(f"Deleted old frame: {frame}") 

    if not recording:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter('output.mp4', fourcc, 20.0, (640, 480))
        if not out.isOpened():
            print("Error: Failed to open video writer!")  
            return jsonify({"error": "Video writer failed"})

        recording = True
        
        threading.Thread(target=stop_recording_after_delay, args=(30,)).start() 
        print("Recording started...")  

    return jsonify({"message": "Recording started", "exercise": selected_exercise})


@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global recording, out
    if recording:
        recording = False
        if out is not None:
            time.sleep(2)  
            out.release()  
            cv2.destroyAllWindows()
            out = None
            print("Recording stopped. Video saved.")  
            return jsonify({"message": "Recording stopped"})

    return jsonify({"message": "No active recording to stop"})





def stop_recording_after_delay(delay):
    time.sleep(delay)
    with app.app_context():  
        stop_recording()






@app.route('/analyze_video', methods=['POST'])  
@jwt_required()  
def analyze_video(): 
    import base64
    global feedback_message
    user_id = get_jwt_identity()  
    video_file_path = 'output.mp4'

    if not os.path.exists(video_file_path):
        return jsonify({'error': 'Video file not found'}), 400

    frames = extract_key_frames(video_file_path)
    if not frames:
        return jsonify({'error': 'No frames extracted'}), 500

    feedback_list = []

    for image_path in frames[9:12]:  
        try:
            with open(image_path, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')

            response = openai.chat.completions.create(
                model="gpt-4o",
              messages = [
                {
                    "role": "system",
                    "content": "You are an AI physiotherapy coach that gives short, structured, numerical feedback on exercise posture using images."
                },
                {
                    "role": "user",
                    "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                },
                {
                    "type": "text",
                    "text": f"""
                    Analyze this image for the exercise: {selected_exercise}.
                    Return output in exactly 1 line ONLY — no extra lines, no repetitions.

                    Format:
                        Range of motion: %, Accuracy: %, Alignment: %; [short comment on posture]; [short motivational suggestion].
                        Only one set of the metrics (do NOT repeat Range/Accuracy/Alignment twice). Keep punctuation clean.
                        """
                }
                ]
            }
        ]


            )

            feedback_list.append(response.choices[0].message.content)
            os.remove(image_path)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    feedback_message = " ".join(feedback_list)

   
    new_entry = ExerciseHistory(
        user_id=user_id,
        exercise_name=selected_exercise,
        feedback=feedback_message
    )
    db.session.add(new_entry)
    db.session.commit()
    print("Feedback stored in database.")

    return jsonify({'message': 'Video analysis complete', 'feedback': feedback_message})






@app.route('/feedback_info')
def feedback():
    return jsonify({'feedback': feedback_message})



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8080)