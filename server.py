from flask import Flask, jsonify, Response
from flask_cors import CORS
import os
from dotenv import load_dotenv
import cv2
import numpy as np
import mediapipe as mp 

load_dotenv()

app = Flask(__name__)
CORS(app)




camera = cv2.VideoCapture(0)


mp_drawing = mp.solutions.drawing_utils  # Drawing utility
mp_pose = mp.solutions.pose  # Pose model
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)


# Variables for tracking reps
counter = 0  # Rep counter
stage = None  # Exercise stage (up/down)

def calculate_angle(a, b, c):
    """Calculate the angle between three points (a-b-c)."""
    a = np.array(a)  # First point
    b = np.array(b)  # Middle point (joint)
    c = np.array(c)  # Last point

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)  # Convert to degrees

    if angle > 180:
        angle = 360 - angle  # Normalize angle

    return angle


def generate_frames():
    global counter, stage
    while True:
        success, frame = camera.read()  # Read a frame
        if not success:
            break
        else:
            # Convert frame to RGB (MediaPipe requires RGB format)
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False  # Improve performance

            # Process the frame with MediaPipe Pose
            results = pose.process(image)

            # Convert back to BGR for OpenCV display
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            
            # Detect pose landmarks
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                # Get coordinates for key points (left hip, knee, and ankle)
                hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                       landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                        landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                         landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                # Calculate knee angle
                angle = calculate_angle(hip, knee, ankle)

                # Display the angle on the video
                cv2.putText(image, str(int(angle)),
                            tuple(np.multiply(knee, [640, 480]).astype(int)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

                # Exercise tracking logic
                if angle > 160:
                    stage = "down"
                if angle < 120 and stage == "down":
                    stage = "up"
                    counter += 1  # Increment rep counter
                    print(f"Reps: {counter}")

                # Display rep count on screen
                cv2.putText(image, f"Reps: {counter}", (10, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                

            # Draw pose landmarks if detected
            if results.pose_landmarks:
                mp_drawing.draw_landmarks(
                    image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                    mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
                )

            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()

            # Yield frame for streaming
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


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

if __name__ == '__main__':
    app.run(debug=True, port=8080)