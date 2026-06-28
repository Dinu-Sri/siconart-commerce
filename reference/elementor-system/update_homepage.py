"""Update homepage text content — replace lorem ipsum with Sicon Art content.
Skip section 0 (hero) and section 1 (marquee) and section 6 (carousel).
Only change text, not layout or images."""
import json

with open("projects/siconart/pages/home-backup.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

# ── TEXT REPLACEMENTS BY ELEMENT ID ──────────────────────────────────────
# Format: element_id -> { setting_key: new_value }

UPDATES = {
    # ═══════════════════════════════════════════════════════════════
    # SECTION 2 — "The Essence of Craftsmanship & Creativity"
    # About section with process steps
    # ═══════════════════════════════════════════════════════════════

    # Section heading — keep concept, refine for brushes
    "19945f4": {
        "sg_title_before": "The Art of ",
        "sg_title_focused": " Brush Making",
        "sg_title_after": " ",
    },

    # Section subtitle text
    "7bc8cc29": {
        "editor": "<p>Every Sicon Art brush begins as a vision - natural hair carefully selected, bamboo handles shaped by hand, and generations of craft knowledge woven into each stroke-ready tool.</p>"
    },

    # Button
    "2a90ff60": {
        "text": "Our Story",
        "link": {"url": "/about-us/", "is_external": False, "nofollow": False},
    },

    # Process step 1
    "3f385dc7": {"title": "Material Selection"},
    "2a8d1792": {"editor": "<p>Premium natural hair and bamboo sourced with care</p>"},

    # Process step 2
    "23235cc0": {"title": "Hand Assembly"},
    "7fe484f1": {"editor": "<p>Each brush tip shaped and bound by skilled artisans</p>"},

    # Process step 3
    "42e0c16d": {"title": "Quality Testing"},
    "4218242a": {"editor": "<p>Tested for water absorption, snap-back, and point</p>"},

    # ═══════════════════════════════════════════════════════════════
    # SECTION 3 — "Experience the Beauty of Handmade"
    # 4 feature cards
    # ═══════════════════════════════════════════════════════════════

    "5e22081": {
        "sg_title_before": "Experience the ",
        "sg_title_focused": " Craft ",
        "sg_title_after": " Behind Every Brush",
    },

    "1c5fdf00": {
        "editor": "<p>From raw materials to your easel, each Sicon Art brush passes through hands that understand what watercolor artists truly need.</p>"
    },

    # Card 1
    "38798acd": {"title": "Signature Series"},
    "dd057e4": {
        "editor": "<p>Curated brush collections designed for specific techniques, from fine detail to bold washes</p>"
    },

    # Card 2
    "26449805": {"title": "Gift Sets"},
    "716d97fe": {
        "editor": "<p>Beautifully packaged brush sets perfect for gifting to the watercolor artist in your life</p>"
    },

    # Card 3
    "6d7c1ab4": {"title": "Custom Orders"},
    "6a3518f9": {
        "editor": "<p>Work with our master brush makers to create brushes tailored to your unique painting style</p>"
    },

    # Card 4
    "7e830ab6": {"title": "Artisan Craft"},
    "a44910d": {
        "editor": "<p>Every brush is handmade using traditional Chinese brush-making methods passed down through generations</p>"
    },

    # ═══════════════════════════════════════════════════════════════
    # SECTION 4 — "Our Collections" (product showcase)
    # Product names and prices — update to match actual brushes
    # ═══════════════════════════════════════════════════════════════

    "3d1db70f": {"title": "Qin Brush"},
    "7127a3b2": {"editor": "<p>$8.50</p>"},

    "33daed63": {"title": "Run Hao"},
    "3db4e8a1": {"editor": "<p>$14.50</p>"},

    "63e8ea2f": {"title": "Chi Ling"},
    "25541dc8": {"editor": "<p>$7.00</p>"},

    "27e9b9dd": {
        "sg_title_before": "Our ",
        "sg_title_focused": " Collection ",
        "sg_title_after": "",
    },

    "1dbd8ad6": {
        "editor": "<p>Handcrafted Chinese watercolor brushes built for precision, flow, and control. From travel-sized companions to studio workhorses.</p>"
    },

    "5ac4f488": {
        "text": "Shop All Brushes",
        "link": {"url": "/shop/", "is_external": False, "nofollow": False},
    },

    # ═══════════════════════════════════════════════════════════════
    # SECTION 5 — "What Makes Us Different"
    # 4 feature blocks with icons
    # ═══════════════════════════════════════════════════════════════

    "21de78dd": {
        "sg_title_before": "Why Artists Choose ",
        "sg_title_focused": " Sicon Art",
        "sg_title_after": "",
    },

    "69e23dd1": {
        "editor": "<p>We are not just selling brushes - we are sharing a centuries-old tradition of Chinese brush craftsmanship, refined for the modern watercolor artist.</p>"
    },

    # Feature 1
    "5efbf834": {"title": "Authentic Chinese Craftsmanship"},
    "3d7aa89a": {
        "editor": "<p>Each brush is handmade in China using traditional techniques, with natural hair tips shaped for optimal water control and paint flow.</p>"
    },

    # Feature 2
    "46363dab": {"title": "Premium Natural Hair"},
    "2eaa5d09": {
        "editor": "<p>We use carefully selected goat, weasel, and blended natural hair that holds water generously and releases paint with precision.</p>"
    },

    # Feature 3
    "4864a83b": {"title": "Built for Watercolor"},
    "32c136bd": {
        "editor": "<p>Every brush is designed and tested specifically for watercolor - from the snap-back of the tip to the balance of the handle.</p>"
    },

    # Feature 4
    "7067e351": {"title": "Artist-Tested Quality"},
    "4cb55586": {
        "editor": "<p>Our brushes are tested by practising artists before they reach you, ensuring consistent performance across every stroke.</p>"
    },

    # ═══════════════════════════════════════════════════════════════
    # SECTION 7 — Testimonials heading
    # ═══════════════════════════════════════════════════════════════

    "5ef62aa7": {
        "sg_title_before": "What Artists Say About ",
        "sg_title_focused": " Sicon Art",
        "sg_title_after": "",
    },

    "5f267f7f": {
        "editor": "<p>Hear from watercolor artists around the world who trust Sicon Art brushes for their creative work.</p>"
    },

    # ═══════════════════════════════════════════════════════════════
    # SECTION 8 — FAQ heading
    # ═══════════════════════════════════════════════════════════════

    "2474003d": {
        "sg_title_before": "Frequently Asked ",
        "sg_title_focused": " Questions",
        "sg_title_after": "",
    },

    "32a14bb": {
        "editor": "<p>Everything you need to know about our brushes, materials, shipping, and care instructions.</p>"
    },

    "19bf2dbc": {
        "text": "Contact Us",
        "link": {"url": "/contact-us/", "is_external": False, "nofollow": False},
    },

    # ═══════════════════════════════════════════════════════════════
    # SECTION 9 — CTA / Discount banner
    # ═══════════════════════════════════════════════════════════════

    # Keep (5/5) rating text as-is
    # "2ff19031": no change

    "2244c470": {
        "sg_title_before": " Free Shipping on Orders ",
        "sg_title_focused": " Over $50",
        "sg_title_after": "",
    },

    "72ca5094": {
        "editor": "<p>Shop our full collection of handcrafted Chinese watercolor brushes. Worldwide delivery with tracking on every order.</p>"
    },

    "3a79076c": {
        "text": "Shop Now",
        "link": {"url": "/shop/", "is_external": False, "nofollow": False},
    },

    # ═══════════════════════════════════════════════════════════════
    # SECTION 10 — Blog heading
    # ═══════════════════════════════════════════════════════════════

    "df7823a": {
        "sg_title_before": "Our Latest ",
        "sg_title_focused": " Articles",
        "sg_title_after": "",
    },

    "28e2b91f": {
        "editor": "<p>Tips, techniques, and stories from the world of watercolor painting and Chinese brush artistry.</p>"
    },
}


# ── APPLY UPDATES ────────────────────────────────────────────────────────

def apply_updates(element):
    """Recursively find elements by ID and update their settings."""
    eid = element.get("id", "")
    if eid in UPDATES:
        updates = UPDATES[eid]
        for key, value in updates.items():
            element["settings"][key] = value
        print(f"  Updated: {eid} ({element.get('widgetType','')})")

    for child in element.get("elements", []):
        apply_updates(child)

print("=== Applying text updates ===\n")
for i, section in enumerate(ed):
    if i == 0:
        print(f"Section {i}: SKIPPED (hero)")
        continue
    apply_updates(section)

# ── SAVE ─────────────────────────────────────────────────────────────────
# Save as the working copy (not backup)
output = dict(data)
output["elementor_data"] = ed

with open("projects/siconart/pages/current-home.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\nSaved to: projects/siconart/pages/current-home.json")
print("Backup preserved at: projects/siconart/pages/home-backup.json")
