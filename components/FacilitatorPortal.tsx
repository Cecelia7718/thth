
import React, { useState } from 'react';
import { generateGrantSummary } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WEEKLY_TOPICS } from '../constants';
import { Session } from '../types';
import ParticipantPortal from './ParticipantPortal';

const MOCK_REPORT_DATA = {
  participants: 12,
  sessions: 4,
  completionRatePercent: 92,
  preAverages: { connection: 4.2, stress: 7.8, efficacy: 5.1 },
  postAverages: { connection: 8.5, stress: 3.4, efficacy: 8.9 },
  deltas: { connectionChange: 4.3, stressChange: -4.4, efficacyChange: 3.8 }
};

const MOCK_COHORTS = [
  { id: 'cohort-001', name: 'Spring 2024 Healing Circle' },
  { id: 'cohort-002', name: 'Summer 2024 Wisdom Path' }
];

const MOCK_PARTICIPANTS: Record<string, { id: string, name: string, status: string, email: string }[]> = {
  'cohort-001': [
    { id: 'usr_8x92a', name: 'Leona Redfeather', status: 'Active', email: 'leona.redfeather@gmail.com' },
    { id: 'usr_7z31b', name: 'Sarah Morningstar', status: 'Active', email: 'sarah.morningstar@outlook.com' },
    { id: 'usr_9c44d', name: 'Maya Tallcloud', status: 'Completed', email: 'mtallcloud88@yahoo.com' },
    { id: 'usr_2k11m', name: 'Elena Silverbird', status: 'Active', email: 'elena.silverbird@gmail.com' },
    { id: 'usr_5h55n', name: 'Grace Whitewater', status: 'Active', email: 'grace.ww@icloud.com' },
    { id: 'usr_3j99p', name: 'Nora Eagleton', status: 'Completed', email: 'nora.eagleton@gmail.com' },
  ],
  'cohort-002': [
    { id: 'usr_4m22q', name: 'Kateri Tekakwitha', status: 'Active', email: 'kateri.tek@gmail.com' },
    { id: 'usr_6b77r', name: 'Winona Laduke', status: 'Active', email: 'w.laduke@earthlink.net' },
    { id: 'usr_1v88s', name: 'Aiyana Littlebear', status: 'Withdrawn', email: 'aiyana.lb@hotmail.com' },
  ]
};

const MOCK_INITIAL_SCHEDULES: Record<string, Session[]> = {
  'cohort-001': [
    { cohortId: 'cohort-001', weekNumber: 1, topic: WEEKLY_TOPICS[0], dateTime: '2024-03-27T18:00', zoomLink: 'https://zoom.us/j/123456' },
    { cohortId: 'cohort-001', weekNumber: 2, topic: WEEKLY_TOPICS[1], dateTime: '2024-04-03T18:00', zoomLink: 'https://zoom.us/j/123456' },
    { cohortId: 'cohort-001', weekNumber: 3, topic: WEEKLY_TOPICS[2], dateTime: '2024-04-10T18:00', zoomLink: 'https://zoom.us/j/123456' },
    { cohortId: 'cohort-001', weekNumber: 4, topic: WEEKLY_TOPICS[3], dateTime: '', zoomLink: '' },
  ],
  'cohort-002': WEEKLY_TOPICS.map((topic, i) => ({
    cohortId: 'cohort-002', weekNumber: i + 1, topic, dateTime: '', zoomLink: ''
  }))
};

const FacilitatorPortal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'cohorts' | 'profiles' | 'scheduling' | 'logs' | 'grant' | 'participant_view'>('overview');
  const [selectedCohortId, setSelectedCohortId] = useState<string>(MOCK_COHORTS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileStatusFilter, setProfileStatusFilter] = useState('All');
  
  const [plannerCohortId, setPlannerCohortId] = useState<string>(MOCK_COHORTS[0].id);
  const [cohortSchedules, setCohortSchedules] = useState<Record<string, Session[]>>(MOCK_INITIAL_SCHEDULES);

  const [logForm, setLogForm] = useState({
    cohortId: MOCK_COHORTS[0].id,
    weekNumber: 1,
    dynamics: '',
    significantMoments: '',
    challenges: '',
    selfReflection: ''
  });

  const chartData = [
    { name: 'Connection', pre: MOCK_REPORT_DATA.preAverages.connection, post: MOCK_REPORT_DATA.postAverages.connection },
    { name: 'Stress', pre: MOCK_REPORT_DATA.preAverages.stress, post: MOCK_REPORT_DATA.postAverages.stress },
    { name: 'Efficacy', pre: MOCK_REPORT_DATA.preAverages.efficacy, post: MOCK_REPORT_DATA.postAverages.efficacy },
  ];

  const apiCreateSession = async (payload: Session) => {
    console.log('API Request: Creating New Session:', payload);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const apiSubmitLog = async (payload: any) => {
    console.log('Pushing to FacilitatorLogs sheet:', payload);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleCreateSession = async (session: Session) => {
    setLoading(true);
    try {
      await apiCreateSession(session);
      setCohortSchedules(prev => {
        const current = prev[session.cohortId] || [];
        const updated = current.map(s => s.weekNumber === session.weekNumber ? session : s);
        return { ...prev, [session.cohortId]: updated };
      });
      setLoading(false);
      alert('Session scheduled successfully.');
    } catch (err) {
      setLoading(false);
      alert('Error scheduling session.');
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiSubmitLog({ 
        ...logForm, 
        timestamp: new Date().toISOString(),
        type: 'FacilitatorLog'
      });
      setLoading(false);
      alert('Log submitted successfully.');
      setLogForm({ ...logForm, dynamics: '', significantMoments: '', challenges: '', selfReflection: '' });
    } catch (err) {
      setLoading(false);
      alert('Error submitting log.');
    }
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    const quotes = ["Heritage is my anchor.", "Found safety in sisterhood."];
    const text = await generateGrantSummary(MOCK_REPORT_DATA, quotes);
    setSummary(text || '');
    setLoading(false);
  };

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${activeTab === id ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}
    >
      <i className={`fas ${icon}`}></i>
      {label}
    </button>
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'Withdrawn': return 'bg-red-500/10 border-red-500/20 text-red-400';
      default: return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Completed': return 'fa-check-circle';
      case 'Withdrawn': return 'fa-times-circle';
      default: return 'fa-sync-alt';
    }
  };

  const filteredProfiles = Object.values(MOCK_PARTICIPANTS).flat().filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = profileStatusFilter === 'All' || p.status === profileStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-bold text-white">Facilitator Hub</h2>
            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-full">
              Role: Facilitator
            </span>
          </div>
          <p className="text-slate-500 font-medium italic">Overseeing the collective healing and impact metrics.</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto max-w-full no-scrollbar">
          <TabButton id="overview" label="Overview" icon="fa-chart-pie" />
          <TabButton id="cohorts" label="Cohort Management" icon="fa-users-cog" />
          <TabButton id="profiles" label="Participant Profiles" icon="fa-address-book" />
          <TabButton id="scheduling" label="Scheduling" icon="fa-calendar" />
          <TabButton id="logs" label="Session Logs" icon="fa-pen-nib" />
          <TabButton id="grant" label="AI Reporting" icon="fa-sparkles" />
          <TabButton id="participant_view" label="Participant View" icon="fa-eye" />
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Cohorts', val: '2', icon: 'fa-users', color: 'text-orange-400' },
              { label: 'Participants', val: '24', icon: 'fa-user-graduate', color: 'text-indigo-400' },
              { label: 'Completion', val: '92%', icon: 'fa-check-circle', color: 'text-emerald-400' },
              { label: 'Stress Delta', val: '-4.4', icon: 'fa-heart-pulse', color: 'text-rose-400' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-8 rounded-[2rem]">
                <div className={`text-2xl mb-4 ${stat.color}`}><i className={`fas ${stat.icon}`}></i></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass-card p-10 rounded-[2.5rem]">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">Outcome Metrics</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}} />
                    <Bar dataKey="pre" fill="#1e293b" radius={[6, 6, 0, 0]} name="Pre" />
                    <Bar dataKey="post" fill="#cc5500" radius={[6, 6, 0, 0]} name="Post" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card p-10 rounded-[2.5rem]">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">Recent Reflections</h3>
              <div className="space-y-6">
                {["Heritage is my anchor.", "Found safety in sisterhood."].map((t, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-slate-300 italic mb-4">"{t}"</p>
                    <span className="text-[10px] font-bold bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full uppercase">Healing</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="glass-card p-10 md:p-14 rounded-[3rem]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">Participant Directory</h3>
              <p className="text-slate-500">Complete roster of all circle members across cohorts.</p>
            </div>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" onChange={(e) => setProfileStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                <th className="pb-6 pl-4">Participant</th>
                <th className="pb-6">Status</th>
                <th className="pb-6">Email</th>
                <th className="pb-6">ID</th>
                <th className="pb-6 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((p, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-6 pl-4 font-bold text-white">{p.name}</td>
                  <td className="py-6">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border flex w-fit items-center gap-2 ${getStatusStyle(p.status)}`}>
                      <i className={`fas ${getStatusIcon(p.status)}`}></i>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-6 text-slate-400">{p.email}</td>
                  <td className="py-6 text-slate-500 font-mono text-xs">{p.id}</td>
                  <td className="py-6 text-right pr-4">
                    <button className="text-slate-500 hover:text-white"><i className="fas fa-ellipsis-h"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'scheduling' && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="glass-card p-10 md:p-14 rounded-[3rem]">
            <h3 className="text-2xl font-bold text-white mb-8">Schedule Circle Gatherings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Cohort</label>
                <select 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none"
                  value={plannerCohortId}
                  onChange={(e) => setPlannerCohortId(e.target.value)}
                >
                  {MOCK_COHORTS.map(c => <option key={c.id} value={c.id} className="bg-[#0b0f1a]">{c.name}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              {(cohortSchedules[plannerCohortId] || []).map((session, idx) => (
                <div key={idx} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">Week {session.weekNumber}</p>
                    <p className="text-sm font-bold text-white">{session.topic}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-slate-600">Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none"
                      value={session.dateTime}
                      onChange={(e) => {
                        const newSchedules = [...cohortSchedules[plannerCohortId]];
                        newSchedules[idx].dateTime = e.target.value;
                        setCohortSchedules({...cohortSchedules, [plannerCohortId]: newSchedules});
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-slate-600">Zoom Link</label>
                    <input 
                      type="url" 
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none"
                      placeholder="Meeting link..."
                      value={session.zoomLink}
                      onChange={(e) => {
                        const newSchedules = [...cohortSchedules[plannerCohortId]];
                        newSchedules[idx].zoomLink = e.target.value;
                        setCohortSchedules({...cohortSchedules, [plannerCohortId]: newSchedules});
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => handleCreateSession(session)}
                    className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="max-w-4xl mx-auto glass-card p-10 md:p-14 rounded-[3rem]">
          <h3 className="text-2xl font-bold text-white mb-10">Facilitator Session Log</h3>
          <form className="space-y-10" onSubmit={handleLogSubmit}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-xs uppercase font-bold text-slate-500">Cohort</label>
                 <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" onChange={(e) => setLogForm({...logForm, cohortId: e.target.value})}>
                   {MOCK_COHORTS.map(c => <option key={c.id} value={c.id} className="bg-[#0b0f1a]">{c.name}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-xs uppercase font-bold text-slate-500">Week</label>
                 <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" onChange={(e) => setLogForm({...logForm, weekNumber: parseInt(e.target.value)})}>
                   {[1,2,3,4].map(w => <option key={w} value={w} className="bg-[#0b0f1a]">Week {w}</option>)}
                 </select>
               </div>
             </div>
             <textarea 
               className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl min-h-[120px] text-white outline-none" 
               placeholder="Dynamics & Significant moments..."
               value={logForm.dynamics}
               onChange={(e) => setLogForm({...logForm, dynamics: e.target.value})}
               required
             />
             <button type="submit" className="w-full gloss-button py-6 rounded-3xl font-bold uppercase tracking-widest text-xs text-white">
               Commit Log to Record
             </button>
          </form>
        </div>
      )}

      {activeTab === 'grant' && (
        <div className="max-w-4xl mx-auto glass-card rounded-[3rem] overflow-hidden">
          <div className="p-12 flex justify-between items-center border-b border-white/5">
            <h3 className="text-3xl font-bold text-white">AI Reporting</h3>
            <button onClick={handleGenerateSummary} disabled={loading} className="gloss-button px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-white">
              {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : null}
              Generate Narrative
            </button>
          </div>
          <div className="p-12 text-slate-300 leading-relaxed font-serif text-lg">
            {summary || "Click generate to create a narrative report for funders."}
          </div>
        </div>
      )}

      {activeTab === 'participant_view' && (
        <div className="animate-fadeIn">
          <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between">
             <span className="text-xs font-bold uppercase tracking-widest text-orange-400"><i className="fas fa-eye mr-2"></i>Preview Mode</span>
             <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-orange-400">Exit Preview</button>
          </div>
          <div className="opacity-90 pointer-events-none grayscale-[0.2]">
            <ParticipantPortal userId="preview-mode-facilitator" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitatorPortal;
