"use client";

export function CountryFlag({
  code,
  name,
  empty = "Country not recorded"
}: {
  code?: string;
  name?: string;
  empty?: string;
}) {
  const countryCode = (code || "").trim().toLowerCase();
  const countryName = (name || "").trim();
  if (!countryCode && !countryName) {
    return <span>{empty}</span>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      {countryCode ? (
        <img
          src={`https://flagcdn.com/w40/${countryCode}.png`}
          alt=""
          width={20}
          height={15}
          className="h-[15px] w-5 rounded-[2px] object-cover shadow-sm"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <span>{countryName || countryCode.toUpperCase()}</span>
    </span>
  );
}
