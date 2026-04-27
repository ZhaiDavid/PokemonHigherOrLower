import requests 
url = "https://www.smogon.com/stats/2026-03/gen9ou-1825.txt"
r = requests.get(url)

with open("gen9ou-1825.txt", "w") as f:
    f.write(r.text)