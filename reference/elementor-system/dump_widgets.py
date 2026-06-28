"""Dump all non-empty settings keys for testimonial and accordion widgets."""
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
        print(f"SECTION {i} — {wt} (id={eid})")
        print(f"{'='*60}")
        
        # Find list/repeater fields
        for k, v in s.items():
            if isinstance(v, list) and len(v) > 0 and isinstance(v[0], dict):
                print(f"\n  REPEATER: {k} ({len(v)} items)")
                for j, item in enumerate(v):
                    print(f"\n    Item {j}:")
                    for ik, iv in item.items():
                        if iv and iv != "" and iv != 0:
                            sv = str(iv)[:200]
                            print(f"      {ik}: {sv}")
            elif isinstance(v, str) and len(v) > 0 and ("title" in k.lower() or "content" in k.lower() or "review" in k.lower() or "name" in k.lower() or "desc" in k.lower() or "text" in k.lower()):
                print(f"\n  STRING: {k} = {v[:200]}")
