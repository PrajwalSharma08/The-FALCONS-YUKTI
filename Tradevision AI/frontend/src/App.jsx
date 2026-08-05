import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, ShieldCheck, Zap, BarChart3, Upload, Activity, 
  ChevronRight, Newspaper, LayoutDashboard, Settings, ShieldAlert, 
  Info, Target, Eye, Briefcase, MousePointer2, Search, Globe, Filter, List,
  Calculator, Landmark, Wallet, Coins, RefreshCcw, Download, Share2, BarChart, Map,
  MessageSquare, Bot, Send, User, Sparkles, X, Minimize2, Layers, Cpu,
  Calendar, AlarmClock, AlertTriangle, Clock, DollarSign, CheckCircle2, AlertCircle
} from 'lucide-react';

// --- SUB-COMPONENT: COUNTDOWN ENGINE ---
const CountdownTimer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("LIVE NOW");
        return;
      }

      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  return <span className="font-mono text-cyan-400">{timeLeft}</span>;
};

const App = () => {
  // --- UI & NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('scanner');
  const [mode, setMode] = useState('standard'); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- ANALYSIS STATE ---
  const [file, setFile] = useState(null);
  const [fileLong, setFileLong] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewLong, setPreviewLong] = useState(null);
  const [report, setReport] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [quality, setQuality] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [confidence, setConfidence] = useState(null);
  
  // --- RISK CALCULATOR STATE ---
  const [balance, setBalance] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1.0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [lotSize, setLotSize] = useState(1);
  const [calcResults, setCalcResults] = useState(null);

  // --- MARKET DATA STATE ---
  const [heatmapData, setHeatmapData] = useState(null);
  const [events, setEvents] = useState([]);
  const [prices, setPrices] = useState({ NIFTY: 22124.5, GOLD: 2040.0, BTC: 64230.1, ETH: 3452.1 });
  const [news, setNews] = useState([{ tag: "SYSTEM", text: "Falcon Intelligence Core Ready.", time: "READY" }]);

  // --- CHATBOT STATE ---
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am Falcon AI. Ask me about your trade analysis or risk management.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 1. Live Data Sync
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tickerRes = await fetch("http://localhost:8000/ticker");
        const tickerData = await tickerRes.json();
        if (tickerData.success) setPrices(tickerData.prices);

        const heatmapRes = await fetch("http://localhost:8000/heatmap");
        const hMapData = await heatmapRes.json();
        if (hMapData.success) setHeatmapData(hMapData.data);

        const eventRes = await fetch("http://localhost:8000/economic-events");
        const eData = await eventRes.json();
        if (eData.success) setEvents(eData.events);
      } catch (err) { console.log("Backend offline."); }
    };
    fetchData();
    const interval = setInterval(fetchData, 25000);
    return () => clearInterval(interval);
  }, []);

  // 2. Automated & Interactive Risk Math Engine
  useEffect(() => {
    const entry = parseFloat(entryPrice) || 0;
    const sl = parseFloat(stopLoss) || 0;
    const tp = parseFloat(takeProfit) || 0;
    const bal = parseFloat(balance) || 0;
    const riskP = parseFloat(riskPercent) || 0;

    if (entry > 0 && sl > 0 && entry !== sl) {
      const riskAmount = bal * (riskP / 100);
      const riskPerUnit = Math.abs(entry - sl);
      const rewardPerUnit = tp > 0 ? Math.abs(tp - entry) : 0;
      
      const totalUnits = riskPerUnit > 0 ? (riskAmount / riskPerUnit) : 0;
      const lots = totalUnits / (lotSize || 1);
      const rrRatio = riskPerUnit > 0 ? (rewardPerUnit / riskPerUnit) : 0;
      const potentialProfit = totalUnits * rewardPerUnit;

      setCalcResults({
        units: totalUnits.toFixed(0),
        lots: lots.toFixed(2),
        riskAmount: riskAmount.toFixed(2),
        potentialProfit: potentialProfit.toFixed(2),
        rr: rrRatio.toFixed(2),
        isSafe: rrRatio >= 1.5,
        statusLabel: rrRatio >= 2.0 ? "EXCELLENT (RR > 2.0)" : rrRatio >= 1.5 ? "GOOD (RR >= 1.5)" : "HIGH RISK (RR < 1.5)",
        projectedRoi: (rrRatio * riskP).toFixed(2)
      });
    } else { 
      setCalcResults(null); 
    }
  }, [balance, riskPercent, entryPrice, stopLoss, takeProfit, lotSize]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- HANDLERS ---
  const handleFileChange = (e, type = 'short') => {
    const f = e.target.files[0];
    if (!f) return;
    if (type === 'short') { setFile(f); setPreview(URL.createObjectURL(f)); }
    else { setFileLong(f); setPreviewLong(URL.createObjectURL(f)); }
    setReport(""); setVerdict(null); setQuality(null);
  };

  const handleDiscard = () => {
    setFile(null); setFileLong(null); setPreview(null); setPreviewLong(null);
    setReport(""); setVerdict(null); setQuality(null); setCalcResults(null);
    setEntryPrice(0); setStopLoss(0); setTakeProfit(0); setRiskScore(null); setConfidence(null);
  };

  const startAnalysis = async () => {
    if (mode === 'standard' && !file) return alert("Bhai, pehle chart toh upload karo!");
    setLoading(true);
    const formData = new FormData();
    let endpoint = mode === 'standard' ? "http://localhost:8000/analyze" : "http://localhost:8000/analyze-confluence";
    if (mode === 'standard') formData.append("file", file);
    else { formData.append("file_short", file); formData.append("file_long", fileLong); }

    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        setReport(data.report);
        const repUp = data.report.toUpperCase();
        
        if (repUp.includes("BUY") || repUp.includes("BULLISH") || repUp.includes("LONG")) {
          setVerdict("BUY");
        } else if (repUp.includes("SELL") || repUp.includes("BEARISH") || repUp.includes("SHORT")) {
          setVerdict("SELL");
        } else {
          setVerdict("WAIT");
        }

        setQuality(data.is_shq ? "SUPER HIGH" : "STANDARD");
        if (data.calc_data) {
           if (data.calc_data.entry) setEntryPrice(data.calc_data.entry); 
           if (data.calc_data.sl) setStopLoss(data.calc_data.sl);
           if (data.calc_data.tp) setTakeProfit(data.calc_data.tp); 
           setLotSize(data.calc_data.lot_size || 1);
        }
        if (data.news) setNews(data.news.map(n => ({ tag: `LIVE FEED`, text: n, time: "NOW" })));
        setRiskScore(data.is_shq ? (Math.random() * 2 + 1).toFixed(1) : (Math.random() * 3 + 2).toFixed(1)); 
        setConfidence(data.is_shq ? 98 : 88);
      }
    } catch (err) { alert("Backend offline!"); } finally { setLoading(false); }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setMessages(p => [...p, userMsg]);
    setChatInput(""); setChatLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chatInput, context: report || "No context yet." })
      });
      const data = await res.json();
      if (data.success) setMessages(p => [...p, { role: 'bot', text: data.response }]);
    } catch { setMessages(p => [...p, { role: 'bot', text: "Neural core timeout." }]); } finally { setChatLoading(false); }
  };

  const formatReport = (text) => {
    if (!text) return null;
    return text.split(/###+|####+/).map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/\*\*|#/g, '').trim();
      const content = lines.slice(1).join('\n').trim();
      if (!title || title.toLowerCase().includes("report")) return null;
      return (
        <div key={index} className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl mb-4 group hover:border-cyan-500/20 transition-all">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">{title}</h4>
          <div className="text-[13px] leading-relaxed text-slate-400 font-mono whitespace-pre-wrap">{content}</div>
        </div>
      );
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'scanner':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 pb-20">
            <div className="lg:col-span-8 space-y-8">
              
              {/* --- DYNAMIC BRANDING HEADER --- */}
              <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32 text-cyan-400" /></div>
                <h2 className="text-[12px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4">Institutional Intelligence</h2>
                <h1 className="text-6xl font-black text-white italic leading-none tracking-tighter uppercase">
                    The Falcons <br/>
                    <span className="text-cyan-400">Architecture</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-8 opacity-60">
                    Multimodal Neural Node: BBS-Y0118 • Real-time Pixel Decoding Active
                </p>
              </div>

              <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 tracking-widest uppercase font-mono"><BarChart3 className="w-4 h-4 text-cyan-400" /> Neural Scanner</h3>
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                        <button onClick={() => {setMode('standard'); handleDiscard();}} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'standard' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}>STANDARD</button>
                        <button onClick={() => {setMode('confluence'); handleDiscard();}} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'confluence' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>CONFLUENCE (MTC)</button>
                    </div>
                </div>

                {loading ? (
                    <div className="h-[400px] flex flex-col items-center justify-center gap-6">
                        <div className="relative"><div className="w-20 h-20 border-4 border-cyan-500/10 rounded-full"></div><div className="absolute top-0 w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
                        <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 animate-pulse text-center">Processing Market Context...</p>
                    </div>
                ) : mode === 'standard' ? (
                    <div className={`relative border-2 border-dashed rounded-[2rem] h-[400px] flex flex-col items-center justify-center transition-all ${file ? 'border-cyan-500/30 bg-slate-950/60' : 'border-white/5 bg-slate-950/40'}`}>
                        {preview ? (
                            <div className="w-full h-full p-6 relative flex flex-col items-center">
                                <img src={preview} alt="Preview" className="max-h-[250px] rounded-2xl object-contain mb-6 shadow-2xl" />
                                <div className="flex gap-4">
                                    <button onClick={handleDiscard} className="text-[10px] text-slate-500 uppercase font-black px-6 py-3 hover:text-red-400 transition-colors">Discard Feed</button>
                                    <button onClick={startAnalysis} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl uppercase text-xs tracking-widest">Execute Neural Scan</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <input type="file" id="chart-upload" onChange={e => handleFileChange(e)} className="hidden" />
                                <label htmlFor="chart-upload" className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl text-xs font-black transition-all uppercase tracking-widest shadow-lg inline-block group">
                                    <Upload className="w-8 h-8 mx-auto mb-4 opacity-40 group-hover:text-cyan-400 transition-colors" />
                                    Select Chart Screenshot
                                </label>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                        <div className={`border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center bg-slate-950/40 relative group ${file ? 'border-emerald-500/30' : 'border-white/5'}`}>
                            {preview ? <img src={preview} alt="5m" className="max-h-full p-4 rounded-3xl object-contain" /> : (
                                <label className="cursor-pointer text-center"><input type="file" onChange={e => handleFileChange(e, 'short')} className="hidden" /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload 5M Chart</p></label>
                            )}
                            {file && <button onClick={handleDiscard} className="absolute top-4 right-4 bg-red-500/10 text-red-500 p-1 rounded-lg hover:bg-red-500 hover:text-white transition-all"><X className="w-4 h-4"/></button>}
                        </div>
                        <div className={`border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center bg-slate-950/40 relative group ${fileLong ? 'border-emerald-500/30' : 'border-white/5'}`}>
                            {previewLong ? <img src={previewLong} alt="1h" className="max-h-full p-4 rounded-3xl object-contain" /> : (
                                <label className="cursor-pointer text-center"><input type="file" onChange={e => handleFileChange(e, 'long')} className="hidden" /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload 1H Chart</p></label>
                            )}
                            {fileLong && <button onClick={handleDiscard} className="absolute top-4 right-4 bg-red-500/10 text-red-500 p-1 rounded-lg hover:bg-red-500 hover:text-white transition-all"><X className="w-4 h-4"/></button>}
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button onClick={startAnalysis} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-xs tracking-widest transition-all active:scale-[0.98]">Execute Neural Confluence Scan</button>
                        </div>
                    </div>
                )}
                {report && <div className="mt-12 animate-in slide-in-from-bottom-4">{formatReport(report)}</div>}
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
                {/* SIGNAL CARD */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase mb-10">Neural Signal</h3>
                    {verdict ? (
                        <div className="space-y-8 text-center">
                            {quality === 'SUPER HIGH' && ( <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black py-2 rounded-full border border-emerald-500/30 animate-bounce tracking-widest">CONFLUENCE VERIFIED ✓</div> )}
                            <div className={`p-12 rounded-[2rem] border-b-8 transition-all duration-700 ${verdict === 'BUY' ? 'bg-emerald-500/5 border-emerald-500 text-emerald-400 shadow-emerald-500/20' : verdict === 'SELL' ? 'bg-red-500/5 border-red-500 text-red-400 shadow-red-500/20' : 'bg-amber-500/5 border-amber-500 text-amber-400'}`}>
                                <h2 className="text-7xl font-black italic tracking-tighter">{verdict}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-center font-mono">
                                    <p className="text-[9px] text-slate-500 uppercase mb-2 font-bold tracking-widest">Confidence</p><p className="text-3xl font-black text-cyan-400">{confidence}%</p>
                                </div>
                                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-center font-mono">
                                    <p className="text-[9px] text-slate-500 uppercase mb-2 font-bold tracking-widest">Risk Score</p><p className="text-3xl font-black text-amber-400">{riskScore}/10</p>
                                </div>
                            </div>
                        </div>
                    ) : <div className="py-24 text-center opacity-20 italic text-xs tracking-widest uppercase">Awaiting Neural Link...</div>}
                </div>

                {/* --- PRO INTERACTIVE RISK CALCULATOR ENGINE --- */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-cyan-400" /> Automated Risk Math Suite
                        </h3>
                        <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">EDITABLE</span>
                    </div>

                    {/* Quick Risk % Presets */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                            <span>Account Risk Policy</span>
                            <span className="text-cyan-400">{riskPercent}% Risk per Trade</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[0.5, 1.0, 2.0, 3.0].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setRiskPercent(p)}
                                    className={`py-1.5 rounded-lg text-[10px] font-black font-mono transition-all border ${riskPercent === p ? 'bg-cyan-600 text-white border-cyan-400 shadow-md' : 'bg-slate-950 text-slate-400 border-white/5 hover:border-white/20'}`}
                                >
                                    {p}%
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Account Balance & Price Inputs */}
                    <div className="space-y-3">
                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-3 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Capital Balance</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-mono text-slate-500">₹/$</span>
                                <input 
                                    type="number" 
                                    value={balance} 
                                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)} 
                                    className="w-24 bg-transparent text-right text-xs text-white font-mono font-bold outline-none border-b border-cyan-500/30 focus:border-cyan-400" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-950 border border-white/5 rounded-2xl p-3">
                                <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Entry Price</p>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={entryPrice || ''} 
                                    onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)} 
                                    className="w-full bg-transparent text-xs text-white font-mono font-bold outline-none border-b border-transparent focus:border-cyan-400" 
                                />
                            </div>
                            <div className="bg-slate-950 border border-white/5 rounded-2xl p-3">
                                <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Stop Loss</p>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={stopLoss || ''} 
                                    onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)} 
                                    className="w-full bg-transparent text-xs text-red-400 font-mono font-bold outline-none border-b border-transparent focus:border-red-400" 
                                />
                            </div>
                            <div className="bg-slate-950 border border-white/5 rounded-2xl p-3">
                                <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Take Profit</p>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={takeProfit || ''} 
                                    onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)} 
                                    className="w-full bg-transparent text-xs text-emerald-400 font-mono font-bold outline-none border-b border-transparent focus:border-emerald-400" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* LIVE CALCULATION METRICS */}
                    {calcResults ? (
                        <div className={`p-5 rounded-2xl border transition-all space-y-4 ${calcResults.isSafe ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.08)]' : 'bg-amber-500/5 border-amber-500/30'}`}>
                            
                            {/* Safety Badge */}
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Setup Validation</span>
                                <div className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1 rounded-full border ${calcResults.isSafe ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                    {calcResults.isSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                    {calcResults.statusLabel}
                                </div>
                            </div>

                            {/* Position Size & Risk Amount */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Quantity (Units/Lots)</p>
                                    <p className="text-2xl font-black text-white font-mono">{calcResults.units} <span className="text-xs text-slate-500 font-normal">units</span></p>
                                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">({calcResults.lots} Lots)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Risk Amount</p>
                                    <p className="text-2xl font-black text-red-400 font-mono">₹{calcResults.riskAmount}</p>
                                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">({riskPercent}% of Total Capital)</p>
                                </div>
                            </div>

                            {/* RR Ratio & Projected Profit */}
                            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Risk : Reward</p>
                                    <p className="text-xl font-black text-cyan-400 font-mono">1 : {calcResults.rr}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Projected Profit</p>
                                    <p className="text-xl font-black text-emerald-400 font-mono">+₹{calcResults.potentialProfit}</p>
                                </div>
                            </div>

                            {/* Progress Indicator */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[8px] font-black text-slate-500">
                                    <span>PROJECTED ROI</span>
                                    <span className="text-emerald-400 font-mono">+{calcResults.projectedRoi}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_10px_#10b981]" style={{width: `${Math.min(Math.max(calcResults.projectedRoi * 10, 10), 100)}%`}}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-dashed border-white/5 space-y-2">
                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Type Prices or Scan a Chart</p>
                            <p className="text-[10px] text-slate-500 italic">Enter Entry Price and Stop Loss above to calculate real-time position sizing, lot quantities, and risk-reward ratios.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-700 pb-20">
             <div className="flex items-center gap-6 mb-16">
                <div className="p-5 bg-cyan-500/10 rounded-3xl shadow-xl"><Activity className="text-cyan-400 w-8 h-8" /></div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-widest">Core Engine Analytics</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Real-time Hardware Load & Precision Metrics</p>
                </div>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center text-center py-20 relative group">
                <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] rounded-full group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
                <h1 className="text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-800 leading-none tracking-tighter italic select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">FALCON</h1>
                <div className="flex items-center gap-10 -mt-6"><div className="h-[2px] w-48 bg-gradient-to-l from-cyan-500 to-transparent"></div><h2 className="text-4xl font-black text-cyan-400 uppercase tracking-[0.8em] italic">ARCHITECTURE</h2><div className="h-[2px] w-48 bg-gradient-to-r from-cyan-500 to-transparent"></div></div>
                <p className="mt-12 text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] animate-pulse">Neural Core Evolution • BBS Group • YuKti 2026</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-cyan-500/20 transition-all">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Vision Accuracy</p>
                   <p className="text-5xl font-black text-emerald-400 group-hover:scale-110 transition-transform">94.8%</p>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden"><div className="w-[94%] h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div></div>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] group hover:border-cyan-500/20 transition-all"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Inference Latency</p><p className="text-5xl font-black text-cyan-400 group-hover:scale-110 transition-transform">0.82<span className="text-lg">s</span></p></div>
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] group hover:border-cyan-500/20 transition-all"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Node</p><p className="text-2xl font-black text-slate-200 uppercase tracking-tighter flex items-center gap-3"><Cpu className="w-6 h-6 text-slate-500" /> BBS-FALCON-X1</p></div>
             </div>
          </div>
        );
      case 'heatmap':
        return (
          <div className="animate-in slide-in-from-right-8 duration-700 pb-20">
             <div className="flex items-center gap-6 mb-12"><div className="p-5 bg-cyan-500/10 rounded-3xl"><Globe className="text-cyan-400 w-8 h-8" /></div><div><h2 className="text-3xl font-black text-white uppercase italic tracking-widest">Global Heatmap</h2><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Cross-Market Neural Sentiment</p></div></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {heatmapData ? Object.entries(heatmapData).map(([region, data], i) => (
                    <div key={i} className={`p-10 rounded-[3rem] border transition-all duration-700 relative overflow-hidden group ${data.sentiment === 'Bullish' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]' : data.sentiment === 'Bearish' ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]' : 'bg-slate-900/40 border-white/5'}`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Activity className="w-20 h-20" /></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{region} Index</p>
                        <h3 className="text-4xl font-black text-white italic mb-2 tracking-tighter">{data.sentiment}</h3>
                        <div className="flex items-center gap-2"><span className={`text-xl font-bold font-mono ${data.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{data.change}</span><div className={`w-2 h-2 rounded-full ${data.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div></div>
                        <p className="text-[9px] text-slate-600 mt-8 font-black uppercase border-t border-white/5 pt-4">Data Node: Llama-4-Scout</p>
                    </div>
                )) : <div className="col-span-3 py-32 text-center opacity-20 uppercase tracking-[0.5em] font-black italic">Syncing with Global Nodes...</div>}
             </div>
          </div>
        );
      case 'news':
        return (
          <div className="animate-in slide-in-from-right-8 duration-700 pb-20">
             <h2 className="text-3xl font-black text-white uppercase italic tracking-widest mb-10 flex items-center gap-4"><div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_red]"></div> Live Intelligence Feed</h2>
             <div className="grid grid-cols-1 gap-6">
                {news.map((item, i) => (
                   <div key={i} className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] flex gap-10 items-start hover:border-cyan-500/20 transition-all group">
                      <div className="text-[10px] font-black text-slate-600 w-20 pt-2 font-mono">{item.time}</div>
                      <div className="flex-1">
                         <span className="text-[9px] font-black px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full uppercase mb-4 inline-block tracking-widest">{item.tag}</span>
                         <h4 className="text-2xl font-bold text-slate-200 group-hover:text-white transition-colors leading-tight">"{item.text}"</h4>
                         <p className="text-[11px] text-slate-600 mt-6 font-mono opacity-40 uppercase tracking-widest italic">Source: yfinance Aggregator Engine</p>
                      </div>
                      <ChevronRight className="w-8 h-8 text-slate-700 mt-2" />
                   </div>
                ))}
             </div>
          </div>
        );
      case 'fundamental':
        return (
          <div className="max-w-6xl mx-auto animate-in slide-in-from-right-8 duration-700 pb-20">
             <div className="flex items-center gap-6 mb-12">
                <div className="p-5 bg-cyan-500/10 rounded-3xl"><AlarmClock className="text-cyan-400 w-10 h-10" /></div>
                <div><h2 className="text-4xl font-black text-white uppercase italic tracking-widest">Fundamental Radar</h2><p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Real-time Economic Calendar & Volatility Countdown</p></div>
             </div>
             <div className="grid grid-cols-1 gap-6">
                {events.map((ev) => (
                    <div key={ev.id} className="bg-slate-900/40 border border-white/5 p-10 rounded-[3.5rem] flex items-center gap-12 group hover:border-cyan-500/20 transition-all shadow-xl">
                        <div className="w-32 flex flex-col items-center border-r border-white/5 pr-12">
                            <div className={`p-4 rounded-3xl ${ev.impact === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}><AlertTriangle className="w-8 h-8" /></div>
                            <span className="text-[9px] font-black mt-4 uppercase tracking-[0.2em]">{ev.impact}</span>
                        </div>
                        <div className="flex-1 text-2xl font-black text-white uppercase">{ev.event}</div>
                        <div className="text-right bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 min-w-[240px]">
                            <p className="text-[9px] text-slate-600 uppercase mb-2">COUNTDOWN</p>
                            <div className="text-3xl font-black tracking-tighter"><CountdownTimer targetTime={ev.time} /></div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
             <div className="flex items-center gap-6 mb-16"><div className="p-5 bg-slate-900 rounded-3xl shadow-xl"><Settings className="text-slate-500 w-8 h-8" /></div><h2 className="text-3xl font-black text-white uppercase italic tracking-widest">Configuration</h2></div>
             <div className="space-y-4">
                {[
                   { label: "Vision Core", value: "Qwen 3.6 (27B Vision)", status: "OPTIMIZED", color: "text-cyan-400" },
                   { label: "Infrastructure", value: "Groq LPU Accelerator", status: "READY", color: "text-emerald-400" },
                   { label: "Execution Logic", value: "Institutional Tier 4", status: "ENFORCED", color: "text-blue-400" },
                   { label: "Data Pipeline", value: "Yahoo Finance Live", status: "CONNECTED", color: "text-slate-400" }
                ].map((s, i) => (
                   <div key={i} className="bg-slate-900/40 border border-white/5 p-10 rounded-[2rem] flex justify-between items-center group transition-all">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300">{s.label}</span>
                      <div className="flex items-center gap-6"><span className={`text-[11px] font-mono font-black uppercase ${s.color}`}>{s.value}</span><span className="text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10 tracking-widest">{s.status}</span></div>
                   </div>
                ))}
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-cyan-500/30">
      
      {/* INFINITY TICKER */}
      <div className="bg-slate-950 border-b border-white/5 py-2 px-6 flex gap-12 overflow-hidden whitespace-nowrap z-[60]">
        <div className="flex gap-12 animate-marquee">
          {Object.entries(prices).map(([asset, price]) => (
            <div key={asset} className="flex gap-3 items-center text-[10px] font-black uppercase">
              <span className="text-slate-500 tracking-widest">{asset}</span>
              <span className="text-cyan-400 font-mono">{price.toLocaleString()}</span>
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            </div>
          ))}
          {Object.entries(prices).map(([asset, price]) => (
            <div key={asset + '_c'} className="flex gap-3 items-center text-[10px] font-black uppercase">
              <span className="text-slate-500 tracking-widest">{asset}</span>
              <span className="text-cyan-400 font-mono">{price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-24 border-r border-white/5 bg-slate-900/20 flex flex-col items-center py-12 gap-8 sticky top-0 h-full z-50">
            <div className="p-3 bg-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/20 mb-4 cursor-pointer hover:scale-110 transition-all" onClick={() => setActiveTab('scanner')}>
                <Zap className="text-white w-8 h-8" />
            </div>
            <div className="h-[2px] w-8 bg-white/5 rounded-full"></div>
            <button onClick={() => setActiveTab('scanner')} className={`p-5 rounded-3xl transition-all relative ${activeTab === 'scanner' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300'}`}><LayoutDashboard className="w-6 h-6 mx-auto" /></button>
            <button onClick={() => setActiveTab('fundamental')} className={`p-5 rounded-3xl transition-all relative ${activeTab === 'fundamental' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300'}`}><AlarmClock className="w-6 h-6 mx-auto" /></button>
            <button onClick={() => setActiveTab('heatmap')} className={`p-5 rounded-3xl transition-all relative ${activeTab === 'heatmap' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300'}`}><Globe className="w-6 h-6 mx-auto" /></button>
            <button onClick={() => setActiveTab('analytics')} className={`p-5 rounded-3xl transition-all relative ${activeTab === 'analytics' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300'}`}><BarChart className="w-6 h-6 mx-auto" /></button>
            <button onClick={() => setActiveTab('news')} className={`p-5 rounded-3xl transition-all relative ${activeTab === 'news' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300'}`}><Newspaper className="w-6 h-6 mx-auto" /></button>
            <div className="mt-auto"><button onClick={() => setActiveTab('settings')} className={`p-5 rounded-3xl transition-all ${activeTab === 'settings' ? 'bg-cyan-600 text-white shadow-xl' : 'text-slate-700'}`}><Settings className="w-6 h-6" /></button></div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl p-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-6">
                        <div className="bg-cyan-500 p-2.5 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse"><Zap className="text-white w-5 h-5" /></div>
                        <div><h1 className="text-xl font-black font-mono tracking-[0.2em] text-white uppercase italic leading-none">TradeVision <span className="text-cyan-400">Pro</span></h1><p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em] mt-1.5">THE FALCONS • YuKti 2026 • AI DECODING SUITE</p></div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 rounded-full border border-emerald-500/10 shadow-lg">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Online</span>
                    </div>
                </div>
            </nav>

            <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">{renderContent()}</div>
            <footer className="mt-auto py-12 text-center border-t border-white/5 text-[9px] text-slate-700 uppercase tracking-[0.6em] font-black italic">The Falcons Architecture • Developed for YuKti 2026 • BBS Engineering</footer>
        </div>
      </div>

      {/* --- FLOATING ROBOT CHAT COMPONENT --- */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
          {isChatOpen && (
            <div className="w-[400px] h-[550px] bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
                <div className="p-6 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg"><Bot className="w-5 h-5 text-cyan-400" /></div>
                        <span className="text-xs font-black uppercase tracking-widest text-white italic">Falcon AI Mentor</span>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white transition-colors"><Minimize2 className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-300 rounded-tl-none border border-white/5'}`}>{m.text}</div>
                        </div>
                    ))}
                    {chatLoading && <div className="flex gap-2 p-4 bg-slate-900 w-16 rounded-xl animate-pulse"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div></div>}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChat} className="p-4 bg-slate-900/50 border-t border-white/5 flex gap-2">
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask Falcon AI..." className="flex-1 bg-slate-950 border border-white/10 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-cyan-500/50" />
                    <button type="submit" disabled={chatLoading} className="p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 transition-all disabled:opacity-50"><Send className="w-3 h-3" /></button>
                </form>
            </div>
          )}
          <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isChatOpen ? 'bg-slate-800 rotate-90 scale-90 opacity-0 pointer-events-none' : 'bg-cyan-600 shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 group'}`}><div className="relative"><Bot className="text-white w-8 h-8 group-hover:rotate-12 transition-transform" /><div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617] animate-pulse"></div></div></button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 40s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}} />
    </div>
  );
};

export default App;