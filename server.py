from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)



@app.route("/")
def home():
    return jsonify({"message": "Welcome to PhysioFeedy API!"}) 


if __name__ == '__main__':
    app.run(debug=True, port=8080)