import requests 
base_url = "https://pkmn.github.io/smogon/data"
usage_url = f"{base_url}gen9ou.json"

usage = requests.get(usage_url).json()
print(usage.keys())



