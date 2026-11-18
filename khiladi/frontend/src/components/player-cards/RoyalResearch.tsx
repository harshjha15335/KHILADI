import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { AnalyticalRole, D20Response } from "../../types/analytics";
import {
  loadD20Rankings,
  privateAnalyticsAvailable,
} from "../../utils/analytics";
import { toCardData, type CardData } from "./cardData";
const MODEL = "superr-d20-76496fa3c703320c";
interface Research {
  available: boolean;
  unlocked: boolean;
  loading: boolean;
  error: string;
  responses: Partial<Record<AnalyticalRole, D20Response>>;
  unlock: (token: string) => void;
  lock: () => void;
  lookup: (id: number, role: AnalyticalRole) => CardData | null;
}
const empty: Research = {
  available: false,
  unlocked: false,
  loading: false,
  error: "",
  responses: {},
  unlock: () => {},
  lock: () => {},
  lookup: () => null,
};
const Context = createContext<Research>(empty);
export function RoyalResearchProvider({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const [credential, setCredential] = useState(""),
    [responses, setResponses] = useState<Research["responses"]>({}),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const generation = useRef(0);
  const lock = useCallback(() => {
    generation.current++;
    setCredential("");
    setResponses({});
    setError("");
    setLoading(false);
  }, []);
  useEffect(() => {
    if (!active) lock();
  }, [active, lock]);
  useEffect(() => {
    const n = ++generation.current,
      abort = new AbortController();
    setResponses({});
    setError("");
    setLoading(false);
    if (!active || !credential || !privateAnalyticsAvailable)
      return () => abort.abort();
    setLoading(true);
    Promise.all(
      (["batting", "bowling"] as const).map(async (role) => {
        const response = await loadD20Rankings(role, credential, abort.signal);
        response.rankings.forEach((row) =>
          toCardData(response, row.player_id, role, MODEL),
        );
        return [role, response] as const;
      }),
    )
      .then((entries) => {
        if (!abort.signal.aborted && n === generation.current)
          setResponses(Object.fromEntries(entries));
      })
      .catch((e) => {
        if (!abort.signal.aborted && n === generation.current)
          setError(
            e instanceof Error ? e.message : "Private evidence is unavailable.",
          );
      })
      .finally(() => {
        if (!abort.signal.aborted && n === generation.current)
          setLoading(false);
      });
    return () => abort.abort();
  }, [active, credential, attempt]);
  const lookup = useCallback(
    (id: number, role: AnalyticalRole) => {
      const response = responses[role];
      if (
        !active ||
        !response ||
        !response.rankings.some((r) => r.player_id === id)
      )
        return null;
      try {
        return toCardData(response, id, role, MODEL);
      } catch {
        return null;
      }
    },
    [responses, active],
  );
  const value = useMemo(
    () => ({
      available: active && privateAnalyticsAvailable,
      unlocked: active && !!credential,
      loading,
      error,
      responses: active ? responses : {},
      unlock: (key: string) => {
        if (!active || !privateAnalyticsAvailable) return;
        generation.current++;
        setResponses({});
        setCredential(key.trim());
        setAttempt((v) => v + 1);
      },
      lock,
      lookup,
    }),
    [active, credential, loading, error, responses, lookup, lock],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useRoyalResearch = () => useContext(Context);
export function ResearchAccess() {
  const research = useRoyalResearch(),
    [draft, setDraft] = useState("");
  return (
    <section className="pc-access" aria-label="Private D20 research access">
      {!research.available ? (
        <p>
          D20 evidence is private. Identity cards remain available; no legacy
          score is substituted.
        </p>
      ) : research.unlocked ? (
        <div>
          <span>
            {research.loading
              ? "Loading verified D20 evidence…"
              : "Private D20 session · memory only"}
          </span>
          <button
            type="button"
            onClick={() => {
              setDraft("");
              research.lock();
            }}
          >
            Lock results
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            research.unlock(draft);
            setDraft("");
          }}
        >
          <label htmlFor="d20-token">Private analytics access token</label>
          <div>
            <input
              id="d20-token"
              type="password"
              autoComplete="off"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              required
              minLength={32}
              placeholder="Token from your private backend configuration"
            />
            <button type="submit">Unlock D20</button>
          </div>
          <small>
            Shared in memory across inner pages. Returning home or locking
            clears access.
          </small>
        </form>
      )}
      {research.error && (
        <p role="alert">{research.error} No legacy fallback was used.</p>
      )}
    </section>
  );
}
