"""Extract jkit_heading texts and all text details for non-hero sections."""
import json

with open("projects/siconart/pages/home-backup.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

def walk_jkit(el, depth=0):
    wt = el.get("widgetType", "")
    s = el.get("settings", {})
    if wt == "jkit_heading":
        title = s.get("sg_title_title", s.get("title", ""))
        sub = s.get("sg_subtitle_title", s.get("sg_subtitle_description",""))
        focused = s.get("sg_title_focused", "")
        before = s.get("sg_title_before", "")
        after = s.get("sg_title_after", "")
        print(f"  [jkit_heading] before='{before}' focused='{focused}' after='{after}'")
        if sub:
            print(f"    subtitle: {sub[:100]}")
        # Print all sg_ keys
        for k, v in s.items():
            if k.startswith("sg_title") or k.startswith("sg_subtitle"):
                if v and not k.endswith("_responsive") and "typography" not in k and "color" not in k and "shadow" not in k and "padding" not in k and "margin" not in k:
                    sv = str(v)[:100]
                    print(f"    {k}: {sv}")
    for child in el.get("elements", []):
        walk_jkit(child, depth + 1)

for i, sec in enumerate(ed):
    if i == 0:
        continue  # skip hero
    print(f"\n--- Section {i} ---")
    walk_jkit(sec)
