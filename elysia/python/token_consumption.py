import os
import json
from pathlib import Path

def get_claude_code_tokens():
    # Define the default local storage path for Claude Code logs
    claude_path = Path.home() / ".claude" / "projects"
    
    if not claude_path.exists():
        print(f"Error: Could not find Claude Code history directory at: {claude_path}")
        print("Make sure Claude Code is installed and has been run on this machine.")
        return

    total_input = 0
    total_output = 0
    total_cache_creation = 0
    total_cache_retrieval = 0
    session_count = 0

    # Recursively find all session log files (.jsonl)
    for log_file in claude_path.glob("**/*.jsonl"):
        session_count += 1
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                for line in f:
                    if not line.strip():
                        continue
                    
                    data = json.loads(line)
                    
                    # Scan for typical token metrics structures in the session history object
                    # Anthropic APIs typically pass usage via a 'usage' block or 'tokens' keys
                    usage = data.get("usage", {})
                    if usage:
                        total_input += usage.get("input_tokens", 0)
                        total_output += usage.get("output_tokens", 0)
                        total_cache_creation += usage.get("cache_creation_input_tokens", 0)
                        total_cache_retrieval += usage.get("cache_read_input_tokens", 0)
                    else:
                        # Fallback to direct key extraction if flat
                        total_input += data.get("input_tokens", 0)
                        total_output += data.get("output_tokens", 0)
                        
        except Exception as e:
            # Skip corrupted logs or permission issues gracefully
            continue

    total_tokens = total_input + total_output

    print("=========================================")
    print("      CLAUDE CODE TOKEN USAGE REPORT      ")
    print("=========================================")
    print(f"Total Logged Sessions Found: {session_count}")
    print(f"Total Input Tokens:          {total_input:,}")
    print(f"Total Output Tokens:         {total_output:,}")
    if total_cache_creation or total_cache_retrieval:
        print(f"Cache Creation Tokens:      {total_cache_creation:,}")
        print(f"Cache Retrieval Tokens:     {total_cache_retrieval:,}")
    print("-----------------------------------------")
    print(f"GRAND TOTAL TOKENS USED:     {total_tokens:,}")
    print("=========================================")

if __name__ == "__main__":
    get_claude_code_tokens()
