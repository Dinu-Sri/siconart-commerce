"""Deep analysis of homepage — show ALL text elements with section context."""
import json

with open("projects/siconart/pages/home-backup.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

ed = data.get("elementor_data", data) if isinstance(data, dict) else data
if isinstance(ed, str):
    ed = json.loads(ed)

def walk(el, depth=0):
    prefix = "  " * depth
    et = el.get("elType", "?")
    wt = el.get("widgetType", "")
    s = el.get("settings", {})
    
    if et == "widget":
        if wt == "heading":
            hs = s.get("header_size", "?")
            title = s.get("title", "")
            print(f"{prefix}[heading {hs}] {title}")
        elif wt == "text-editor":
            text = s.get("editor", "").replace("\n", " ")[:200]
            print(f"{prefix}[text-editor] {text}")
        elif wt == "button":
            print(f"{prefix}[button] {s.get('text','')} -> {s.get('link',{}).get('url','')}")
        elif wt == "counter":
            print(f"{prefix}[counter] {s.get('ending_number','')} {s.get('suffix','')} - {s.get('title','')}")
        elif wt == "icon-list":
            items = s.get("icon_list", [])
            texts = [it.get("text","") for it in items]
            print(f"{prefix}[icon-list] {', '.join(texts)}")
        elif wt == "image":
            url = s.get("image", {}).get("url", "")
            fn = url.split("/")[-1] if url else "(none)"
            print(f"{prefix}[image] {fn}")
        elif wt == "star-rating":
            print(f"{prefix}[star-rating] {s.get('rating_value','')}")
        elif wt == "divider":
            print(f"{prefix}[divider]")
        elif wt == "spacer":
            pass
        elif wt == "social-icons":
            print(f"{prefix}[social-icons]")
        elif wt == "iconify-icon":
            print(f"{prefix}[iconify] {s.get('iconify_icon','')}")
        elif wt:
            print(f"{prefix}[{wt}]")
    elif et == "container":
        # don't print containers, just recurse
        pass
    
    for child in el.get("elements", []):
        walk(child, depth + 1)

for i, sec in enumerate(ed):
    print(f"\n{'='*60}")
    print(f"SECTION {i}")
    print(f"{'='*60}")
    walk(sec, 1)
