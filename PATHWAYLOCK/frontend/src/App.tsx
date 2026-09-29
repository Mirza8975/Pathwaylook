import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import VoiceIntake from './pages/VoiceIntake';
import ProfileReview from './pages/ProfileReview';
import OpportunityIntelligence from './pages/OpportunityIntelligence';
import Recommendation from './pages/Recommendation';
import CounsellorDashboard from './pages/CounsellorDashboard';
import { offlineService } from './services/offlineService';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Initialize offline service
    offlineService.init().catch(console.error);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header isOnline={isOnline} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/voice-intake" element={<VoiceIntake />} />
            <Route path="/profile-review" element={<ProfileReview />} />
            <Route path="/opportunities" element={<OpportunityIntelligence />} />
            <Route path="/recommendation/:id" element={<Recommendation />} />
            <Route path="/counsellor" element={<CounsellorDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
