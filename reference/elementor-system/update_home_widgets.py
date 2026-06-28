"""Update testimonials and FAQ sections on the homepage."""
import json

with open("projects/siconart/pages/current-home.json", "r", encoding="utf-8") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

# ── TESTIMONIAL UPDATES ─────────────────────────────────────────────────
TESTIMONIAL_UPDATES = {
    "afc2375": {
        "client_name": "Jhon Martin",
        "designation": "Watercolor Artist",
        "review": "These brushes hold water like nothing I have used before. The snap-back on the tip is incredible - perfect for fine detail work and broad washes alike.",
    },
    "10096ca": {
        "client_name": "Emma Colins",
        "designation": "Art Instructor",
        "review": "I recommend Sicon Art brushes to all my students. The natural hair tips give you so much control, and they are built to last through years of daily use.",
    },
    "5695ee2": {
        "client_name": "Olivia Reed",
        "designation": "Plein Air Painter",
        "review": "The travel brushes are a game-changer for painting outdoors. Compact, lightweight, and they still perform like full-sized studio brushes. Truly impressed.",
    },
    "7d39834": {
        "client_name": "David Chen",
        "designation": "Professional Illustrator",
        "review": "The quality-to-price ratio is unmatched. I have tried brushes three times the cost that do not perform as well as these. My go-to brand now.",
    },
}

# ── FAQ UPDATES ──────────────────────────────────────────────────────────
FAQ_UPDATES = {
    "14d0390": {
        "acc_title": "What makes Sicon Art brushes different from other brands?",
        "acc_content": "<p>Every Sicon Art brush is handcrafted using traditional Chinese brush-making techniques. We use premium natural hair that holds water generously and releases paint with precision. Each brush is tested by practising artists before it reaches you.</p>",
    },
    "2eef0af": {
        "acc_title": "What type of hair is used in your brushes?",
        "acc_content": "<p>We use carefully selected natural hair blends including goat, weasel, and mixed hair. Each blend is chosen for specific painting needs - goat hair for soft washes, weasel for fine detail, and blended tips for versatile all-round performance.</p>",
    },
    "3b19e20": {
        "acc_title": "Do you ship internationally?",
        "acc_content": "<p>Yes, we ship worldwide with tracking on every order. Orders over $50 qualify for free shipping. Most orders are dispatched within 2-3 business days and arrive within 7-14 days depending on your location.</p>",
    },
}


def update_widgets(element):
    """Recursively find and update testimonial/accordion widgets."""
    wt = element.get("widgetType", "")
    s = element.get("settings", {})
    
    if wt == "elementskit-testimonial":
        items = s.get("ekit_testimonial_data", [])
        for item in items:
            item_id = item.get("_id", "")
            if item_id in TESTIMONIAL_UPDATES:
                for k, v in TESTIMONIAL_UPDATES[item_id].items():
                    item[k] = v
                print(f"  Updated testimonial: {item_id} ({TESTIMONIAL_UPDATES[item_id]['client_name']})")
    
    elif wt == "elementskit-accordion":
        items = s.get("ekit_accordion_items", [])
        for item in items:
            item_id = item.get("_id", "")
            if item_id in FAQ_UPDATES:
                for k, v in FAQ_UPDATES[item_id].items():
                    item[k] = v
                print(f"  Updated FAQ: {item_id} ({FAQ_UPDATES[item_id]['acc_title'][:50]}...)")
    
    for child in element.get("elements", []):
        update_widgets(child)


print("=== Updating testimonials and FAQ ===\n")
for i, sec in enumerate(ed):
    update_widgets(sec)

# Save
output = dict(data)
output["elementor_data"] = ed

with open("projects/siconart/pages/current-home.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("\nSaved to: projects/siconart/pages/current-home.json")
