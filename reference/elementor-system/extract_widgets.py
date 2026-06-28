"""Extract elementskit-testimonial and elementskit-accordion widget settings."""
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
    if widgets:
        print(f"\n{'='*60}")
        print(f"SECTION {i} — Found {len(widgets)} widget(s)")
        print(f"{'='*60}")
        for w in widgets:
            wt = w["widgetType"]
            eid = w.get("id", "?")
            s = w.get("settings", {})
            print(f"\n  Widget: {wt} (id={eid})")
            
            if wt == "elementskit-testimonial":
                testimonials = s.get("ekit_testimonial_data", [])
                print(f"  Testimonials count: {len(testimonials)}")
                for j, t in enumerate(testimonials):
                    print(f"\n    --- Testimonial {j} ---")
                    print(f"    _id: {t.get('_id','')}")
                    print(f"    name: {t.get('ekit_testimonial_name','')}")
                    print(f"    designation: {t.get('ekit_testimonial_designation','')}")
                    print(f"    review: {t.get('ekit_testimonial_review','')[:150]}")
                    img = t.get("ekit_testimonial_reviewer_photo", {})
                    print(f"    photo_url: {img.get('url','')[-50:]}")
            
            elif wt == "elementskit-accordion":
                items = s.get("ekit_accordion_items", [])
                print(f"  Accordion items count: {len(items)}")
                for j, item in enumerate(items):
                    print(f"\n    --- FAQ {j} ---")
                    print(f"    _id: {item.get('_id','')}")
                    print(f"    title: {item.get('ekit_accordion_title','')}")
                    content = item.get("ekit_accordion_content", "")
                    print(f"    content: {content[:200]}")
