from datetime import datetime

def log_session(user_input, bot_response):
    with open("logs/session_logs.txt", "a") as log_file:
        log_file.write(f"[{datetime.now()}] USER: {user_input}\n")
        log_file.write(f"[{datetime.now()}] BOT: {bot_response}\n\n")
