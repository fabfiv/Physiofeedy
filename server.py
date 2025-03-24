from flask import Flask, jsonify, Response
from flask_cors import CORS
import os
from dotenv import load_dotenv
import cv2
import mediapipe as mp 

load_dotenv()

app = Flask(__name__)
CORS(app)




camera = cv2.VideoCapture(0)


mp_drawing = mp.solutions.drawing_utils  # Drawing utility
mp_pose = mp.solutions.pose  # Pose model
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)



def generate_frames():
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


if __name__ == '__main__':
    app.run(debug=True, port=8080)