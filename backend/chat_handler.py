import requests
import random
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()
# Get API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("No GEMINI_API_KEY found in environment variables")

GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# Expanded mental health-related keywords to filter responses
MENTAL_HEALTH_KEYWORDS = [
    "mental health", "depression", "anxiety", "stress", "therapy", 
    "well-being", "self-care", "mindfulness", "emotional support", 
    "counseling", "psychologist", "psychiatrist", "mental illness",
    "bipolar", "panic attack", "ocd", "ptsd", "trauma", "grief",
    "loneliness", "suicidal", "self-harm", "eating disorder", "addiction",
    "adhd", "autism", "burnout", "sleep problems", "meditation",
    "coping", "mental wellness", "emotional health", "psychotherapy",
    "sadness", "mood", "anger", "fear", "phobia", "social anxiety",
    "self-esteem", "confidence", "relationship issues", "family problems"
]

# Greeting messages
GREETINGS = [
    "Hello! How can I support your mental well-being today?",
    "Hi there! I'm here to talk about mental health. What's on your mind?",
    "Welcome! Feel free to share what you're going through.",
    "Hello! This is a safe space to discuss mental health concerns."
]

# Farewell messages
FAREWELLS = [
    "Take care of yourself. Remember, you're not alone!",
    "Wishing you peace and strength. Goodbye for now!",
    "Stay strong and practice self-care. See you soon!",
    "Remember to be kind to yourself. Goodbye!"
]

def is_greeting(user_input):
    """Check if the user input is a greeting."""
    greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]
    return any(word in user_input.lower() for word in greetings)

def is_farewell(user_input):
    """Check if the user input is a farewell."""
    farewells = ["bye", "goodbye", "see you", "farewell", "quit", "exit", "stop"]
    return any(word in user_input.lower() for word in farewells)

def is_mental_health_related(user_input):
    """Check if the input is related to mental health."""
    user_input = user_input.lower()
    return any(keyword in user_input for keyword in MENTAL_HEALTH_KEYWORDS)

def get_gemini_response(user_input):
    """Get response from Gemini API for mental health-related queries."""
    if is_greeting(user_input):
        return random.choice(GREETINGS)
    
    if is_farewell(user_input):
        return random.choice(FAREWELLS)
    
    if not is_mental_health_related(user_input):
        return ("I specialize in mental health topics. Please ask about depression, anxiety, stress, "
                "or other mental health concerns. How can I help you with these issues?")
    
    headers = {"Content-Type": "application/json"}
    data = {"contents": [{"parts": [{"text": user_input}]}]}
    
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=data)
        result = response.json()
        
        # Handle the API response carefully
        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        elif "error" in result:
            return f"Sorry, there was an error: {result['error']['message']}"
        else:
            return "I'm not sure how to respond to that. Could you rephrase your question?"
            
    except Exception as e:
        print("Error:", e)
        return "Sorry, I'm having trouble responding right now. Please try again later."

# Example usage in a conversation loop
def chat():
    print(random.choice(GREETINGS))
    
    while True:
        user_input = input("You: ").strip()
        
        if not user_input:
            continue
            
        if is_farewell(user_input):
            print("Bot:", get_gemini_response(user_input))
            break
            
        response = get_gemini_response(user_input)
        print("Bot:", response)

if __name__ == "__main__":
    chat()