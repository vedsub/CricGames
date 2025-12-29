import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BoxCricket from './pages/BoxCricket';
import Tenaball from './pages/Tenaball';
import WhoAreYou from './pages/WhoAreYou';
import LeaderboardPage from './pages/LeaderboardPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/box-cricket" element={<BoxCricket />} />
          <Route path="/tenaball" element={<Tenaball />} />
          <Route path="/who-are-you" element={<WhoAreYou />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
