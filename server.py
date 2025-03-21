from flask import Flask, jsonify, Response
from flask_cors import CORS
import os
from dotenv import load_dotenv
import cv2

load_dotenv()

app = Flask(__name__)
CORS(app)




camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = camera.read()  # Read a frame
        if not success:
            break
        else:
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield frame for streaming
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')



@app.route("/")
def home():
    return jsonify({"message": "Welcome to PhysioFeedy API!"}) 

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(debug=True, port=8080)