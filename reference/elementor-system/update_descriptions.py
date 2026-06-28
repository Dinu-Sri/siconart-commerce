"""Update short descriptions: summarize Best For as paragraph after specs, remove Ideal For."""
import json, os, requests, openpyxl

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_FILE = os.path.join(SCRIPT_DIR, "sicon_brushes_woocommerce.xlsx")
CONFIG_FILE = os.path.join(SCRIPT_DIR, "config", "sites.json")
EXCLUDED_SKUS = {"SA0004"}  # T1 Soulmate excluded (separate product)

with open(CONFIG_FILE) as f:
    cfg = json.load(f)
site = cfg["sites"]["siconart"]
base = site["url"].rstrip("/") + "/wp-json/ai-elementor/v1"
headers = {"X-Api-Key": site["api_key"], "Content-Type": "application/json"}

# Products currently on site (from fix_categories run + API listing)
LIVE_PRODUCTS = {
    445: "Travel Series Brush - T3",
    446: "Ruyue Short Brush",
    447: "Sicon Art Qin Brush",
    448: "Happiness Short Travel Brush",
    449: "Sicon Art Flat Brush Series",
    450: "Dark Green Short Brush",
    451: "Feng Short Sketch Brush",
    452: "Chi Ling Travel Brush",
    453: "Qing Yao Detail Brush",
    454: "Tai Chi Group Brush (Yin & Yang)",
    455: "Run Hao Short Brush",
    456: "Long Handle Brush Series - L5",
    457: "Short Handle Series - S1",
    # 261: Soulmate T1 - pre-existing, not in our Excel
}


def build_new_short_description(product):
    """New format: hook + specs + best-for paragraph + build feature."""
    name = product.get("Name", "")
    tip = product.get("Meta: Tip Length (cm)", "")
    shaft = product.get("Meta: Shaft Diameter (cm)", "")
    handle_len = product.get("Meta: Handle Length (cm)", "")
    handle_type = product.get("Meta: Handle Type / Material", "")
    hair = product.get("Meta: Hair Blend", "")
    best_uses = product.get("Meta: Best Uses", "")
    build_feature = product.get("Meta: Build / Feature", "")

    lines = []

    # Opening hook
    lines.append(f"<p><strong>{name}</strong> - handcrafted for watercolor artists who demand precision and flow.</p>")

    # Specs as bullet points
    specs = []
    if tip:
        specs.append(f"Tip Length: {tip} cm")
    if shaft:
        specs.append(f"Shaft Diameter: {shaft} cm")
    if handle_len:
        specs.append(f"Handle Length: {handle_len} cm")
    if handle_type:
        specs.append(f"Handle: {handle_type}")
    if hair:
        specs.append(f"Hair Blend: {hair}")

    if specs:
        lines.append("<p><strong>Brush Specs:</strong></p>")
        lines.append("<ul>")
        for s in specs:
            lines.append(f"<li>{s}</li>")
        lines.append("</ul>")

    # Best For as a short paragraph (NOT bullet list, NOT separate section)
    if best_uses:
        uses = [u.strip().lower() for u in best_uses.replace(";", ",").split(",") if u.strip()]
        if uses:
            # Capitalize first item, join with commas
            uses[0] = uses[0].capitalize()
            uses_text = ", ".join(uses)
            lines.append(f"<p><strong>Best for:</strong> {uses_text}.</p>")

    # Build / Feature callout (keep this)
    if build_feature and build_feature.strip():
        lines.append(f"<p><em>{build_feature}</em></p>")

    # NO "Ideal For" section

    return "\n".join(lines)


def read_products():
    wb = openpyxl.load_workbook(EXCEL_FILE, data_only=True)
    ws = wb["WooCommerce_Import"]
    hdrs = [cell.value for cell in ws[1]]
    products = []
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, values_only=False):
        data = {}
        for i, cell in enumerate(row):
            if i < len(hdrs) and hdrs[i]:
                data[hdrs[i]] = cell.value
        if data.get("Name"):
            products.append(data)
    return products


# Read Excel
products = read_products()
print(f"Read {len(products)} rows from Excel\n")

# Build mapping: SKU -> post_id from our product-mapping.json
with open(os.path.join(SCRIPT_DIR, "projects", "siconart", "product-mapping.json")) as f:
    mapping = json.load(f)

print("=== Updating short descriptions ===\n")
updated = 0
skipped = 0

for p in products:
    sku = p.get("SKU", "")
    name = p.get("Name", "")
    ptype = (p.get("Type", "") or "").lower().strip()
    
    if sku in EXCLUDED_SKUS:
        continue
    
    # Only update simple products and variable parents (not variations)
    if ptype == "variation":
        continue
    
    # Find post_id
    if sku in mapping.get("products", {}):
        post_id = mapping["products"][sku]["post_id"]
    else:
        print(f"  SKIP {sku} {name} - not in mapping")
        skipped += 1
        continue
    
    # Check if product still exists on site
    if post_id not in LIVE_PRODUCTS:
        print(f"  SKIP {sku} {name} (id={post_id}) - not on live site")
        skipped += 1
        continue
    
    # Build new short description
    new_desc = build_new_short_description(p)
    
    # Push update
    r = requests.put(f"{base}/wc-products/{post_id}",
                     json={"short_description": new_desc},
                     headers=headers, timeout=30)
    
    if r.status_code == 200:
        print(f"  OK  {sku} ({post_id}) {name}")
        updated += 1
    else:
        print(f"  ERR {sku} ({post_id}) {name}: {r.status_code} {r.text[:200]}")

print(f"\nDone! Updated: {updated}, Skipped: {skipped}")
