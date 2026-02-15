from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sys
import os
import re
import webbrowser
from threading import Timer
import sqlite3
from datetime import datetime

# Ensure we can import from the current directory
sys.path.append(os.getcwd())

# Import the logic we built in Parts 1-3 (Combined in dmrc_complete.py)
try:
    from dmrc_complete import find_route, validate_station, format_route_text, calculate_fare, process_chatbot_query, STATION_DATASET
except ImportError:
    print("❌ Error: 'dmrc_complete.py' not found. Please ensure Part 1-5 are combined.")
    sys.exit(1)

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes

# ==========================================
# DATABASE SETUP (SQLite)
# ==========================================
# Use absolute path to ensure DB is always found in the project folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "dmrc_logs.db")

def init_db():
    """Initialize SQLite database for storing user queries."""
    try:
        with sqlite3.connect(DB_NAME) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS query_logs
                         (id INTEGER PRIMARY KEY AUTOINCREMENT,
                          timestamp TEXT,
                          endpoint TEXT,
                          user_input TEXT,
                          response_summary TEXT)''')
            conn.commit()
        print(f"✅ Database initialized: {DB_NAME}")
    except Exception as e:
        print(f"❌ Database error: {e}")

def log_query(endpoint, user_input, response_summary):
    """Log a user query to the database."""
    try:
        with sqlite3.connect(DB_NAME) as conn:
            c = conn.cursor()
            c.execute("INSERT INTO query_logs (timestamp, endpoint, user_input, response_summary) VALUES (?, ?, ?, ?)",
                      (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), endpoint, str(user_input), str(response_summary)))
            conn.commit()
    except Exception as e:
        print(f"⚠️ Logging failed: {e}")

# ==========================================
# PART 5: FLASK BACKEND API
# ==========================================

@app.route('/')
def index():
    """
    Redirect root to dashboard.
    This helps relative paths in HTML (like ../static) work correctly.
    """
    return '<script>window.location.href="/dashboard";</script>'

@app.route('/dashboard')
def dashboard():
    """
    Serve the HTML Dashboard.
    """
    return render_template('dashboard.html')

@app.route('/api/stations', methods=['GET'])
def get_stations():
    """
    API: Get list of all stations for dropdowns.
    """
    stations = sorted([s['name'] for s in STATION_DATASET])
    return jsonify({"stations": stations})

@app.route('/find-route', methods=['POST'])
def find_route_endpoint():
    """
    API: Find route between two stations.
    Input: { "source": "Station A", "destination": "Station B" }
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    src_input = data.get('source')
    dst_input = data.get('destination')
    
    if not src_input or not dst_input:
        return jsonify({"error": "Source and Destination are required"}), 400

    # Validate stations
    valid_src, src_name = validate_station(src_input)
    valid_dst, dst_name = validate_station(dst_input)

    if not valid_src:
        return jsonify({"error": f"Station '{src_input}' not found."}), 404
    if not valid_dst:
        return jsonify({"error": f"Station '{dst_input}' not found."}), 404

    # Find route
    route_result = find_route(src_name, dst_name)
    
    # Log to Database
    log_query('/find-route', f"{src_name} -> {dst_name}", route_result.get('error', 'Success'))
    
    if "error" in route_result:
        return jsonify(route_result), 404
    
    # Enrich fare data for frontend
    base_fare = route_result.get('fare', 0)
    route_result['fare_details'] = {
        "base_fare": base_fare,
        "off_peak_fare": int(base_fare * 0.9),
        "smart_card_fare": int(base_fare * 0.9) # Assuming 10% discount for smart card too for simplicity
    }
    # Ensure keys match frontend expectations where possible
    route_result['distance'] = route_result['total_stations']
        
    return jsonify(route_result)

@app.route('/calculate-fare', methods=['POST'])
def calculate_fare_endpoint():
    """
    API: Calculate fare based on station count.
    Input: { "stations": 5 }
    """
    data = request.json
    stations = data.get('stations')
    if stations is None:
        return jsonify({"error": "Station count required"}), 400
        
    fare = calculate_fare(int(stations))
    return jsonify({"fare": fare})

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    """
    API: Chatbot interaction.
    Input: { "message": "User query" }
    """
    data = request.json
    msg = data.get('message')
    if not msg:
        return jsonify({"response": "Please say something."}), 400
    
    response_text = process_chatbot_query(msg)
    
    # Log to Database
    log_query('/chat', msg, response_text[:50] + "..." if len(response_text) > 50 else response_text)
    
    return jsonify({"response": response_text})

@app.route('/api/chat', methods=['POST'])
def chat_api():
    """
    Handle Chat & Route Requests.
    Expected JSON: { "message": "Rajiv Chowk to Noida" }
    """
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"response": "⚠️ Error: No message received."}), 400

    user_msg = data['message'].strip()
    response_text = ""
    route_info = None
    
    # --- Intent Recognition ---
    lower_msg = user_msg.lower()

    # 1. Route Query (Heuristic: contains " to ")
    # We use regex to split case-insensitively on " to "
    parts = re.split(r'\s+to\s+', user_msg, flags=re.IGNORECASE)
    
    if len(parts) >= 2 and " to " in lower_msg:
        # Assume format: "Origin to Destination"
        src_raw = parts[0].strip()
        dst_raw = parts[1].strip()
        
        # Validate Stations
        valid_src, src_name = validate_station(src_raw)
        valid_dst, dst_name = validate_station(dst_raw)
        
        if valid_src and valid_dst:
            # Calculate Route
            route_data = find_route(src_name, dst_name)
            
            if "error" in route_data:
                response_text = f"⚠️ {route_data['error']}"
            else:
                # Success: Get formatted text AND raw data for UI
                response_text = format_route_text(route_data)
                route_info = route_data
        else:
            # Handle Typo/Unknown Stations
            suggestions = []
            if not valid_src:
                msg = f"❌ Station **'{src_raw}'** not found."
                if src_name: msg += f" Did you mean **{src_name}**?"
                suggestions.append(msg)
            if not valid_dst:
                msg = f"❌ Station **'{dst_raw}'** not found."
                if dst_name: msg += f" Did you mean **{dst_name}**?"
                suggestions.append(msg)
            
            response_text = "\n".join(suggestions)

    # 2. Map Request
    elif "map" in lower_msg:
        response_text = "🗺️ **Network Map**\nI've opened the map view in the side panel."
        # In a real app, we'd send a flag to switch UI tabs
        
    # 3. Fare Request
    elif "fare" in lower_msg:
        response_text = "💰 **Fare Calculator**\nPlease enter a route (e.g., *'Hauz Khas to Saket'*) to see the fare."

    # 4. Greetings
    elif any(w in lower_msg for w in ['hi', 'hello', 'hey', 'start']):
        response_text = (
            "👋 **Hello! I'm MetroSahayak.**\n"
            "I can help you find the fastest metro routes.\n\n"
            "Try asking:\n"
            "• *Rajiv Chowk to Noida City Centre*\n"
            "• *Kashmere Gate to Huda City Centre*"
        )

    # 5. Fallback
    else:
        response_text = (
            "🤔 I didn't catch that.\n"
            "Please ask for a route like: **'Station A to Station B'**"
        )

    return jsonify({
        "response": response_text,
        "route_info": route_info
    })

if __name__ == '__main__':
    print("\n=================================================")
    print("  🚇 MetroSahayak Backend Running")
    print("  👉 Open: http://localhost:5000/dashboard")
    print("=================================================\n")

    init_db()  # Initialize database on startup

    def open_browser():
        webbrowser.open_new("http://localhost:5000/dashboard")

    # if not os.environ.get("WERKZEUG_RUN_MAIN"):
    #     Timer(1.5, open_browser).start()

    app.run(host='0.0.0.0', port=5000, debug=True)