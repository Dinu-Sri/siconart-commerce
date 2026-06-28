"""Extract ALL text strings that need replacement from sections 2-10, in exact JSON format."""
import json

with open("projects/siconart/pages/home-backup.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

def extract_texts(el, section_idx, path=""):
    results = []
    wt = el.get("widgetType", "")
    s = el.get("settings", {})
    eid = el.get("id", "?")
    
    if wt == "jkit_heading":
        results.append({
            "section": section_idx,
            "widget": "jkit_heading",
            "id": eid,
            "sg_title_before": s.get("sg_title_before", ""),
            "sg_title_focused": s.get("sg_title_focused", ""),
            "sg_title_after": s.get("sg_title_after", ""),
        })
    elif wt == "text-editor":
        results.append({
            "section": section_idx,
            "widget": "text-editor",
            "id": eid,
            "editor": s.get("editor", ""),
        })
    elif wt == "heading":
        results.append({
            "section": section_idx,
            "widget": "heading",
            "id": eid,
            "header_size": s.get("header_size", ""),
            "title": s.get("title", ""),
        })
    elif wt == "button":
        results.append({
            "section": section_idx,
            "widget": "button",
            "id": eid,
            "text": s.get("text", ""),
            "link_url": s.get("link", {}).get("url", ""),
        })
    
    for child in el.get("elements", []):
        results.extend(extract_texts(child, section_idx))
    return results

all_texts = []
for i, sec in enumerate(ed):
    if i == 0:  # skip hero
        continue
    all_texts.extend(extract_texts(sec, i))

# Print organized by section
current_section = -1
for t in all_texts:
    if t["section"] != current_section:
        current_section = t["section"]
        print(f"\n{'='*60}")
        print(f"SECTION {current_section}")
        print(f"{'='*60}")
    
    w = t["widget"]
    eid = t["id"]
    if w == "jkit_heading":
        print(f"\n  [{w}] id={eid}")
        print(f"    before: '{t['sg_title_before']}'")
        print(f"    focused: '{t['sg_title_focused']}'")
        print(f"    after: '{t['sg_title_after']}'")
    elif w == "text-editor":
        print(f"\n  [{w}] id={eid}")
        print(f"    text: {t['editor'][:200]}")
    elif w == "heading":
        print(f"\n  [{w} {t['header_size']}] id={eid}")
        print(f"    title: {t['title']}")
    elif w == "button":
        print(f"\n  [{w}] id={eid}")
        print(f"    text: {t['text']}, url: {t['link_url']}")
