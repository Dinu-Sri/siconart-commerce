"""Dump ALL settings for testimonial and accordion widgets."""
import json

with open("projects/siconart/pages/home-backup.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

def find_widgets(el, targets):
    results = []
    wt = el.get("widgetType", "")
    if wt in targets:
        results.append(el)
    for child in el.get("elements", []):
        results.extend(find_widgets(child, targets))
    return results

for i, sec in enumerate(ed):
    widgets = find_widgets(sec, ["elementskit-testimonial", "elementskit-accordion"])
    for w in widgets:
        wt = w["widgetType"]
        eid = w.get("id", "?")
        s = w.get("settings", {})
        print(f"\n{'='*60}")
        print(f"SECTION {i} - {wt} (id={eid})")
        print(f"Total settings keys: {len(s)}")
        print(f"{'='*60}")
        
        # Print ALL keys
        for k, v in sorted(s.items()):
            if isinstance(v, list):
                print(f"  {k}: LIST[{len(v)}]")
                if len(v) > 0 and isinstance(v[0], dict):
                    # Print first item keys
                    print(f"    First item keys: {list(v[0].keys())}")
                    for j, item in enumerate(v[:2]):
                        print(f"    Item {j}: {json.dumps(item, ensure_ascii=False)[:300]}")
            elif isinstance(v, dict):
                print(f"  {k}: DICT {json.dumps(v, ensure_ascii=False)[:150]}")
            elif isinstance(v, str) and v:
                print(f"  {k}: '{v[:150]}'")
            elif isinstance(v, (int, float)) and v != 0:
                print(f"  {k}: {v}")
