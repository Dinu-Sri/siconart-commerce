"""List all products currently on the site."""
import requests, json, sys

with open("config/sites.json") as f:
    cfg = json.load(f)
site = cfg["sites"]["siconart"]
base = site["url"].rstrip("/") + "/wp-json/ai-elementor/v1"
headers = {"X-Api-Key": site["api_key"]}

r = requests.get(f"{base}/wc-products", headers=headers, timeout=30)
print(f"Status: {r.status_code}")
data = r.json()

if isinstance(data, list):
    products = data
elif isinstance(data, dict) and "products" in data:
    products = data["products"]
else:
    print("Unexpected response:", str(data)[:500])
    sys.exit(1)

print(f"Total products: {len(products)}")
print()
for p in products:
    pid = p.get("id", p.get("post_id", "?"))
    name = p.get("name", p.get("title", "?"))
    ptype = p.get("type", "?")
    sku = p.get("sku", "?")
    short_desc = p.get("short_description", "")
    has_short = "YES" if short_desc else "NO"
    print(f"  {pid:>4}  {sku:<8} {ptype:<12} {name}")
