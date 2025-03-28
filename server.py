from flask import Flask, jsonify, Response, request, Request
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

load_dotenv()

app = Flask(__name__)
CORS(app)


openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    print("ERROR: OpenAI API Key is missing!") 


camera = cv2.VideoCapture(0)


mp_drawing = mp.solutions.drawing_utils  
mp_pose = mp.solutions.pose 
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)



counter = 0 
stage = None 
selected_exercise = 'arm_raise'  
recording = False  
out = None  
feedback_message = "" 


mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

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

            image_path = f"frame_{count}.jpg"
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
            
            elif selected_exercise == 'arm_raise':
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
def home():
    return jsonify({"message": "Welcome to PhysioFeedy API!"}) 


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route('/get_reps', methods=['GET'])
def get_reps():
    """Returns the current rep count."""
    return jsonify({"reps": counter})



@app.route('/set_exercise', methods=['POST'])
def set_exercise():
    """Allows the user to select a different exercise."""
    global selected_exercise, counter
    data = Request.get_json()
    selected_exercise = data.get("exercise", "arm_raise") 
    counter = 0  
    return jsonify({"message": f"Exercise changed to {selected_exercise}"})




@app.route('/start_recording', methods=['POST'])
def start_recording():
    """Deletes old frames before recording a new video."""
    global recording, out, selected_exercise, counter
    data = request.get_json()
    selected_exercise = data.get("exercise", "arm_raise")  
    counter = 0  
    
    old_frames = glob.glob("frame_*.jpg")
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
    """Stops recording and ensures the video file is properly saved."""
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
    """Stops recording after a set time and ensures Flask context is used."""
    time.sleep(delay)
    with app.app_context():  
        stop_recording()




@app.route('/analyze_video', methods=['POST'])
def analyze_video():
    """Extracts frames from the video, analyzes them, and deletes them after processing."""
    global feedback_message
    video_file_path = 'output.mp4'

    if not os.path.exists(video_file_path):
        print("Error: Video file does not exist!")  
        return jsonify({'error': 'Video file not found'}), 400

    frames = extract_key_frames(video_file_path)
    if not frames:
        print("Error: No frames extracted from video!")  
        return jsonify({'error': 'No frames extracted'}), 500

    feedback_list = []

    for image_path in frames[:5]:  
        try:
            with open(image_path, "rb") as image_file:
                response = openai.chat.completions.create(
                    model="gpt-4-turbo",
                    messages=[
                        {"role": "system", "content": "You are an AI providing exercise feedback."},
                        {"role": "user", "content": "Analyze this image and provide feedback on posture and form."}
                    ]
                )

            feedback_list.append(response.choices[0].message.content)
            os.remove(image_path) 
            print(f"Processed & deleted frame: {image_path}")  

        except Exception as e:
            print(f"Error while processing frame: {e}")  
            return jsonify({'error': str(e)}), 500

    feedback_message = " ".join(feedback_list)  
    return jsonify({'message': 'Video analysis complete', 'feedback': feedback_message})





@app.route('/feedback_info')
def feedback():
    """Returns AI-generated exercise feedback."""
    return jsonify({'feedback': feedback_message})



if __name__ == "__main__":
    app.run(debug=True, port=8080)