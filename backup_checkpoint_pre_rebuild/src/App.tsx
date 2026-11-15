import React, { useState, useEffect } from 'react';
import { Player } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DiamondCursor } from './components/DiamondCursor';
import { CrlPreloader } from './components/CrlPreloader';
import { PlayerProfileReveal } from './components/PlayerProfileReveal';

// Pages
import { HomePage } from './pages/HomePage';
import { RankingsPage } from './pages/RankingsPage';
import { PlayerDatabasePage } from './pages/PlayerDatabasePage';
import { PressureLabPage } from './pages/PressureLabPage';
import { BattingIntelligencePage } from './pages/BattingIntelligencePage';
import { BowlingIntelligencePage } from './pages/BowlingIntelligencePage';
import { PlayerComparisonPage } from './pages/PlayerComparisonPage';
import { AuctionWarRoomPage } from './pages/AuctionWarRoomPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { CommandCentrePage } from './pages/CommandCentrePage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [warRoomSquad, setWarRoomSquad] = useState<Player[]>([]);

  // Load all players for fast lookups
  useEffect(() => {
    fetch('/data/player_database.json')
      .then(res => res.json())
      .then((data: Player[]) => setAllPlayers(data))
      .catch(() => {
        fetch('/api/players?limit=1500')
          .then(res => res.json())
          .then(res => setAllPlayers(res.data));
      });
  }, []);

  const handleSelectPlayerById = (playerId: number) => {
    const found = allPlayers.find(p => p.player_id === playerId);
    if (found) {
      setSelectedPlayer(found);
    } else {
      // Fetch single player from API if not loaded
      fetch(`/api/players/${playerId}`)
        .then(res => res.json())
        .then(p => setSelectedPlayer(p))
        .catch(err => console.error('Failed to load player:', err));
    }
  };

  const handleAddToWarRoom = (player: Player) => {
    if (!warRoomSquad.some(p => p.player_id === player.player_id)) {
      setWarRoomSquad(prev => [...prev, player]);
    }
  };

  const handleRemoveFromWarRoom = (playerId: number) => {
    setWarRoomSquad(prev => prev.filter(p => p.player_id !== playerId));
  };

  // Scroll to top on page change
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] relative selection:bg-[#E81274] selection:text-white">
      {/* AUGE Global Yellow Diamond Cursor follower */}
      <DiamondCursor />

      {/* CRL Typography Scale/Zoom Preloader */}
      {!preloaderComplete && (
        <CrlPreloader onComplete={() => setPreloaderComplete(true)} />
      )}

      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        rrPurseCr={120.0}
      />

      {/* Page Routing */}
      <main>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectPlayer={setSelectedPlayer}
          />
        )}

        {currentPage === 'command-centre' && (
          <CommandCentrePage
            onNavigate={handleNavigate}
            rrPurseCr={120.0}
          />
        )}

        {currentPage === 'rankings' && (
          <RankingsPage
            onSelectPlayerById={handleSelectPlayerById}
          />
        )}

        {currentPage === 'database' && (
          <PlayerDatabasePage
            onSelectPlayer={setSelectedPlayer}
          />
        )}

        {currentPage === 'pressure-lab' && (
          <PressureLabPage
            onSelectPlayerById={handleSelectPlayerById}
          />
        )}

        {currentPage === 'batting-intel' && (
          <BattingIntelligencePage
            onSelectPlayer={setSelectedPlayer}
          />
        )}

        {currentPage === 'bowling-intel' && (
          <BowlingIntelligencePage
            onSelectPlayer={setSelectedPlayer}
          />
        )}

        {currentPage === 'comparison' && (
          <PlayerComparisonPage
            onSelectPlayer={setSelectedPlayer}
          />
        )}

        {currentPage === 'war-room' && (
          <AuctionWarRoomPage
            onSelectPlayer={setSelectedPlayer}
            warRoomSquad={warRoomSquad}
            onAddToSquad={handleAddToWarRoom}
            onRemoveFromSquad={handleRemoveFromWarRoom}
            purseTotalCr={120.0}
          />
        )}

        {currentPage === 'methodology' && (
          <MethodologyPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Cyera Slide-Out Drawer Profile */}
      <PlayerProfileReveal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onAddToWarRoom={handleAddToWarRoom}
        isInWarRoom={selectedPlayer ? warRoomSquad.some(p => p.player_id === selectedPlayer.player_id) : false}
      />
    </div>
  );
};
export default App;
