import sys
import os

# Ensure we can import from the current directory
sys.path.append(os.getcwd())

try:
    from dmrc_complete import METRO_NETWORKS
except ImportError:
    print("❌ Error: 'dmrc_complete.py' not found.")
    sys.exit(1)

def main():
    unique_stations = set()
    total_stops = 0
    
    print("\n" + "="*40)
    print(f"{'METRO LINE':<25} | {'STATIONS':<10}")
    print("="*40)
    
    for line, stations in METRO_NETWORKS.items():
        count = len(stations)
        total_stops += count
        unique_stations.update([s.strip() for s in stations])
        print(f"{line:<25} | {count:<10}")
        
    print("-" * 40)
    print(f"{'TOTAL STOPS (Nodes)':<25} | {total_stops:<10}")
    print(f"{'UNIQUE STATIONS':<25} | {len(unique_stations):<10}")
    print("="*40 + "\n")

if __name__ == "__main__":
    main()