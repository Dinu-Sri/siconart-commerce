import math, json

rate = 7.25
data = [
    ('TW', 'Taiwan', 45), ('IN', 'India', 136), ('TH', 'Thailand', 45),
    ('JP', 'Japan', 50), ('SG', 'Singapore', 45), ('MY', 'Malaysia', 45),
    ('KR', 'South Korea', 60), ('VN', 'Vietnam', 26), ('PH', 'Philippines', 75),
    ('ID', 'Indonesia', 98), ('TR', 'Turkey', 128), ('AZ', 'Azerbaijan', 346),
    ('GE', 'Georgia', 190), ('FR', 'France', 110), ('GB', 'United Kingdom', 70),
    ('DE', 'Germany', 75), ('IT', 'Italy', 110), ('ES', 'Spain', 96),
    ('PT', 'Portugal', 98), ('NL', 'Netherlands', 86), ('CH', 'Switzerland', 136),
    ('SE', 'Sweden', 110), ('NO', 'Norway', 128), ('DK', 'Denmark', 110),
    ('FI', 'Finland', 118), ('GR', 'Greece', 116), ('AT', 'Austria', 110),
    ('BE', 'Belgium', 105), ('PL', 'Poland', 85), ('BY', 'Belarus', 76),
    ('RU', 'Russia', 70), ('US', 'United States', 67), ('CA', 'Canada', 150),
    ('MX', 'Mexico', 90), ('BR', 'Brazil', 185), ('AR', 'Argentina', 220),
    ('AU', 'Australia', 80), ('NZ', 'New Zealand', 160), ('ZA', 'South Africa', 150)
]

groups = {}
for code, name, rmb in data:
    usd = rmb / rate
    final = math.ceil(usd) + 1
    groups.setdefault(final, []).append((code, name))

zones = []
for price in sorted(groups.keys()):
    countries = groups[price]
    codes = [c[0] for c in countries]
    names = [c[1] for c in countries]
    zone_name = " / ".join(names) if len(names) <= 3 else names[0] + " + " + str(len(names)-1) + " more"
    zones.append({
        "zone_name": zone_name,
        "countries": codes,
        "cost": price
    })
    print("USD {:>2} | {}".format(price, ", ".join(names)))

print("\nTotal zones: {}".format(len(zones)))
print("Total countries: {}".format(sum(len(z["countries"]) for z in zones)))

# Save as JSON for API push
with open(r"c:\Users\User\Desktop\siconart web\shipping-zones.json", "w") as f:
    json.dump({"zones": zones}, f, indent=2)
print("\nSaved shipping-zones.json")
