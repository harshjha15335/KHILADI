import React, { useEffect, useMemo, useState } from "react";
import type { Player } from "../types";
import { loadPlayers } from "../utils/api";
import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { KhiladiKineticText } from "../components/KhiladiKineticText";
import { AnalyticsIntro } from "../components/AnalyticsIntro";

type RoleFilter = "All" | "Batter" | "Bowler" | "All-Rounder" | "Other";
const DISPLAY_ROLES: RoleFilter[] = ["All", "Batter", "Bowler", "All-Rounder", "Other"];

export function DataExplorerPage({
  onSelectPlayer,
}: {
  onSelectPlayer: (player: Player) => void;
}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("All");
  const [royalsOnly, setRoyalsOnly] = useState(false);
  const [limit, setLimit] = useState(24);
  useEffect(() => {
    let active = true;
    setLoadError("");
    loadPlayers()
      .then((records) => {
        if (active) setPlayers(records);
      })
      .catch(() => {
        if (active) setLoadError("Canonical player records could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [retry]);

  const counts = useMemo(() => {
    const result = new Map<RoleFilter, number>();
    for (const entry of DISPLAY_ROLES) result.set(entry, 0);
    for (const player of players) {
      result.set("All", (result.get("All") ?? 0) + 1);
      const value: RoleFilter =
        player.role === "Batter" || player.role === "Bowler" || player.role === "All-Rounder"
          ? player.role
          : "Other";
      result.set(value, (result.get(value) ?? 0) + 1);
    }
    return result;
  }, [players]);

  const matching = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("en");
    return players
      .filter((player) => {
        const playerRole: RoleFilter =
          player.role === "Batter" || player.role === "Bowler" || player.role === "All-Rounder"
            ? player.role
            : "Other";
        return (
          (role === "All" || playerRole === role) &&
          (!royalsOnly || player.is_rr) &&
          (!search ||
            player.player_name.toLocaleLowerCase("en").includes(search) ||
            String(player.player_id) === search)
        );
      })
      .sort((a, b) =>
        a.player_name.localeCompare(b.player_name) || a.player_id - b.player_id,
      );
  }, [players, query, role, royalsOnly]);

  const royalsCount = players.filter((p) => p.is_rr).length;
  const maxCount = Math.max(1, ...DISPLAY_ROLES.slice(1).map((r) => counts.get(r) ?? 0));

  return (
    <div className="min-h-screen bg-[#FFFDF8] px-5 pb-24 pt-32 text-[#182643]">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <header className="grid gap-7 border-b border-[#CBD5E9] pb-12 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#2450B8]">
              KHILADI / Data Explorer
            </p>
            <KhiladiKineticText
              as="h1"
              text="Know the player pool."
              className="text-5xl font-bold leading-[.95] tracking-tight sm:text-7xl"
            />
            <AnalyticsIntro details="This is an identity and coverage explorer for the supplied historical competition data, not a current IPL 2027 auction roster. Displayed role labels belong to the inherited canonical export; this is not the accepted D20 analytical cohort.">
              Every great choice begins with knowing who is actually represented in the data.
            </AnalyticsIntro>
          </div>
          <div className="border-l-4 border-[#ED267B] pl-6">
            <p className="text-[clamp(5rem,9vw,9rem)] font-bold leading-none tabular-nums tracking-[-.08em]">
              {players.length.toLocaleString("en-IN")}
            </p>
            <p className="mt-3 text-sm uppercase tracking-[.13em] text-[#536079]">
              Canonical player identities in the supplied data pack
            </p>
          </div>
        </header>

        {loadError && (
          <div role="alert" className="space-y-3 border-l-4 border-[#ED267B] bg-[#FFE5F0] p-5">
            <p>{loadError}</p>
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => setRetry((n) => n + 1)}
            >
              Retry loading the player pool
            </button>
          </div>
        )}

        <section aria-labelledby="data-coverage-heading" className="space-y-6">
          <div className="grid items-start gap-4 sm:grid-cols-[1fr_1fr]">
            <h2 id="data-coverage-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              The shape of the pool.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#536079]">
              Counts below are calculated directly from the canonical player JSON.
              A playing role is not the same as an accepted D20 batting/bowling rating.
              Historical RR affiliation does not establish current squad or auction eligibility.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
            <div className="rounded-[2rem] border border-[#CBD5E9] bg-white p-6 sm:p-9">
              <h3 className="mb-7 text-sm font-semibold uppercase tracking-[.18em] text-[#2450B8]">
                Playing roles
              </h3>
              <div className="space-y-6">
                {DISPLAY_ROLES.slice(1).map((label) => {
                  const count = counts.get(label) ?? 0;
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={role === label}
                      onClick={() => {
                        setRole(role === label ? "All" : label);
                        setLimit(24);
                      }}
                      className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2450B8]"
                    >
                      <span className="mb-2 flex justify-between gap-3 text-sm font-semibold">
                        <span>{label}</span>
                        <span className="tabular-nums">{count}</span>
                      </span>
                      <span className="block h-3 overflow-hidden rounded-full bg-[#E8F1FF]">
                        <span
                          className="block h-full rounded-full bg-[#2450B8] transition-[width] duration-300"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              aria-pressed={royalsOnly}
              onClick={() => {
                setRoyalsOnly((old) => !old);
                setLimit(24);
              }}
              className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#FFE5F0] p-8 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2450B8]"
            >
              <span className="text-sm font-semibold uppercase tracking-[.16em] text-[#A21954]">
                Historically RR-affiliated
              </span>
              <strong className="text-6xl font-bold tabular-nums tracking-tighter">
                {royalsCount.toLocaleString("en-IN")}
              </strong>
              <span className="text-sm text-[#536079]">
                {royalsOnly ? "Showing only mapped RR-affiliated identities · Click to clear" : "Explore RR-affiliated records in the source pack ↗"}
              </span>
            </button>
          </div>
        </section>

        <section aria-labelledby="data-explore-heading" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 id="data-explore-heading" className="text-3xl font-bold sm:text-4xl">
              Explore the identities.
            </h2>
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Find a canonical player
                <input
                  type="search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setLimit(24); }}
                  placeholder="Name or player ID"
                  className="min-w-[220px] rounded-xl border border-[#CBD5E9] bg-white p-3 text-sm focus-visible:outline-[#2450B8]"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Playing role
                <select
                  value={role}
                  onChange={(e) => { setRole(e.target.value as RoleFilter); setLimit(24); }}
                  className="rounded-xl border border-[#CBD5E9] bg-white p-3 text-sm focus-visible:outline-[#2450B8]"
                >
                  {DISPLAY_ROLES.map((entry) => (
                    <option key={entry} value={entry}>{entry === "All" ? "All roles" : entry}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <p role="status" className="text-sm text-[#536079]">
            {matching.length} matching canonical identities · sorted by name
          </p>
          {matching.length === 0 && players.length > 0 ? (
            <p>No identities match these source filters. Adjust your search or role.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matching.slice(0, limit).map((player) => (
                <button
                  type="button"
                  key={player.player_id}
                  onClick={() => onSelectPlayer(player)}
                  className="text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#2450B8]"
                  aria-label={`Inspect ${player.player_name}`}
                >
                  <RoyalIdentityPreview player={player} />
                </button>
              ))}
            </div>
          )}
          {matching.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((n) => n + 24)}
              className="min-h-[44px] rounded-full border border-[#2450B8] px-6 py-3 text-sm font-semibold text-[#2450B8] hover:bg-[#E8F1FF]"
            >
              Show 24 more players
            </button>
          )}
        </section>

        <aside className="rounded-[2rem] border border-[#CBD5E9] bg-white p-7 sm:p-10">
          <h2 className="text-2xl font-bold">What this data can—and cannot—tell you.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#536079]">
            The identity pool is larger than the eligible research cohorts.
            Current private D20 serving covers ten batting and ten bowling
            top-ranked records, not the entire roster. A missing D20 result is
            not a zero rating or a conclusion that the player is ineligible.
            Event-level pressure traces and official future auction eligibility
            cannot be inferred from this identity catalogue.
          </p>
        </aside>
      </div>
    </div>
  );
}
