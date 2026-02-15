import sqlite3
import os

def view_logs():
    print("\n📊 DMRC USER QUERY LOGS")
    print("=" * 100)
    
    # Use absolute path to find the database in the same folder as this script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "dmrc_logs.db")

    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("SELECT * FROM query_logs ORDER BY id DESC LIMIT 20")
        rows = c.fetchall()
        
        print(f"{'ID':<5} | {'TIMESTAMP':<20} | {'ENDPOINT':<12} | {'INPUT':<30} | {'RESPONSE'}")
        print("-" * 100)
        for row in rows:
            # row: id, timestamp, endpoint, user_input, response_summary
            resp = row[4].replace('\n', ' ')[:30] + "..." if len(row[4]) > 30 else row[4]
            print(f"{row[0]:<5} | {row[1]:<20} | {row[2]:<12} | {row[3]:<30} | {resp}")
        conn.close()
    except sqlite3.OperationalError:
        print("⚠️ No logs found. Run the app and make some queries first.")

if __name__ == "__main__":
    view_logs()