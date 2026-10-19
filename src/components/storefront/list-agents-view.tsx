"use client";

import { useMemo, useState } from "react";
import type { CertificateCountry } from "@/data/certificate-countries";
import type { BrandAgentListItem } from "@/lib/agent-certificates";
import type { CertificatePeriodKind } from "@/lib/agent-certificate-dates";

type AgentRow = BrandAgentListItem;

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

function remainingLabel(days: number) {
  if (days > 1) return `${days} days left`;
  if (days === 1) return "1 day left";
  if (days === 0) return "Expires today";
  if (days === -1) return "Expired yesterday";
  return `Expired ${Math.abs(days)} days ago`;
}

export function ListAgentsView({
  agents: initialAgents,
  countries
}: {
  agents: AgentRow[];
  countries: CertificateCountry[];
}) {
  const [tab, setTab] = useState<"add" | "update">("add");
  const [agents, setAgents] = useState(initialAgents);
  const [companyName, setCompanyName] = useState("");
  const [countryCode, setCountryCode] = useState("LK");
  const [countryQuery, setCountryQuery] = useState("");
  const [periodKind, setPeriodKind] = useState<CertificatePeriodKind>("1y");
  const [startsAt, setStartsAt] = useState(localToday);
  const [endsAt, setEndsAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [extendId, setExtendId] = useState<string | null>(null);
  const [extendKind, setExtendKind] = useState<CertificatePeriodKind>("1y");
  const [extendStart, setExtendStart] = useState(localToday);
  const [extendEnd, setExtendEnd] = useState("");
  const [search, setSearch] = useState("");

  const selectedCountry = countries.find((country) => country.code === countryCode) ?? null;
  const filteredCountries = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase();
    const list = !needle
      ? countries
      : countries.filter((country) =>
          `${country.name} ${country.officialEn} ${country.officialZh} ${country.code}`.toLowerCase().includes(needle)
        );
    if (!list.some((country) => country.code === countryCode)) {
      const selected = countries.find((country) => country.code === countryCode);
      if (selected) return [selected, ...list];
    }
    return list;
  }, [countries, countryQuery, countryCode]);

  const visibleAgents = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return agents;
    return agents.filter((agent) =>
      [agent.companyName, agent.countryName, agent.officialEn, agent.latest?.code ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [agents, search]);

  async function postJson(url: string, body: unknown) {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; agents?: AgentRow[] } | null;
    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || "Request failed");
    }
    if (data.agents) setAgents(data.agents);
  }

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await postJson("/api/list/agents", {
        companyName,
        countryCode,
        periodKind,
        startsAt,
        endsAt: periodKind === "custom" ? endsAt : undefined
      });
      setNotice("Certificate created. Open Update certificates to download it.");
      setCompanyName("");
      setTab("update");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the certificate");
    } finally {
      setBusy(false);
    }
  }

  async function onExtend(agentId: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await postJson(`/api/list/agents/${agentId}/certificates`, {
        periodKind: extendKind,
        startsAt: extendKind === "custom" ? extendStart : undefined,
        endsAt: extendKind === "custom" ? extendEnd : undefined
      });
      setNotice("Certificate extended. Download the new PDF from this record.");
      setExtendId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to extend the certificate");
    } finally {
      setBusy(false);
    }
  }

  const fieldClass =
    "w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-base outline-none focus:border-[#a67146]";

  return (
    <section className="mx-auto w-full max-w-4xl px-3 py-3 sm:px-5 sm:py-5">
      <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Agents</h1>
      <p className="mt-1 text-sm font-semibold text-[#8a6d56]">
        Create brand authorization certificates and keep their remaining days in view.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTab("add")}
          className={`rounded-[0.5rem] border px-3 py-3 text-sm font-semibold ${
            tab === "add" ? "border-[#a67146] bg-[#a67146] text-white" : "border-[#ead9c3] bg-white text-[#6d4b32]"
          }`}
        >
          Add new agent
        </button>
        <button
          type="button"
          onClick={() => setTab("update")}
          className={`rounded-[0.5rem] border px-3 py-3 text-sm font-semibold ${
            tab === "update" ? "border-[#a67146] bg-[#a67146] text-white" : "border-[#ead9c3] bg-white text-[#6d4b32]"
          }`}
        >
          Update certificates
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-[0.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 rounded-[0.5rem] border border-[#ead9c3] bg-white px-4 py-3 text-sm font-semibold text-[#523A27]">
          {notice}
        </p>
      ) : null}

      {tab === "add" ? (
        <form onSubmit={onCreate} className="mt-5 grid gap-4 rounded-[1rem] border border-[#ead9c3] bg-white p-4 sm:p-6">
          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            Company name
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
              minLength={2}
              placeholder="Clossyan Technologies (PVT) Ltd"
              className={fieldClass}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            Search country
            <input
              value={countryQuery}
              onChange={(event) => setCountryQuery(event.target.value)}
              placeholder="Sri Lanka"
              className={fieldClass}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            Country
            <select
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className={fieldClass}
            >
              {filteredCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          {selectedCountry ? (
            <p className="rounded-[0.5rem] bg-[#f7efe3] px-3 py-3 text-sm leading-6 text-[#523A27]">
              Certificate will print: <span className="font-semibold">{selectedCountry.officialZh}</span>
              <span className="mt-1 block text-[#8a6d56]">{selectedCountry.officialEn}</span>
            </p>
          ) : null}

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-[#6d4b32]">Certificate duration</legend>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["1y", "1 year"],
                  ["3y", "3 years"],
                  ["custom", "Custom"]
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriodKind(value)}
                  className={`rounded-[0.5rem] border px-2 py-3 text-sm font-semibold ${
                    periodKind === value
                      ? "border-[#a67146] bg-[#a67146] text-white"
                      : "border-[#ead9c3] bg-[#fef9ef] text-[#6d4b32]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            Start date
            <input type="date" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={fieldClass} required />
          </label>
          {periodKind === "custom" ? (
            <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
              End date
              <input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={fieldClass} required />
            </label>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Creating…" : "Generate certificate"}
          </button>
        </form>
      ) : (
        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="sr-only">Search agents</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, country, or code"
              className={fieldClass}
            />
          </label>
          {visibleAgents.length === 0 ? (
            <p className="rounded-[0.5rem] border border-[#ead9c3] bg-white px-5 py-10 text-center text-sm font-semibold text-[#8a6d56]">
              No agent certificates yet.
            </p>
          ) : (
            visibleAgents.map((agent) => {
              const latest = agent.latest;
              return (
                <article key={agent.id} className="rounded-[1rem] border border-[#ead9c3] bg-white p-4 sm:p-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-semibold">{agent.companyName}</h2>
                      <p className="mt-1 text-sm font-semibold text-[#8a6d56]">
                        {agent.countryName} · {agent.officialEn}
                      </p>
                    </div>
                    {latest ? (
                      <span
                        className={`mt-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          latest.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {latest.active ? "Active" : "Expired"}
                      </span>
                    ) : null}
                  </div>
                  {latest ? (
                    <dl className="mt-4 grid gap-2 text-sm text-[#523A27]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#8a6d56]">Code</dt>
                        <dd className="font-mono font-semibold">{latest.code}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#8a6d56]">Valid</dt>
                        <dd>
                          {formatDay(latest.startsAt)} – {formatDay(latest.endsAt)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#8a6d56]">Remaining</dt>
                        <dd className="font-semibold">{remainingLabel(latest.remainingDays)}</dd>
                      </div>
                    </dl>
                  ) : null}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {latest ? (
                      <a
                        href={`/api/list/certificates/${latest.code}/pdf`}
                        className="inline-flex flex-1 items-center justify-center rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white"
                      >
                        Download PDF
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setExtendId(extendId === agent.id ? null : agent.id);
                        setExtendKind("1y");
                        setExtendStart(localToday());
                        setExtendEnd("");
                      }}
                      className="inline-flex flex-1 items-center justify-center rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
                    >
                      Extend
                    </button>
                  </div>
                  {extendId === agent.id ? (
                    <div className="mt-4 grid gap-3 rounded-[0.5rem] bg-[#f7efe3] p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            ["1y", "1 year"],
                            ["3y", "3 years"],
                            ["custom", "Custom"]
                          ] as const
                        ).map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setExtendKind(value)}
                            className={`rounded-[0.5rem] border px-2 py-3 text-sm font-semibold ${
                              extendKind === value
                                ? "border-[#a67146] bg-[#a67146] text-white"
                                : "border-[#ead9c3] bg-white text-[#6d4b32]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {extendKind === "custom" ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-1 text-sm font-semibold text-[#6d4b32]">
                            Start
                            <input
                              type="date"
                              value={extendStart}
                              onChange={(event) => setExtendStart(event.target.value)}
                              className={fieldClass}
                            />
                          </label>
                          <label className="grid gap-1 text-sm font-semibold text-[#6d4b32]">
                            End
                            <input
                              type="date"
                              value={extendEnd}
                              onChange={(event) => setExtendEnd(event.target.value)}
                              className={fieldClass}
                            />
                          </label>
                        </div>
                      ) : (
                        <p className="text-sm text-[#6d4b32]">
                          New term starts when the current certificate ends, or today if it has already expired.
                        </p>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onExtend(agent.id)}
                        className="rounded-[0.5rem] bg-[#523A27] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {busy ? "Saving…" : "Save extension"}
                      </button>
                    </div>
                  ) : null}
                  {agent.certificates.length > 1 ? (
                    <details className="mt-4 text-sm text-[#6d4b32]">
                      <summary className="cursor-pointer font-semibold">Earlier certificates ({agent.certificates.length - 1})</summary>
                      <ul className="mt-2 grid gap-2">
                        {agent.certificates.slice(1).map((cert) => (
                          <li key={cert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[0.5rem] bg-[#fef9ef] px-3 py-2">
                            <span className="font-mono">{cert.code}</span>
                            <span>
                              {formatDay(cert.startsAt)} – {formatDay(cert.endsAt)}
                            </span>
                            <a href={`/api/list/certificates/${cert.code}/pdf`} className="font-semibold text-[#a67146]">
                              PDF
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
