import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BoxCricket from './pages/BoxCricket';
import Tenaball from './pages/Tenaball';
import WhoAreYou from './pages/WhoAreYou';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/box-cricket" element={<BoxCricket />} />
          <Route path="/tenaball" element={<Tenaball />} />
          <Route path="/who-are-you" element={<WhoAreYou />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
