
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ParticipantPortal from './components/ParticipantPortal';
import FacilitatorPortal from './components/FacilitatorPortal';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (role: UserRole) => {
    setUser({
      userId: 'mock-uuid-12345',
      role: role,
      fullName: role === UserRole.FACILITATOR ? 'Facilitator' : 'Participant',
      email: 'member@srpmic.gov',
      phone: '480-000-0000',
      srpmicAffiliation: 'Salt River',
      createdAt: new Date().toISOString()
    });
  };

  const handleLogout = () => setUser(null);

  const handleRoleSwitch = (role: UserRole) => {
    if (user) setUser({ ...user, role });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-orange-500/20 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
          </div>
          <p className="text-orange-500 font-bold uppercase tracking-[0.5em] text-xs animate-pulse">Convening the Circle</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      userRole={user?.role || null} 
      onLogout={handleLogout}
      onRoleSwitch={(role) => handleRoleSwitch(role as UserRole)}
    >
      {!user ? (
        <div className="max-w-5xl mx-auto py-20 animate-fadeIn">
          <div className="glass-card rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black">
            <div className="p-12 md:p-20 md:w-3/5 space-y-12">
              <div className="space-y-4">
                <div className="text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px]">Secure Portal Access</div>
                <h2 className="text-5xl font-bold text-white mb-2">Welcome Home.</h2>
                <p className="text-slate-500 text-lg leading-relaxed">Enter your digital sanctuary to continue your journey of heritage and healing.</p>
              </div>
              
              <div className="space-y-6">
                <button 
                  onClick={() => handleLogin(UserRole.PARTICIPANT)}
                  className="w-full gloss-button text-white py-6 rounded-3xl font-bold text-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                >
                  <i className="fas fa-heart"></i>
                  Participant Portal
                </button>
                <button 
                  onClick={() => handleLogin(UserRole.FACILITATOR)}
                  className="w-full bg-white/5 text-slate-300 border border-white/10 py-6 rounded-3xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                >
                  <i className="fas fa-shield-alt opacity-50"></i>
                  Facilitator Hub
                </button>
              </div>
              
              <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                <span>SRPMIC Private Access</span>
                <span>v1.0 Pilot</span>
              </div>
            </div>
            
            <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-orange-950/40 to-slate-950 relative overflow-hidden border-l border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                alt="Native landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent"></div>
              <div className="relative h-full flex flex-col items-center justify-end p-16 text-center text-white">
                <p className="text-2xl font-serif italic mb-6">"Strength flows through the lineage like water through the canyon."</p>
                <div className="w-12 h-1 bg-orange-500/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ) : user.role === UserRole.FACILITATOR ? (
        <FacilitatorPortal />
      ) : (
        <ParticipantPortal userId={user.userId} />
      )}
    </Layout>
  );
};

export default App;
