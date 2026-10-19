"use client";

import { useMemo, useState } from "react";
import type { CertificateCountry } from "@/data/certificate-countries";
import type { BrandAgentListItem } from "@/lib/agent-certificates";
import type { CertificatePeriodKind } from "@/lib/agent-certificate-dates";

type AgentRow = BrandAgentListItem;
type CertRow = AgentRow["certificates"][number];

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
  if (days > 1) return `${days} days left / 剩余 ${days} 天`;
  if (days === 1) return "1 day left / 剩余 1 天";
  if (days === 0) return "Expires today / 今天到期";
  if (days === -1) return "Expired yesterday / 昨天已到期";
  return `Expired ${Math.abs(days)} days ago / 已过期 ${Math.abs(days)} 天`;
}

function Bi({ en, zh }: { en: string; zh: string }) {
  return (
    <>
      {en} <span className="font-normal opacity-80">{zh}</span>
    </>
  );
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
  const [countryCode, setCountryCode] = useState("");
  const [periodKind, setPeriodKind] = useState<CertificatePeriodKind>("1y");
  const [startsAt, setStartsAt] = useState(localToday);
  const [endsAt, setEndsAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [downloadingCode, setDownloadingCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [extendId, setExtendId] = useState<string | null>(null);
  const [extendKind, setExtendKind] = useState<CertificatePeriodKind>("1y");
  const [extendStart, setExtendStart] = useState(localToday);
  const [extendEnd, setExtendEnd] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<{ code: string; companyName: string } | null>(null);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name, "en")),
    [countries]
  );
  const selectedCountry = sortedCountries.find((country) => country.code === countryCode) ?? null;

  const visibleAgents = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return agents.filter((agent) => {
      const archived = agent.archivedCertificates ?? [];
      if (!showArchived && !agent.latest) return false;
      if (!needle) return true;
      return [agent.companyName, agent.countryName, agent.officialEn, agent.latest?.code ?? "", ...archived.map((cert) => cert.code)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [agents, search, showArchived]);

  async function postJson(url: string, body: unknown) {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; agents?: AgentRow[] } | null;
    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || "Request failed / 请求失败");
    }
    if (data.agents) setAgents(data.agents);
  }

  async function downloadCertificatePdf(code: string) {
    setDownloadingCode(code);
    setError("");
    try {
      const response = await fetch(`/api/list/certificates/${encodeURIComponent(code)}/pdf`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/pdf" }
      });
      if (!response.ok) {
        throw new Error("PDF download failed. Please refresh and try again. / 无法下载 PDF，请刷新后重试。");
      }
      const blob = await response.blob();
      if (blob.type.includes("json")) {
        throw new Error("PDF download failed. Please refresh and try again. / 无法下载 PDF，请刷新后重试。");
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SiconArt-Authorization-${code}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF download failed. / 无法下载 PDF。");
    } finally {
      setDownloadingCode("");
    }
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
      setNotice("Certificate created. Open Update certificates to download it. / 授权书已生成。请到「更新授权书」下载。");
      setCompanyName("");
      setCountryCode("");
      setTab("update");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the certificate / 无法生成授权书");
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
      setNotice("Certificate extended. Download the new PDF from this record. / 授权已续期。请下载新的 PDF。");
      setExtendId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to extend the certificate / 无法续期授权书");
    } finally {
      setBusy(false);
    }
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await postJson(`/api/list/certificates/${encodeURIComponent(archiveTarget.code)}/archive`, { archived: true });
      setNotice("Certificate archived and hidden from this list. / 授权书已归档并从列表中隐藏。");
      setArchiveTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to archive the certificate / 无法归档授权书");
    } finally {
      setBusy(false);
    }
  }

  async function onUnarchive(code: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await postJson(`/api/list/certificates/${encodeURIComponent(code)}/archive`, { archived: false });
      setNotice("Certificate restored to this list. / 授权书已恢复到列表。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to restore the certificate / 无法恢复授权书");
    } finally {
      setBusy(false);
    }
  }

  const fieldClass =
    "w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-base outline-none focus:border-[#a67146]";
  const periodOptions = [
    ["1y", "1 year", "一年"],
    ["3y", "3 years", "三年"],
    ["custom", "Custom", "自定义"]
  ] as const;

  function periodButtons(value: CertificatePeriodKind, onChange: (next: CertificatePeriodKind) => void) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {periodOptions.map(([next, en, zh]) => (
          <button
            key={next}
            type="button"
            onClick={() => onChange(next)}
            className={`rounded-[0.5rem] border px-2 py-3 text-sm font-semibold leading-tight ${
              value === next
                ? "border-[#a67146] bg-[#a67146] text-white"
                : "border-[#ead9c3] bg-[#fef9ef] text-[#6d4b32]"
            }`}
          >
            <span className="block">{en}</span>
            <span className="block text-[11px] font-medium opacity-80">{zh}</span>
          </button>
        ))}
      </div>
    );
  }

  function certActions(cert: CertRow, agent: AgentRow) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          disabled={Boolean(downloadingCode)}
          onClick={() => void downloadCertificatePdf(cert.code)}
          className="inline-flex items-center justify-center rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {downloadingCode === cert.code ? <Bi en="Downloading…" zh="下载中…" /> : <Bi en="Download PDF" zh="下载 PDF" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setExtendId(extendId === agent.id ? null : agent.id);
            setExtendKind("1y");
            setExtendStart(localToday());
            setExtendEnd("");
          }}
          className="inline-flex items-center justify-center rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
        >
          <Bi en="Extend" zh="续期" />
        </button>
        <button
          type="button"
          onClick={() => setArchiveTarget({ code: cert.code, companyName: agent.companyName })}
          className="inline-flex items-center justify-center rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
        >
          <Bi en="Archive" zh="归档" />
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-3 py-3 sm:px-5 sm:py-5">
      <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
        Agents <span className="font-normal text-[#8a6d56]">代理</span>
      </h1>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#8a6d56]">
        Create brand authorization certificates and keep their remaining days in view.
        <span className="mt-1 block font-medium">创建品牌授权书，并查看剩余有效天数。</span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTab("add")}
          className={`rounded-[0.5rem] border px-3 py-3 text-sm font-semibold leading-tight ${
            tab === "add" ? "border-[#a67146] bg-[#a67146] text-white" : "border-[#ead9c3] bg-white text-[#6d4b32]"
          }`}
        >
          <span className="block">Add new agent</span>
          <span className="block text-[11px] font-medium opacity-80">新增代理</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("update")}
          className={`rounded-[0.5rem] border px-3 py-3 text-sm font-semibold leading-tight ${
            tab === "update" ? "border-[#a67146] bg-[#a67146] text-white" : "border-[#ead9c3] bg-white text-[#6d4b32]"
          }`}
        >
          <span className="block">Update certificates</span>
          <span className="block text-[11px] font-medium opacity-80">更新授权书</span>
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-[0.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 rounded-[0.5rem] border border-[#ead9c3] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#523A27]">
          {notice}
        </p>
      ) : null}

      {tab === "add" ? (
        <form onSubmit={onCreate} className="mt-5 grid gap-4 rounded-[1rem] border border-[#ead9c3] bg-white p-4 sm:p-6">
          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            <Bi en="Company name" zh="公司名称" />
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
              minLength={2}
              placeholder="ABC Company Pvt Ltd"
              className={fieldClass}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            <Bi en="Country" zh="国家/地区" />
            <select
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              required
              className={fieldClass}
            >
              <option value="">Select a country / 请选择国家/地区</option>
              {sortedCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          {selectedCountry ? (
            <p className="rounded-[0.5rem] bg-[#f7efe3] px-3 py-3 text-sm leading-6 text-[#523A27]">
              <Bi en="Certificate will print:" zh="授权书将打印：" />{" "}
              <span className="font-semibold">{selectedCountry.officialZh}</span>
              <span className="mt-1 block text-[#8a6d56]">{selectedCountry.officialEn}</span>
            </p>
          ) : null}

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-[#6d4b32]">
              <Bi en="Certificate duration" zh="授权期限" />
            </legend>
            {periodButtons(periodKind, setPeriodKind)}
          </fieldset>

          <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
            <Bi en="Start date" zh="开始日期" />
            <input type="date" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={fieldClass} required />
          </label>
          {periodKind === "custom" ? (
            <label className="grid gap-2 text-sm font-semibold text-[#6d4b32]">
              <Bi en="End date" zh="结束日期" />
              <input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={fieldClass} required />
            </label>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Bi en="Creating…" zh="生成中…" /> : <Bi en="Generate certificate" zh="生成授权书" />}
          </button>
        </form>
      ) : (
        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="sr-only">Search company, country, or code / 搜索公司、国家或编号</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, country, or code / 搜索公司、国家或编号"
              className={fieldClass}
            />
          </label>
          {visibleAgents.length === 0 ? (
            <p className="rounded-[0.5rem] border border-[#ead9c3] bg-white px-5 py-10 text-center text-sm font-semibold leading-6 text-[#8a6d56]">
              No agent certificates yet.
              <span className="mt-1 block font-medium">暂无代理授权书。</span>
            </p>
          ) : (
            visibleAgents.map((agent) => {
              const latest = agent.latest;
              const archived = agent.archivedCertificates ?? [];
              return (
                <article key={agent.id} className="rounded-[1rem] border border-[#ead9c3] bg-white p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="break-words font-serif text-xl font-semibold">{agent.companyName}</h2>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[#8a6d56]">
                        {agent.countryName} · {agent.officialEn}
                        <span className="mt-1 block font-medium">{agent.officialZh}</span>
                      </p>
                    </div>
                    {latest ? (
                      <span
                        className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          latest.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {latest.active ? "Active 有效" : "Expired 已过期"}
                      </span>
                    ) : null}
                  </div>
                  {latest ? (
                    <dl className="mt-4 grid gap-2 text-sm text-[#523A27]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#8a6d56]">
                          <Bi en="Code" zh="编号" />
                        </dt>
                        <dd className="font-mono font-semibold">{latest.code}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#8a6d56]">
                          <Bi en="Valid" zh="有效期" />
                        </dt>
                        <dd className="text-right">
                          {formatDay(latest.startsAt)} – {formatDay(latest.endsAt)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#8a6d56]">
                          <Bi en="Remaining" zh="剩余天数" />
                        </dt>
                        <dd className="text-right font-semibold">{remainingLabel(latest.remainingDays)}</dd>
                      </div>
                    </dl>
                  ) : null}
                  {latest ? certActions(latest, agent) : null}
                  {extendId === agent.id ? (
                    <div className="mt-4 grid gap-3 rounded-[0.5rem] bg-[#f7efe3] p-3">
                      {periodButtons(extendKind, setExtendKind)}
                      {extendKind === "custom" ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-1 text-sm font-semibold text-[#6d4b32]">
                            <Bi en="Start" zh="开始" />
                            <input
                              type="date"
                              value={extendStart}
                              onChange={(event) => setExtendStart(event.target.value)}
                              className={fieldClass}
                            />
                          </label>
                          <label className="grid gap-1 text-sm font-semibold text-[#6d4b32]">
                            <Bi en="End" zh="结束" />
                            <input
                              type="date"
                              value={extendEnd}
                              onChange={(event) => setExtendEnd(event.target.value)}
                              className={fieldClass}
                            />
                          </label>
                        </div>
                      ) : (
                        <p className="text-sm leading-6 text-[#6d4b32]">
                          New term starts when the current certificate ends, or today if it has already expired.
                          <span className="mt-1 block">新的授权期限将从当前授权结束次日开始；若已过期则从今天开始。</span>
                        </p>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onExtend(agent.id)}
                        className="rounded-[0.5rem] bg-[#523A27] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {busy ? <Bi en="Saving…" zh="保存中…" /> : <Bi en="Save extension" zh="保存续期" />}
                      </button>
                    </div>
                  ) : null}
                  {agent.certificates.length > 1 ? (
                    <details className="mt-4 text-sm text-[#6d4b32]">
                      <summary className="cursor-pointer font-semibold">
                        <Bi en={`Earlier certificates (${agent.certificates.length - 1})`} zh={`历史授权书（${agent.certificates.length - 1}）`} />
                      </summary>
                      <ul className="mt-2 grid gap-2">
                        {agent.certificates.slice(1).map((cert) => (
                          <li key={cert.id} className="grid gap-2 rounded-[0.5rem] bg-[#fef9ef] px-3 py-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                            <span className="font-mono">{cert.code}</span>
                            <span className="text-[#8a6d56]">
                              {formatDay(cert.startsAt)} – {formatDay(cert.endsAt)}
                            </span>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                className="font-semibold text-[#a67146]"
                                onClick={() => void downloadCertificatePdf(cert.code)}
                              >
                                PDF
                              </button>
                              <button
                                type="button"
                                className="font-semibold text-[#6d4b32]"
                                onClick={() => setArchiveTarget({ code: cert.code, companyName: agent.companyName })}
                              >
                                <Bi en="Archive" zh="归档" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                  {showArchived && archived.length > 0 ? (
                    <details className="mt-4 text-sm text-[#6d4b32]" open>
                      <summary className="cursor-pointer font-semibold">
                        <Bi en={`Archived (${archived.length})`} zh={`已归档（${archived.length}）`} />
                      </summary>
                      <ul className="mt-2 grid gap-2">
                        {archived.map((cert) => (
                          <li key={cert.id} className="grid gap-2 rounded-[0.5rem] bg-[#f7efe3] px-3 py-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                            <span className="font-mono">{cert.code}</span>
                            <span className="text-[#8a6d56]">
                              {formatDay(cert.startsAt)} – {formatDay(cert.endsAt)}
                            </span>
                            <button
                              type="button"
                              disabled={busy}
                              className="font-semibold text-[#a67146]"
                              onClick={() => void onUnarchive(cert.code)}
                            >
                              <Bi en="Unarchive" zh="取消归档" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              );
            })
          )}
          <button
            type="button"
            onClick={() => setShowArchived((current) => !current)}
            className="rounded-[0.5rem] border border-[#ead9c3] bg-white px-4 py-3 text-sm font-semibold text-[#6d4b32]"
          >
            {showArchived ? <Bi en="Hide archived" zh="隐藏已归档" /> : <Bi en="Show archived" zh="显示已归档" />}
          </button>
        </div>
      )}

      {archiveTarget ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setArchiveTarget(null);
          }}
        >
          <div className="w-full max-w-md rounded-[1rem] bg-white p-5 shadow-2xl">
            <h2 id="archive-title" className="font-serif text-xl font-semibold text-[#2f2118]">
              Archive this certificate?
              <span className="mt-1 block text-base font-normal text-[#8a6d56]">确认归档此授权书？</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6d4b32]">
              {archiveTarget.companyName}
              <span className="mt-1 block font-mono font-semibold">{archiveTarget.code}</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-[#8a6d56]">
              It will be hidden from this list. The record is not deleted.
              <span className="mt-1 block">归档后将从列表中隐藏，不会删除记录。</span>
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setArchiveTarget(null)}
                className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
              >
                <Bi en="Cancel" zh="取消" />
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmArchive()}
                className="rounded-[0.5rem] bg-[#523A27] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? <Bi en="Saving…" zh="保存中…" /> : <Bi en="Archive" zh="归档" />}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
