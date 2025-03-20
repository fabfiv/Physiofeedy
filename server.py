from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Welcome to PhysioFeedy API!"})

if __name__ == '__main__':
    app.run(debug=True, port=8080)