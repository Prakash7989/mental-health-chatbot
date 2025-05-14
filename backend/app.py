from flask import Flask, request, jsonify
from flask_cors import CORS
from chat_handler import get_gemini_response
from logger import log_session

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400

    user_input = data["message"]
    response = get_gemini_response(user_input)
    log_session(user_input, response)
    return jsonify({"reply": response})


if __name__ == "__main__":
    app.run(debug=True)
