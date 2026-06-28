"""Analyze the homepage structure."""
import json

with open("projects/siconart/pages/home-backup.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

print(f"Top-level sections: {len(ed)}\n")

def find_texts(el, depth=0, max_depth=5):
    results = []
    if depth > max_depth:
        return results
    wt = el.get("widgetType", "")
    s = el.get("settings", {})
    if wt == "heading":
        results.append(("H:" + s.get("header_size", "?"), s.get("title", "")[:100]))
    elif wt == "text-editor":
        text = s.get("editor", "")[:120].replace("\n", " ")
        results.append(("TEXT", text))
    elif wt == "button":
        results.append(("BTN", s.get("text", "")[:50]))
    elif wt == "counter":
        results.append(("CTR", f"{s.get('ending_number','')} {s.get('suffix','')} - {s.get('title','')}"))
    elif wt == "icon-list":
        items = s.get("icon_list", [])
        for item in items[:3]:
            results.append(("ICON-LIST", item.get("text", "")[:80]))
    elif wt == "star-rating":
        results.append(("STARS", f"{s.get('rating_value','')}"))
    elif wt == "image":
        url = s.get("image", {}).get("url", "")
        results.append(("IMG", url[-60:] if url else "(no url)"))
    for child in el.get("elements", []):
        results.extend(find_texts(child, depth + 1))
    return results

for i, sec in enumerate(ed):
    settings = sec.get("settings", {})
    bg = settings.get("background_color", "")
    tag = settings.get("html_tag", "div")
    texts = find_texts(sec)
    print(f"=== Section {i} (tag={tag}, bg={bg or '?'}) ===")
    for kind, txt in texts[:12]:
        print(f"  {kind}: {txt}")
    if len(texts) > 12:
        print(f"  ... and {len(texts)-12} more elements")
    print()
