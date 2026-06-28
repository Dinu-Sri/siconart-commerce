import requests

url = "https://siconart.com/wp-json/ai-elementor/v1/pages"
headers = {"X-AI-Sync-Key": "bu5TBiOe6c7UE2DOyWi2n0wF3isq5cv1G5PX9wZ1"}

# Test GET /pages (list pages - should work with old plugin)
r = requests.get(url, headers=headers, timeout=30)
print(f"GET /pages -> {r.status_code}")
print(r.text[:300])
print()

# Test GET /wc-categories (list categories)
r2 = requests.get("https://siconart.com/wp-json/ai-elementor/v1/wc-categories", headers=headers, timeout=30)
print(f"GET /wc-categories -> {r2.status_code}")
print(r2.text[:300])
print()

# Check what routes exist
r3 = requests.get("https://siconart.com/wp-json/ai-elementor/v1/", timeout=30)
print(f"GET / -> {r3.status_code}")
if r3.status_code == 200:
    data = r3.json()
    routes = list(data.get("routes", {}).keys()) if "routes" in data else []
    for route in sorted(routes):
        print(f"  {route}")
else:
    print(r3.text[:300])
