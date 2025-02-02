import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Jobs from './pages/Jobs';
import Auth from './pages/Auth';
import AISettings from './pages/AISettings';
import Notifications from './pages/Notifications';
import Pricing from './pages/Pricing';
import AIAgentButton from './components/AIAgentButton';
import { AuthProvider } from './contexts/AuthContext';
import { AIProvider } from './contexts/AIContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AIProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:connectionId" element={<Messages />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/ai-settings" element={<AISettings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/pricing" element={<Pricing />} />
                </Routes>
              </main>
              <Footer />
              <AIAgentButton />
              <Toaster position="top-right" />
            </div>
          </Router>
        </AIProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;