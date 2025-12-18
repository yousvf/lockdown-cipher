import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PlayfairPage } from './pages/PlayfairPage';
import { RailFencePage } from './pages/RailFencePage';
import { MonoalphabeticPage } from './pages/MonoalphabeticPage';
import { PolyalphabeticPage } from './pages/PolyalphabeticPage';
import { HillPage } from './pages/HillPage';
import { OtpPage } from './pages/OtpPage';
import { CaesarPage } from './pages/CaesarPage';
import { RowColumnPage } from './pages/RowColumnPage';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;

function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playfair" element={<PlayfairPage />} />
        <Route path="/railfence" element={<RailFencePage />} />
        <Route path="/monoalphabetic" element={<MonoalphabeticPage />} />
        <Route path="/polyalphabetic" element={<PolyalphabeticPage />} />
        <Route path="/hill" element={<HillPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/caesar" element={<CaesarPage />} />
        <Route path="/rowcolumn" element={<RowColumnPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
