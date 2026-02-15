import http.server
import socketserver
import webbrowser
import os
import sys

# Set the port for the local server
PORT = 8080
# The file to open automatically
START_PAGE = "index-enhanced.html"

def run_server():
    # Ensure we are serving from the directory containing the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    print(f"Starting MetroSahayak Dashboard...")
    print(f"Serving files from: {script_dir}")
    
    # Try to find an available port
    port = PORT
    while port < PORT + 10:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}/{START_PAGE}"
                print(f"✅ Server active at: {url}")
                print(f"🔗 Frontend will try to connect to Backend at: http://localhost:8000")
                print("Press Ctrl+C to stop the server.")
                print("💡 TIP: For the AI Chatbot to work, run 'python main.py' in a separate terminal.")
                
                # Open the default web browser
                webbrowser.open(url)
                
                # Keep the server running
                httpd.serve_forever()
                return
        except OSError as e:
            if e.errno == 98 or e.errno == 10048: # Address already in use
                print(f"⚠️ Port {port} is in use. Trying {port + 1}...")
                port += 1
            else:
                print(f"❌ Error starting server: {e}")
                return
                
    print(f"❌ Could not find an open port starting from {PORT}.")

if __name__ == "__main__":
    run_server()