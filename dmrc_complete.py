import heapq
import re

# ==========================================
# SECTION 1: FULL STATION DATABASE (Graph)
# ==========================================
# Simplified graph with major lines and interchanges for demonstration.
# In a production app, this would be a complete JSON or Database.

METRO_GRAPH = {}
STATION_DATASET = []

def add_edge(u, v, line, time=2):
    if u not in METRO_GRAPH: METRO_GRAPH[u] = []
    if v not in METRO_GRAPH: METRO_GRAPH[v] = []
    METRO_GRAPH[u].append({'node': v, 'line': line, 'time': time})
    METRO_GRAPH[v].append({'node': u, 'line': line, 'time': time})

def add_line(stations, line_name):
    for i in range(len(stations) - 1):
        add_edge(stations[i], stations[i+1], line_name)
    for s in stations:
        if not any(d['name'] == s for d in STATION_DATASET):
            STATION_DATASET.append({'name': s, 'lines': [line_name]})
        else:
            # Update lines for interchange
            for d in STATION_DATASET:
                if d['name'] == s and line_name not in d['lines']:
                    d['lines'].append(line_name)

# Define Lines (Subset of major stations for connectivity)
red_line = ["Rithala", "Netaji Subhash Place", "Kashmere Gate", "Shastri Park", "Dilshad Garden", "Shaheed Sthal"]
yellow_line = ["Samaypur Badli", "Azadpur", "Kashmere Gate", "New Delhi", "Rajiv Chowk", "Central Secretariat", "Hauz Khas", "Millennium City Centre"]
blue_line = ["Dwarka Sector 21", "Rajouri Garden", "Rajiv Chowk", "Mandi House", "Mayur Vihar-I", "Noida Electronic City"]
blue_branch = ["Yamuna Bank", "Vaishali"]
violet_line = ["Kashmere Gate", "Mandi House", "Central Secretariat", "Lajpat Nagar", "Kalkaji Mandir", "Raja Nahar Singh"]
airport_line = ["New Delhi", "Dhaula Kuan", "Delhi Aerocity", "IGI Airport", "Dwarka Sector 21"]
pink_line = ["Majlis Park", "Azadpur", "Netaji Subhash Place", "Rajouri Garden", "Dhaula Kuan", "Lajpat Nagar", "Mayur Vihar-I", "Shiv Vihar"]
magenta_line = ["Janakpuri West", "Hauz Khas", "Kalkaji Mandir", "Botanical Garden"]

# Build Graph
add_line(red_line, "Red Line")
add_line(yellow_line, "Yellow Line")
add_line(blue_line, "Blue Line")
add_line(blue_branch, "Blue Line Branch")
add_line(violet_line, "Violet Line")
add_line(airport_line, "Airport Express")
add_line(pink_line, "Pink Line")
add_line(magenta_line, "Magenta Line")

# Manual connections for interchanges not covered by sequential lists
add_edge("Yamuna Bank", "Indraprastha", "Blue Line") # Connect branch
add_edge("Botanical Garden", "Noida Sector 18", "Blue Line") # Connect Magenta to Blue at Noida

# ==========================================
# SECTION 2: FARE RULES
# ==========================================
def calculate_fare(stations_count, line_type="Normal"):
    if line_type == "Airport Express":
        return 60
    
    # DMRC Standard Fare Slabs (Approximate based on stations/distance)
    if stations_count <= 2: return 10
    elif stations_count <= 5: return 20
    elif stations_count <= 12: return 30
    elif stations_count <= 21: return 40
    elif stations_count <= 32: return 50
    else: return 60

# ==========================================
# SECTION 3: BFS ROUTE ALGORITHM
# ==========================================
def find_route(start, end):
    if start not in METRO_GRAPH or end not in METRO_GRAPH:
        return {"error": "Station not found in network"}

    queue = [(0, start, [], [])] # (cost, current_node, path, lines_used)
    visited = set()
    min_dist = {start: 0}

    while queue:
        cost, u, path, lines = heapq.heappop(queue)

        if u == end:
            # Reconstruct detailed steps
            full_path = path + [u]
            steps = []
            if len(full_path) > 1:
                current_line = lines[0]
                segment_start = full_path[0]
                count = 0
                
                for i in range(len(lines)):
                    if lines[i] != current_line:
                        steps.append({
                            "start": segment_start,
                            "end": full_path[i],
                            "line": current_line,
                            "stops": count
                        })
                        current_line = lines[i]
                        segment_start = full_path[i]
                        count = 0
                    count += 1
                
                # Add last segment
                steps.append({
                    "start": segment_start,
                    "end": full_path[-1],
                    "line": current_line,
                    "stops": count
                })

            total_stations = len(full_path) - 1
            is_airport = any(s['line'] == "Airport Express" for s in steps)
            fare = calculate_fare(total_stations, "Airport Express" if is_airport else "Normal")

            return {
                "source": start,
                "destination": end,
                "path": full_path,
                "steps": steps,
                "total_stations": total_stations,
                "fare": fare,
                "interchanges": len(steps) - 1
            }

        if u in visited: continue
        visited.add(u)

        for neighbor in METRO_GRAPH[u]:
            v = neighbor['node']
            line = neighbor['line']
            weight = 1 # Uniform weight for stations
            
            # Penalty for changing lines to prefer direct routes
            if lines and lines[-1] != line:
                weight += 2 

            if v not in min_dist or cost + weight < min_dist[v]:
                min_dist[v] = cost + weight
                heapq.heappush(queue, (cost + weight, v, path + [u], lines + [line]))

    return {"error": "No route found"}

# ==========================================
# SECTION 5: CHAT LOGIC & NLP
# ==========================================
def validate_station(input_name):
    """Fuzzy match station name."""
    input_name = input_name.lower().strip()
    best_match = None
    
    # Exact match check
    for s in STATION_DATASET:
        if s['name'].lower() == input_name:
            return True, s['name']
            
    # Partial match
    for s in STATION_DATASET:
        if input_name in s['name'].lower():
            return True, s['name']
            
    return False, None

def format_route_text(route_data):
    """Convert route object to chat string."""
    if "error" in route_data:
        return route_data["error"]
        
    steps_text = ""
    for step in route_data['steps']:
        steps_text += f"\n🔹 **{step['line']}**: {step['start']} ➝ {step['end']} ({step['stops']} stops)"
        
    return (
        f"✅ **Route Found:** {route_data['source']} to {route_data['destination']}\n"
        f"🚇 **Stations:** {route_data['total_stations']}\n"
        f"💰 **Fare:** ₹{route_data['fare']}\n"
        f"🔄 **Interchanges:** {route_data['interchanges']}\n"
        f"{steps_text}"
    )

def process_chatbot_query(msg):
    """Simple intent processor."""
    msg = msg.lower()
    
    if "timing" in msg:
        return "🕐 Metro runs from 6:00 AM to 11:00 PM."
    elif "fare" in msg:
        return "💰 Fares range from ₹10 to ₹60 based on distance."
    elif "card" in msg:
        return "💳 Smart Cards give 10% discount on every trip."
    else:
        return "I can help with Routes, Fares, and Timings. Try 'Rajiv Chowk to Noida'."