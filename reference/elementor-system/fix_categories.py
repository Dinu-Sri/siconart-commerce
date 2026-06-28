"""Move all products to Watercolor Brushes only, then delete other categories."""
import requests, json

with open("config/sites.json") as f:
    cfg = json.load(f)
site = cfg["sites"]["siconart"]
base = site["url"].rstrip("/") + "/wp-json/ai-elementor/v1"
headers = {"X-Api-Key": site["api_key"], "Content-Type": "application/json"}

with open("projects/siconart/product-mapping.json") as f:
    mapping = json.load(f)

WATERCOLOR_CAT = 25

# Only update parent/simple products (variations inherit from parent)
print("=== Updating product categories ===")
for sku, info in mapping["products"].items():
    if info["type"] == "variation":
        continue  # variations don't have their own categories
    pid = info["post_id"]
    name = info["name"]
    r = requests.put(f"{base}/wc-products/{pid}",
                     json={"categories": [WATERCOLOR_CAT]},
                     headers=headers, timeout=30)
    if r.status_code == 200:
        print(f"  OK  {sku} ({pid}) {name}")
    else:
        print(f"  ERR {sku} ({pid}) {name}: {r.status_code} {r.text[:200]}")

# Delete other categories
print("\n=== Deleting old categories ===")
for cat_name, cat_id in mapping["categories"].items():
    r = requests.delete(f"{base}/wc-categories/{cat_id}",
                        headers=headers, timeout=30)
    if r.status_code == 200:
        print(f"  Deleted: {cat_name} (id={cat_id})")
    else:
        print(f"  Failed:  {cat_name} (id={cat_id}): {r.status_code} {r.text[:200]}")

print("\nDone!")
