
import React, { useState, useEffect } from 'react';
import { getWorksheetGuidance } from '../services/geminiService';
import { WEEKLY_TOPICS } from '../constants';
import { Intake } from '../types';

interface ParticipantPortalProps {
  userId: string;
}

const ParticipantPortal: React.FC<ParticipantPortalProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'onboarding' | 'worksheets'>('overview');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  const [guidance, setGuidance] = useState('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  const [loading, setLoading] = useState(false);

  const [intakeData, setIntakeData] = useState<Intake>({
    userId: userId,
    baselineConnection: 5,
    baselineStress: 5,
    baselineEfficacy: 5,
    primaryGoal: '',
    meaningOfIndigenousGenius: ''
  });

  const apiGetIntake = async (uid: string): Promise<Partial<Intake> | null> => {
    console.log('Fetching intake for:', uid);
    // Simulate finding existing data for the mock user
    if (uid === 'mock-uuid-12345') {
      return {
        baselineConnection: 8,
        baselineStress: 2,
        baselineEfficacy: 9,
        primaryGoal: 'Healing through heritage and reconnecting with community wisdom.',
        meaningOfIndigenousGenius: 'The inherent brilliance and resilience of our ancestors flowing through us.'
      };
    }
    return null;
  };

  useEffect(() => {
    const loadIntake = async () => {
      setLoading(true);
      const data = await apiGetIntake(userId);
      if (data) {
        setIntakeData(prev => ({ ...prev, ...data }));
        setOnboardingComplete(true);
      }
      setLoading(false);
    };
    loadIntake();
  }, [userId]);

  const handleGetGuidance = async (q: string) => {
    setLoadingGuidance(true);
    const text = await getWorksheetGuidance(activeWeek, q);
    setGuidance(text || '');
    setLoadingGuidance(false);
  };

  const apiSubmitIntake = async (payload: Intake) => {
    console.log('Submitting Intake to Apps Script:', payload);
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiSubmitIntake({ ...intakeData, userId });
      setLoading(false);
      setOnboardingComplete(true);
      setActiveTab('worksheets');
      alert('Your intentions have been recorded. Welcome to the circle.');
    } catch (err) {
      setLoading(false);
      alert('Submission error. Please check your connection.');
    }
  };

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${activeTab === id ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}
    >
      <i className={`fas ${icon}`}></i>
      {label}
    </button>
  );

  const RatingSlider = ({ label, value, field, color }: { label: string, value: number, field: keyof Intake, color: string }) => (
    <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{label}</label>
        <span className={`text-xl font-bold ${color}`}>{value}/10</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        step="1" 
        value={value}
        onChange={(e) => setIntakeData({ ...intakeData, [field]: parseInt(e.target.value) })}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
      <div className="flex justify-between text-[8px] uppercase tracking-tighter text-slate-600 font-bold">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-bold text-white">My Sanctuary</h2>
            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-full">
              Role: Participant
            </span>
          </div>
          <p className="text-slate-500 font-medium italic">Your space for heritage, healing, and connection.</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto max-w-full no-scrollbar">
          <TabButton id="overview" label="Overview" icon="fa-chart-line" />
          {!onboardingComplete && <TabButton id="onboarding" label="Intake" icon="fa-user-edit" />}
          <TabButton id="worksheets" label="My Worksheets" icon="fa-feather" />
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: 'Circle Members', val: '24', icon: 'fa-users', color: 'text-orange-400' },
              { label: 'Sessions Held', val: '4', icon: 'fa-calendar-check', color: 'text-indigo-400' },
              { label: 'Global Completion', val: '92%', icon: 'fa-check-double', color: 'text-emerald-400' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-8 rounded-[2rem]">
                <div className={`text-2xl mb-4 ${stat.color}`}><i className={`fas ${stat.icon}`}></i></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-10 md:p-20 rounded-[3rem] text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto border border-orange-500/20 text-orange-500">
                <i className="fas fa-home text-3xl"></i>
              </div>
              <h3 className="text-4xl font-bold text-white">Welcome Home.</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                This digital sanctuary is built to support your healing journey. Whether you are beginning with your intake or reflecting on your weekly bundle, the spirit of the circle is here with you.
              </p>
              {!onboardingComplete ? (
                <button 
                  onClick={() => setActiveTab('onboarding')} 
                  className="gloss-button px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs text-white"
                >
                  Begin Your Onboarding
                </button>
              ) : (
                <button 
                  onClick={() => setActiveTab('worksheets')} 
                  className="bg-white/5 border border-white/10 text-slate-300 px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs hover:bg-white/10 transition-all"
                >
                  Continue Reflections
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'onboarding' && (
        <div className="max-w-4xl mx-auto animate-fadeIn">
          <div className="glass-card p-10 md:p-14 rounded-[3rem] border-t-4 border-t-orange-500">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">The Opening Prayer</h2>
              <p className="text-slate-500 italic">Honoring your current state as we begin our walk together.</p>
            </div>

            <form className="space-y-12" onSubmit={handleIntakeSubmit}>
              {/* Baseline Metrics */}
              <div className="space-y-6">
                <h4 className="text-[11px] uppercase font-bold tracking-[0.3em] text-orange-500 mb-6">Internal Landscape</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <RatingSlider 
                    label="Cultural Connection" 
                    value={intakeData.baselineConnection} 
                    field="baselineConnection" 
                    color="text-orange-400"
                  />
                  <RatingSlider 
                    label="Current Stress Level" 
                    value={intakeData.baselineStress} 
                    field="baselineStress" 
                    color="text-rose-400"
                  />
                  <RatingSlider 
                    label="Self Efficacy" 
                    value={intakeData.baselineEfficacy} 
                    field="baselineEfficacy" 
                    color="text-emerald-400"
                  />
                </div>
              </div>

              {/* Reflection Questions */}
              <div className="space-y-8">
                <h4 className="text-[11px] uppercase font-bold tracking-[0.3em] text-orange-500">Your Intentions</h4>
                
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">What is your primary goal for this circle?</label>
                  <textarea 
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl min-h-[140px] text-white outline-none focus:border-orange-500 transition-all placeholder:text-slate-700" 
                    placeholder="E.g., Connection with heritage, releasing stress, finding sisterhood..."
                    value={intakeData.primaryGoal}
                    onChange={(e) => setIntakeData({ ...intakeData, primaryGoal: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">What does 'Indigenous Genius' mean to you?</label>
                  <textarea 
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl min-h-[140px] text-white outline-none focus:border-orange-500 transition-all placeholder:text-slate-700" 
                    placeholder="Share your thoughts on the wisdom of your lineage..."
                    value={intakeData.meaningOfIndigenousGenius}
                    onChange={(e) => setIntakeData({ ...intakeData, meaningOfIndigenousGenius: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full gloss-button py-6 rounded-3xl font-bold uppercase tracking-[0.4em] text-xs text-white shadow-2xl shadow-orange-950/20 flex items-center justify-center gap-4 group"
                >
                  {loading ? (
                    <i className="fas fa-circle-notch fa-spin text-lg"></i>
                  ) : (
                    <>
                      <span>{onboardingComplete ? 'Update My Intentions' : 'Submit My Intentions'}</span>
                      <i className="fas fa-feather group-hover:translate-x-2 transition-transform"></i>
                    </>
                  )}
                </button>
                <p className="text-center text-[9px] uppercase tracking-widest text-slate-600 mt-6 font-bold">
                  Your responses are private and held in sacred trust.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'worksheets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fadeIn">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[1, 2, 3, 4].map(w => (
                <button 
                  key={w} 
                  onClick={() => setActiveWeek(w)} 
                  className={`px-8 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest border transition-all ${activeWeek === w ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}
                >
                  Week {w}
                </button>
              ))}
            </div>
            <div className="glass-card p-10 md:p-14 rounded-[3rem]">
              <div className="mb-10">
                <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Weekly Bundle</span>
                <h2 className="text-3xl font-bold text-white">{WEEKLY_TOPICS[activeWeek-1]}</h2>
              </div>
              <textarea 
                className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] min-h-[400px] outline-none text-white text-lg leading-relaxed placeholder:text-slate-800 focus:border-orange-500/30 transition-all font-serif" 
                placeholder="Let your heart guide your medicine..." 
              />
              <div className="mt-8 flex justify-end">
                <button className="gloss-button px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white">
                  Record Reflections
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem] bg-indigo-950/20 border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fas fa-sparkles text-6xl"></i>
              </div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                <i className="fas fa-wand-magic-sparkles text-indigo-400"></i> 
                Digital Medicine
              </h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed italic">
                A modern reflection aid grounded in tradition.
              </p>
              <button 
                onClick={() => handleGetGuidance(WEEKLY_TOPICS[activeWeek-1])} 
                disabled={loadingGuidance}
                className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-slate-300"
              >
                {loadingGuidance ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                Seek Reflection Prompt
              </button>
              {guidance && (
                <div className="mt-8 p-6 bg-black/40 rounded-3xl text-sm leading-relaxed text-slate-300 border border-white/5 animate-slideUp font-serif">
                  {guidance}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantPortal;
