import { RoyalResearchProvider } from "./components/player-cards/RoyalResearch";
import type { AnalyticalRole } from "./types/analytics";
import "./components/player-cards/player-cards.css";
import { apiURL } from "./utils/urls";
import { gsap, ScrollTrigger } from "./utils/motion";
import "./polished-system.css";
import "./editorial-refinement.css";
import "./typography-system.css";
import "./portrait-fallbacks.css";
import "./royal-editorial-global.css";
import "./final-ux-polish.css";
import React, { useState, useEffect } from "react";
import { Player } from "./types";
import { loadPlayers } from "./utils/api";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CrlPreloader } from "./components/CrlPreloader";
import { MetricVortexScene } from "./components/MetricVortexScene";

// Pages
import { HomePage } from "./pages/HomePage";
import { RankingsPage } from "./pages/RankingsPage";
import { PlayerDatabasePage } from "./pages/PlayerDatabasePage";
import { PressureLabPage } from "./pages/PressureLabPage";
import { BattingIntelligencePage } from "./pages/BattingIntelligencePage";
import { BowlingIntelligencePage } from "./pages/BowlingIntelligencePage";
import { PlayerComparisonPage } from "./pages/PlayerComparisonPage";
import { AuctionWarRoomPage } from "./pages/AuctionWarRoomPage";
import { MethodologyPage } from "./pages/MethodologyPage";
import { CommandCentrePage } from "./pages/CommandCentrePage";
import { DataExplorerPage } from "./pages/DataExplorerPage";

const RoyalPlayerDialog = React.lazy(
  () => import("./components/player-cards/RoyalPlayerDialog"),
);

const routeNames = new Set([
  "home",
  "database",
  "data-explorer",
  "rankings",
  "pressure-lab",
  "comparison",
  "war-room",
  "batting-intel",
  "bowling-intel",
  "command-centre",
  "methodology",
]);
const readRoute = () => {
  const route = window.location.hash.slice(1);
  return routeNames.has(route) ? route : "home";
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => readRoute());
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [warRoomSquad, setWarRoomSquad] = useState<Player[]>([]);
  const [planningBudget, setPlanningBudget] = useState(120);
  const [planningBids, setPlanningBids] = useState<Record<number, number>>({});
  const selectedTrigger = React.useRef<HTMLElement | null>(null);
  const [selectedRole, setSelectedRole] = useState<AnalyticalRole>("batting");
  const [comparisonIds, setComparisonIds] = useState<number[]>([3297, 6423]);
  const [comparisonRole, setComparisonRole] =
    useState<AnalyticalRole>("batting");
  const selectPlayer = (player: Player) => {
    selectedTrigger.current = document.activeElement as HTMLElement;
    setSelectedRole(player.role === "Bowler" ? "bowling" : "batting");
    setSelectedPlayer(player);
  };

  // Load all players for fast lookups
  useEffect(() => {
    let active = true;
    loadPlayers()
      .then((players) => {
        if (active) setAllPlayers(players);
      })
      .catch((error) => console.error("Player loading failed", error));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const changed = () => {
      setCurrentPage(readRoute());
      setSelectedPlayer(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  const handleSelectPlayerById = (playerId: number, role?: AnalyticalRole) => {
    selectedTrigger.current = document.activeElement as HTMLElement;
    const found = allPlayers.find((p) => p.player_id === playerId);
    if (found) {
      setSelectedRole(
        role ?? (found.role === "Bowler" ? "bowling" : "batting"),
      );
      setSelectedPlayer(found);
    } else {
      // Fetch single player from API if not loaded
      fetch(apiURL(`/api/players/${playerId}`))
        .then((res) => res.json())
        .then((data) => {
          setSelectedRole(
            role ?? (data.player.role === "Bowler" ? "bowling" : "batting"),
          );
          setSelectedPlayer(data.player);
        })
        .catch((err) => console.error("Failed to load player:", err));
    }
  };

  const handleAddToWarRoom = (player: Player) => {
    if (!warRoomSquad.some((p) => p.player_id === player.player_id)) {
      setWarRoomSquad((prev) => [...prev, player]);
    }
  };

  const handleRemoveFromWarRoom = (playerId: number) => {
    setWarRoomSquad((prev) => prev.filter((p) => p.player_id !== playerId));
    setPlanningBids((old) => {
      const next = { ...old };
      delete next[playerId];
      return next;
    });
  };

  // Shared route-enter and scroll choreography for every analytics screen.
  // The homepage has its own dedicated pinned visual story, so this remains
  // deliberately scoped to the inner application pages.
  useEffect(() => {
    if (!preloaderComplete || currentPage === "home") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: ReturnType<typeof gsap.context> | null = null;
    const frame = requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (!main) return;
      context = gsap.context(() => {
        const heading = main.querySelector("h1");
        if (heading) gsap.fromTo(heading,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: .68, ease: "power3.out" });
        const panels = gsap.utils.toArray<HTMLElement>(
          main.querySelectorAll(".pc-preview, .public-ranking-player, .discovery-player, .analytics-intro, .grid > button")
        ).slice(0, 28);
        panels.forEach((panel, index) => {
          gsap.fromTo(panel,
            { autoAlpha: .72, y: 22, scale: .985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: .5,
              delay: Math.min(index * .022, .18),
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel, start: "top 95%",
                toggleActions: "play none none none",
                once: true,
              },
            });
        });
        ScrollTrigger.refresh();
      }, main);
    });
    return () => {
      cancelAnimationFrame(frame);
      context?.revert();
    };
  }, [currentPage, preloaderComplete]);

  // Scroll to top on page change
  const handleNavigate = (page: string) => {
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const comparePlayer = (id: number, role: AnalyticalRole = "batting") => {
    setComparisonIds((old) => (old[0] === id ? old : [id, old[0]]));
    setComparisonRole(role);
    setSelectedPlayer(null);
    handleNavigate("comparison");
  };
  React.useLayoutEffect(() => {
    if (!selectedPlayer) return;
    const closePendingProfile = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      // RoyalPlayerDialog is split into a lazy JS chunk. Escape must work
      // even while that chunk is loading or before its showModal effect runs.
      // Once the native dialog is open, its own cancel handler owns Escape.
      if (document.querySelector("dialog.royal-dialog[open]")) return;
      event.preventDefault();
      setSelectedPlayer(null);
      const trigger = selectedTrigger.current;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", closePendingProfile, true);
    return () =>
      document.removeEventListener("keydown", closePendingProfile, true);
  }, [selectedPlayer, currentPage]);
  return (
    <RoyalResearchProvider active={currentPage !== "home"}>
      <div className="royal-editorial-app min-h-screen bg-[#FAF8F5] text-[#17171B] relative selection:bg-[#C43670] selection:text-white">
        <a
          className="skip-link"
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("main-content")?.focus();
          }}
        >
          Skip to content
        </a>

        {/* CRL Typography Scale/Zoom Preloader */}
        {!preloaderComplete && (
          <CrlPreloader onComplete={() => setPreloaderComplete(true)} />
        )}

        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          rrPurseCr={120.0}
          introComplete={preloaderComplete}
        />

        {/* Page Routing */}
        <main
          id="main-content"
          tabIndex={-1}
          className={currentPage === "home" ? "" : "analytics-workspace"}
        >
          {currentPage !== "home" && currentPage !== "methodology" && (
            <MetricVortexScene
              key={currentPage}
              route={currentPage}
              players={allPlayers}
              planningBudget={planningBudget}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === "home" && (
            <HomePage
              introComplete={preloaderComplete}
              onNavigate={handleNavigate}
              onSelectPlayer={selectPlayer}
            />
          )}

          {currentPage === "command-centre" && (
            <CommandCentrePage onNavigate={handleNavigate} rrPurseCr={120.0} players={allPlayers} onSelectPlayer={selectPlayer} />
          )}

          {currentPage === "rankings" && (
            <RankingsPage onSelectPlayerById={handleSelectPlayerById} />
          )}

          {currentPage === "database" && (
            <PlayerDatabasePage
              onSelectPlayer={selectPlayer}
              onComparePlayer={comparePlayer}
            />
          )}

          {currentPage === "data-explorer" && (
            <DataExplorerPage onSelectPlayer={selectPlayer} />
          )}

          {currentPage === "pressure-lab" && (
            <PressureLabPage onSelectPlayerById={handleSelectPlayerById} />
          )}

          {currentPage === "batting-intel" && (
            <BattingIntelligencePage onSelectPlayer={selectPlayer} />
          )}

          {currentPage === "bowling-intel" && (
            <BowlingIntelligencePage onSelectPlayer={selectPlayer} />
          )}

          {currentPage === "comparison" && (
            <PlayerComparisonPage
              onSelectPlayer={selectPlayer}
              selectedIds={comparisonIds}
              initialAnalyticalRole={comparisonRole}
            />
          )}

          {currentPage === "war-room" && (
            <AuctionWarRoomPage
              onSelectPlayer={selectPlayer}
              warRoomSquad={warRoomSquad}
              onAddToSquad={handleAddToWarRoom}
              onRemoveFromSquad={handleRemoveFromWarRoom}
              purseTotalCr={120.0}
              planningBudget={planningBudget}
              setPlanningBudget={setPlanningBudget}
              planningBids={planningBids}
              setPlanningBids={setPlanningBids}
              onReplaceSquad={setWarRoomSquad}
            />
          )}

          {currentPage === "methodology" && <MethodologyPage />}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* One premium interactive player card everywhere, including the homepage. */}
        {selectedPlayer && (
          <React.Suspense fallback={<p role="status">Opening player card…</p>}>
            <RoyalPlayerDialog
              key={`${selectedPlayer.player_id}:${selectedRole}`}
              player={selectedPlayer}
              initialRole={selectedRole}
              returnFocus={selectedTrigger.current}
              onClose={() => setSelectedPlayer(null)}
              onCompare={comparePlayer}
              onAddToWarRoom={handleAddToWarRoom}
              isInWarRoom={warRoomSquad.some(
                (p) => p.player_id === selectedPlayer.player_id,
              )}
            />
          </React.Suspense>
        )}
      </div>
    </RoyalResearchProvider>
  );
};
export default App;
