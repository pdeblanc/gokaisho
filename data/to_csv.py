import json
import csv

results = [json.loads(line) for line in open("attempts.jsonl")]
with open("attempts.csv", "w") as csvfile:
    writer = csv.DictWriter(csvfile, list(results[0].keys()))
    writer.writeheader()
    writer.writerows(results)
