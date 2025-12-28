
import React from 'react';
import { COLORS, NativePattern } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userRole: string | null;
  onLogout: () => void;
  onRoleSwitch: (role: 'participant' | 'facilitator') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, onRoleSwitch }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f1a]">
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-gradient-to-br from-[#cc5500] to-[#993300] p-3 rounded-2xl shadow-lg shadow-orange-900/20 group-hover:scale-105 transition-transform">
              <i className="fas fa-feather-alt text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Indigenous Genius</h1>
              <p className="text-xs text-orange-400/80 font-semibold uppercase tracking-widest">Women’s Healing Circle</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {userRole && (
              <>
                <button 
                  onClick={() => onRoleSwitch(userRole === 'participant' ? 'facilitator' : 'participant')}
                  className="text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all font-bold text-slate-300"
                >
                  <i className="fas fa-sync-alt mr-2 opacity-50"></i>
                  {userRole === 'participant' ? 'Facilitator' : 'Participant'}
                </button>
                <button 
                  onClick={onLogout}
                  className="text-[10px] uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/20 transition-all font-bold text-red-400"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="native-gradient"></div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        {children}
      </main>

      <footer className="bg-[#0b0f1a] text-slate-500 py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Indigenous Genius</h4>
            <p className="text-sm leading-relaxed opacity-70">
              A culturally grounded platform honoring the intersection of tradition and digital innovation for the SRPMIC community.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Resources</h4>
            <ul className="text-sm space-y-2">
              <li className="hover:text-orange-400 cursor-pointer transition-colors">SRPMIC Healing Resources</li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">Sacred Space Initiative</li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">Cultural Education</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Stay Connected</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500/20 hover:text-orange-400 transition-all cursor-pointer">
                <i className="fab fa-instagram"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500/20 hover:text-orange-400 transition-all cursor-pointer">
                <i className="fab fa-facebook-f"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] text-center opacity-40">
          © {new Date().getFullYear()} Indigenous Genius Digital Portal
        </div>
      </footer>
    </div>
  );
};

export default Layout;
