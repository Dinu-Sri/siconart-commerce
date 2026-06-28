import requests

key = "bu5TBiOe6c7UE2DOyWi2n0wF3isq5cv1G5PX9wZ1"
print(f"Key length: {len(key)}")
print(f"Key repr: {repr(key)}")

# Try different header names (some plugins use different conventions)
headers_options = [
    {"X-AI-Sync-Key": key},
    {"X-Api-Key": key},
    {"Authorization": f"Bearer {key}"},
]

for h in headers_options:
    header_name = list(h.keys())[0]
    r = requests.get("https://siconart.com/wp-json/ai-elementor/v1/pages", headers=h, timeout=30)
    print(f"  {header_name}: {r.status_code}")

# Also try as query parameter
r = requests.get(f"https://siconart.com/wp-json/ai-elementor/v1/pages?api_key={key}", timeout=30)
print(f"  query param: {r.status_code}")

# Try status endpoint (might not require auth)
r = requests.get("https://siconart.com/wp-json/ai-elementor/v1/status", timeout=30)
print(f"\nGET /status (no auth): {r.status_code}")
print(r.text[:300])
