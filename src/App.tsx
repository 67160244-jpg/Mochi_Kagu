import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StoryPage } from './pages/StoryPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { PriceLabPage } from './pages/PriceLabPage';
import { DataPage } from './pages/DataPage';
import { AboutPage } from './pages/AboutPage';
import { CurrencyMode } from './config/fx';

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyMode>('THB');

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-mochi-cream text-mochi-brown">
        <Navbar currency={currency} onCurrencyChange={setCurrency} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<StoryPage currency={currency} />} />
            <Route path="/explorer" element={<ExplorerPage currency={currency} />} />
            <Route path="/price-lab" element={<PriceLabPage currency={currency} />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
