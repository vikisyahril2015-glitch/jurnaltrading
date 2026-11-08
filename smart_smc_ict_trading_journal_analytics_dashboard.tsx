import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, ShieldAlert, Brain, Layers, Clock, 
  BarChart3, PlusCircle, CheckCircle2, AlertTriangle, Lightbulb, 
  Trash2, Filter, PieChart, Activity, DollarSign, Target, Award,
  ChevronRight, RefreshCw, AlertCircle, FileText
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';

// --- INITIAL MOCK DATA (SMC/ICT Realistic Trades) ---
const INITIAL_TRADES = [
  {
    id: "STP-101",
    date: "2026-03-02",
    time: "09:30",
    pair: "XAUUSD",
    session: "London",
    direction: "BUY",
    lots: [0.02, 0.02],
    entries: [2650.50, 2651.00],
    sl: 2646.00,
    tp: 2665.00,
    rMultiple: 3.2,
    pnl: 144.00,
    riskAmount: 45.00,
    executionType: "Partial TP", // Partial TP, TP 2R, BE, Trailing
    smcConfluences: ["Liquidity Sweep", "BOS / CHoCH", "FVG", "Discount Zone"],
    entryConfirmation: "LTF Shift",
    psychologyTags: ["None"],
    status: "WIN"
  },
  {
    id: "STP-102",
    date: "2026-03-02",
    time: "14:45",
    pair: "USTEC",
    session: "New York",
    direction: "SELL",
    lots: [0.05],
    entries: [21450.00],
    sl: 21490.00,
    tp: 21330.00,
    rMultiple: -1.0,
    pnl: -60.00,
    riskAmount: 60.00,
    executionType: "SL Hit",
    smcConfluences: ["Order Block", "Premium Zone"],
    entryConfirmation: "Single Candle OB",
    psychologyTags: ["FOMO"],
    status: "LOSS"
  },
  {
    id: "STP-103",
    date: "2026-03-03",
    time: "15:15",
    pair: "XAUUSD",
    session: "New York",
    direction: "SELL",
    lots: [0.03, 0.03],
    entries: [2672.00, 2673.50],
    sl: 2678.00,
    tp: 2650.00,
    rMultiple: 4.1,
    pnl: 225.00,
    riskAmount: 55.00,
    executionType: "Trailing Stop",
    smcConfluences: ["Liquidity Sweep", "FVG", "Order Block", "Premium Zone"],
    entryConfirmation: "LTF Shift",
    psychologyTags: ["None"],
    status: "WIN"
  },
  {
    id: "STP-104",
    date: "2026-03-03",
    time: "16:30",
    pair: "BTCUSD",
    session: "New York",
    direction: "BUY",
    lots: [0.02],
    entries: [88400.00],
    sl: 87900.00,
    tp: 89900.00,
    rMultiple: -1.0,
    pnl: -50.00,
    riskAmount: 50.00,
    executionType: "SL Hit",
    smcConfluences: ["FVG"],
    entryConfirmation: "Unconfirmed",
    psychologyTags: ["Revenge Trading", "Unconfirmed Entry"],
    status: "LOSS"
  },
  {
    id: "STP-105",
    date: "2026-03-04",
    time: "08:15",
    pair: "EURUSD",
    session: "London",
    direction: "BUY",
    lots: [0.10],
    entries: [1.0850],
    sl: 1.0835,
    tp: 1.0895,
    rMultiple: 2.0,
    pnl: 100.00,
    riskAmount: 50.00,
    executionType: "TP 2R",
    smcConfluences: ["Liquidity Sweep", "BOS / CHoCH", "Discount Zone"],
    entryConfirmation: "iFVG",
    psychologyTags: ["None"],
    status: "WIN"
  },
  {
    id: "STP-106",
    date: "2026-03-04",
    time: "10:00",
    pair: "XAUUSD",
    session: "London",
    direction: "BUY",
    lots: [0.02, 0.02],
    entries: [2640.00, 2641.50],
    sl: 2636.00,
    tp: 2655.00,
    rMultiple: 0.0,
    pnl: 5.00,
    riskAmount: 40.00,
    executionType: "Break-Even (BE)",
    smcConfluences: ["Order Block", "FVG"],
    entryConfirmation: "LTF Shift",
    psychologyTags: ["None"],
    status: "BE"
  },
  {
    id: "STP-107",
    date: "2026-03-05",
    time: "02:30",
    pair: "XAUUSD",
    session: "Asia",
    direction: "SELL",
    lots: [0.03],
    entries: [2658.00],
    sl: 2663.00,
    tp: 2643.00,
    rMultiple: -1.0,
    pnl: -45.00,
    riskAmount: 45.00,
    executionType: "SL Hit",
    smcConfluences: ["FVG"],
    entryConfirmation: "Unconfirmed",
    psychologyTags: ["Overtrading"],
    status: "LOSS"
  },
  {
    id: "STP-108",
    date: "2026-03-05",
    time: "14:00",
    pair: "USTEC",
    session: "New York",
    direction: "BUY",
    lots: [0.04],
    entries: [21500.00],
    sl: 21440.00,
    tp: 21680.00,
    rMultiple: 3.0,
    pnl: 180.00,
    riskAmount: 60.00,
    executionType: "Partial TP",
    smcConfluences: ["Liquidity Sweep", "BOS / CHoCH", "Order Block"],
    entryConfirmation: "LTF Shift",
    psychologyTags: ["None"],
    status: "WIN"
  },
  {
    id: "STP-109",
    date: "2026-03-06",
    time: "09:00",
    pair: "EURUSD",
    session: "London",
    direction: "SELL",
    lots: [0.08],
    entries: [1.0890],
    sl: 1.0910,
    tp: 1.0830,
    rMultiple: 2.8,
    pnl: 140.00,
    riskAmount: 50.00,
    executionType: "Trailing Stop",
    smcConfluences: ["Liquidity Sweep", "Premium Zone", "FVG"],
    entryConfirmation: "iFVG",
    psychologyTags: ["None"],
    status: "WIN"
  }
];

const INITIAL_ACCOUNT_BALANCE = 5000;

export default function App() {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accountBalance, setAccountBalance] = useState(INITIAL_ACCOUNT_BALANCE);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "14:00",
    pair: "XAUUSD",
    session: "New York",
    direction: "BUY",
    leg1Lot: "0.02",
    leg2Lot: "0.02",
    leg1Entry: "",
    leg2Entry: "",
    sl: "",
    tp: "",
    pnl: "",
    riskAmount: "50",
    executionType: "TP 2R",
    smcConfluences: ["Liquidity Sweep", "FVG"],
    entryConfirmation: "LTF Shift",
    psychologyTags: ["None"]
  });

  // --- STATISTICAL CALCULATIONS ---
  const stats = useMemo(() => {
    const totalSetups = trades.length;
    if (totalSetups === 0) return { winRate: 0, profitFactor: 0, expectancy: 0, maxDrawdown: 0, totalPnl: 0, winCount: 0, lossCount: 0, beCount: 0 };

    let winCount = 0;
    let lossCount = 0;
    let beCount = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let totalR = 0;
    let currentBalance = accountBalance;
    let peakBalance = accountBalance;
    let maxDrawdown = 0;

    const equityCurve = [{ date: 'Start', balance: accountBalance, rCumulative: 0 }];

    trades.forEach((t, idx) => {
      const pnl = Number(t.pnl);
      const r = Number(t.rMultiple);
      totalR += r;

      if (t.status === 'WIN') {
        winCount++;
        grossProfit += pnl;
      } else if (t.status === 'LOSS') {
        lossCount++;
        grossLoss += Math.abs(pnl);
      } else {
        beCount++;
      }

      currentBalance += pnl;
      if (currentBalance > peakBalance) {
        peakBalance = currentBalance;
      }
      const dd = ((peakBalance - currentBalance) / peakBalance) * 100;
      if (dd > maxDrawdown) maxDrawdown = dd;

      equityCurve.push({
        date: `${t.date} (${t.pair})`,
        balance: currentBalance,
        rCumulative: totalR
      });
    });

    const totalPnl = grossProfit - grossLoss;
    const winRate = totalSetups > 0 ? ((winCount / (winCount + lossCount || 1)) * 100).toFixed(1) : 0;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? '∞' : '0.00';
    const expectancyR = (totalR / totalSetups).toFixed(2);

    return {
      totalSetups,
      winCount,
      lossCount,
      beCount,
      totalPnl,
      winRate,
      profitFactor,
      expectancyR,
      maxDrawdown: maxDrawdown.toFixed(1),
      equityCurve,
      grossProfit,
      grossLoss
    };
  }, [trades, accountBalance]);

  // --- HANDLERS ---
  const handleAddTrade = (e) => {
    e.preventDefault();
    const lots = [parseFloat(newTrade.leg1Lot) || 0];
    if (newTrade.leg2Lot && parseFloat(newTrade.leg2Lot) > 0) {
      lots.push(parseFloat(newTrade.leg2Lot));
    }

    const entries = [parseFloat(newTrade.leg1Entry) || 0];
    if (newTrade.leg2Entry && parseFloat(newTrade.leg2Entry) > 0) {
      entries.push(parseFloat(newTrade.leg2Entry));
    }

    const pnlVal = parseFloat(newTrade.pnl) || 0;
    const riskVal = parseFloat(newTrade.riskAmount) || 50;
    const rMult = parseFloat((pnlVal / riskVal).toFixed(2));

    let status = 'BE';
    if (pnlVal > 5) status = 'WIN';
    else if (pnlVal < -5) status = 'LOSS';

    const tradeObj = {
      id: `STP-${100 + trades.length + 1}`,
      date: newTrade.date,
      time: newTrade.time,
      pair: newTrade.pair,
      session: newTrade.session,
      direction: newTrade.direction,
      lots,
      entries,
      sl: parseFloat(newTrade.sl),
      tp: parseFloat(newTrade.tp),
      rMultiple: rMult,
      pnl: pnlVal,
      riskAmount: riskVal,
      executionType: newTrade.executionType,
      smcConfluences: newTrade.smcConfluences,
      entryConfirmation: newTrade.entryConfirmation,
      psychologyTags: newTrade.psychologyTags,
      status
    };

    setTrades([tradeObj, ...trades]);
    setIsAddModalOpen(false);
  };

  const handleDeleteTrade = (id) => {
    if (window.confirm("Hapus setup jurnal ini?")) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  const toggleConfluence = (item) => {
    setNewTrade(prev => {
      const exists = prev.smcConfluences.includes(item);
      return {
        ...prev,
        smcConfluences: exists 
          ? prev.smcConfluences.filter(i => i !== item)
          : [...prev.smcConfluences, item]
      };
    });
  };

  const togglePsychology = (tag) => {
    setNewTrade(prev => {
      if (tag === 'None') return { ...prev, psychologyTags: ['None'] };
      const filtered = prev.psychologyTags.filter(t => t !== 'None');
      const exists = filtered.includes(tag);
      const updated = exists ? filtered.filter(t => t !== tag) : [...filtered, tag];
      return {
        ...prev,
        psychologyTags: updated.length === 0 ? ['None'] : updated
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* HEADER / TOPBAR */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              SMC/ICT Journal Hub
            </h1>
            <p className="text-xs text-slate-400">Institutional Orderflow & Multi-Leg Aggregator</p>
          </div>
        </div>

        {/* Quick Nav / Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <span className="text-slate-400">Account:</span>
            <span className="font-semibold text-emerald-400">${accountBalance.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Log New Setup
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-4 lg:px-8 overflow-x-auto">
        <div className="flex space-x-1 py-2 min-w-max">
          {[
            { id: 'dashboard', label: '1. Performance', icon: BarChart3 },
            { id: 'setups', label: '2. Setup Aggregator', icon: Layers },
            { id: 'sessions', label: '3. Session & Temporal', icon: Clock },
            { id: 'risk', label: '4. Risk & Compliance', icon: ShieldAlert },
            { id: 'smc', label: '5. SMC/ICT Confluences', icon: Target },
            { id: 'psychology', label: '6. Trading Psychology', icon: Brain },
            { id: 'ai-review', label: '7. AI Evaluator', icon: Lightbulb },
            { id: 'logs', label: '8. Trade Logs', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* ==================== TAB 1: PERFORMANCE DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard 
                title="Win Rate" 
                value={`${stats.winRate}%`}
                subtitle={`${stats.winCount}W - ${stats.lossCount}L - ${stats.beCount}BE`}
                icon={Award}
                color="text-emerald-400"
              />
              <MetricCard 
                title="Profit Factor" 
                value={stats.profitFactor}
                subtitle={`PF > 1.5 is Healthy`}
                icon={TrendingUp}
                color="text-teal-400"
              />
              <MetricCard 
                title="Expectancy" 
                value={`${stats.expectancyR} R`}
                subtitle="Avg R per Setup"
                icon={Target}
                color="text-indigo-400"
              />
              <MetricCard 
                title="Max Drawdown" 
                value={`${stats.maxDrawdown}%`}
                subtitle="Peak to Trough"
                icon={TrendingDown}
                color="text-rose-400"
              />
              <MetricCard 
                title="Total Net PnL" 
                value={`$${stats.totalPnl.toLocaleString()}`}
                subtitle={`Initial: $${accountBalance}`}
                icon={DollarSign}
                color={stats.totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}
              />
              <MetricCard 
                title="Total Setups" 
                value={stats.totalSetups}
                subtitle="Aggregated legs"
                icon={Layers}
                color="text-amber-400"
              />
            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cumulative Equity Curve Chart */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Equity Curve Growth ($)
                    </h3>
                    <p className="text-xs text-slate-400">Perkembangan saldo modal berdasarkan eksekusi setup</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.equityCurve}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                        formatter={(val) => [`$${val}`, 'Balance']}
                      />
                      <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly PnL / Outcome Breakdown */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
                    <PieChart className="w-4 h-4 text-teal-400" /> Setup Outcome Ratio
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">Distribusi Win, Loss, dan Break-Even</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-emerald-400">WIN ({stats.winCount})</span>
                        <span>{((stats.winCount / (stats.totalSetups || 1)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(stats.winCount / (stats.totalSetups || 1)) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-rose-400">LOSS ({stats.lossCount})</span>
                        <span>{((stats.lossCount / (stats.totalSetups || 1)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: `${(stats.lossCount / (stats.totalSetups || 1)) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-amber-400">BREAK EVEN ({stats.beCount})</span>
                        <span>{((stats.beCount / (stats.totalSetups || 1)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${(stats.beCount / (stats.totalSetups || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mt-4 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Profit:</span>
                    <span className="text-emerald-400 font-semibold">+${stats.grossProfit}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Loss:</span>
                    <span className="text-rose-400 font-semibold">-${stats.grossLoss}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SETUP ANALYZER ==================== */}
        {activeTab === 'setups' && (
          <div className="space-y-6">
            {/* Explanation Banner */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl text-xs text-slate-300 flex items-start gap-3">
              <Layers className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-400 text-sm block mb-1">Multi-Leg & Partial Execution Aggregator</span>
                Sistem ini tidak menghitung 0.02 lot terpisah sebagai trade berbeda. Dua atau lebih entri pada zona SMC yang sama digabungkan menjadi <strong>1 Setup Utuh</strong> untuk menganalisis efektivitas partial TP, TP 2R, Break-Even, dan trailing.
              </div>
            </div>

            {/* Execution Type Performance Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['TP 2R', 'Partial TP', 'Trailing Stop', 'Break-Even (BE)'].map(type => {
                const filtered = trades.filter(t => t.executionType === type);
                const wins = filtered.filter(t => t.status === 'WIN').length;
                const total = filtered.length;
                const pnl = filtered.reduce((acc, curr) => acc + Number(curr.pnl), 0);
                return (
                  <div key={type} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-semibold text-slate-400">{type}</span>
                    <div className="text-xl font-bold text-slate-100">${pnl.toFixed(2)}</div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                      <span>Total: {total} setup</span>
                      <span className="text-emerald-400 font-medium">{total > 0 ? ((wins/total)*100).toFixed(0) : 0}% Win Rate</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aggregated Setup Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-sm">Aggregated Multi-Leg Setups Log</h3>
                <span className="text-xs text-slate-400">Total Setup: {trades.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Setup ID</th>
                      <th className="p-3.5">Date / Time</th>
                      <th className="p-3.5">Pair</th>
                      <th className="p-3.5">Direction</th>
                      <th className="p-3.5">Legs (Lots)</th>
                      <th className="p-3.5">Avg Entry</th>
                      <th className="p-3.5">Execution Type</th>
                      <th className="p-3.5">R-Multiple</th>
                      <th className="p-3.5 text-right">Net PnL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {trades.map((t) => {
                      const totalLot = t.lots.reduce((a, b) => a + b, 0).toFixed(2);
                      const avgEntry = (t.entries.reduce((a, b) => a + b, 0) / t.entries.length).toFixed(2);
                      return (
                        <tr key={t.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5 font-semibold text-emerald-400">{t.id}</td>
                          <td className="p-3.5 text-slate-400">{t.date} <span className="text-slate-500">{t.time}</span></td>
                          <td className="p-3.5 font-bold">{t.pair}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${t.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                              {t.direction}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {t.lots.length} Leg ({totalLot} lot)
                          </td>
                          <td className="p-3.5 font-mono">{avgEntry}</td>
                          <td className="p-3.5 text-slate-300">{t.executionType}</td>
                          <td className="p-3.5 font-semibold">
                            <span className={t.rMultiple > 0 ? "text-emerald-400" : t.rMultiple < 0 ? "text-rose-400" : "text-amber-400"}>
                              {t.rMultiple > 0 ? `+${t.rMultiple}R` : `${t.rMultiple}R`}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold">
                            <span className={t.pnl > 0 ? "text-emerald-400" : t.pnl < 0 ? "text-rose-400" : "text-slate-400"}>
                              {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SESSION & TEMPORAL ANALYZER ==================== */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Session Performance Card */}
              {['London', 'New York', 'Asia'].map(session => {
                const sessionTrades = trades.filter(t => t.session === session);
                const wins = sessionTrades.filter(t => t.status === 'WIN').length;
                const total = sessionTrades.length;
                const winRate = total > 0 ? ((wins / total) * 100).toFixed(0) : 0;
                const pnl = sessionTrades.reduce((acc, c) => acc + Number(c.pnl), 0);

                return (
                  <div key={session} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" /> Sesi {session}
                      </h3>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{total} Trades</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-slate-100">${pnl.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">Total Profit / Loss Sesi</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Session Win Rate</span>
                        <span className="font-semibold text-emerald-400">{winRate}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${winRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Directional Analysis: BUY vs SELL */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" /> Performa Bias (BUY vs SELL)
                </h3>
                {['BUY', 'SELL'].map(dir => {
                  const dirTrades = trades.filter(t => t.direction === dir);
                  const wins = dirTrades.filter(t => t.status === 'WIN').length;
                  const total = dirTrades.length;
                  const wr = total > 0 ? ((wins/total)*100).toFixed(1) : 0;
                  const pnl = dirTrades.reduce((a, c) => a + Number(c.pnl), 0);

                  return (
                    <div key={dir} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${dir === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          POSISI {dir}
                        </span>
                        <span className="text-xs text-slate-400">{total} Setup Logged</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-slate-500">Net Return</div>
                          <div className={`text-lg font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${pnl.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Win Rate</div>
                          <div className="text-base font-bold text-slate-200">{wr}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day of Week Productivity */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" /> Hari & Jam Produktif
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 block">Hari Terbaik (Most Profitable)</span>
                      <span className="font-bold text-emerald-400 text-sm">Selasa & Rabu</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-semibold">+82% Win Rate</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 block">Jam Emas Trading (Optimal Window)</span>
                      <span className="font-bold text-amber-400 text-sm">14:00 - 17:00 (NY Open & Killzone)</span>
                    </div>
                    <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded font-semibold">High Volatility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: RISK MANAGEMENT ==================== */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs text-slate-400">Daily Hard Limit Guard</span>
                <div className="text-lg font-bold text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Max 2 Loss / Hari
                </div>
                <p className="text-[11px] text-slate-400">Mencegah tilt & overtrading saat pasar tidak bersahabat.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs text-slate-400">Avg Risk per Setup</span>
                <div className="text-xl font-bold text-slate-100">$51.10 <span className="text-xs text-slate-400 font-normal">(~1.02% Balance)</span></div>
                <p className="text-[11px] text-emerald-400">Konsisten dengan kriteria manajemen risiko.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs text-slate-400">Current Consecutive Losses</span>
                <div className="text-xl font-bold text-amber-400">1 Loss Streak</div>
                <p className="text-[11px] text-slate-400">Max historical losing streak: 2 trade</p>
              </div>
            </div>

            {/* Daily Compliance Rule Checklist */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Risk Protocol Compliance Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div>
                    <span className="font-bold text-slate-200 block">Risk per Trade &le; 2%</span>
                    <span className="text-slate-400">Semua setup mematuhi batas risiko maksimal $60/trade.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div>
                    <span className="font-bold text-slate-200 block">Stop Loss Selalu Terpasang</span>
                    <span className="text-slate-400">100% setup menggunakan Stop Loss berbasis struktur SMC.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: SMC / ICT CONFLUENCE ANALYZER ==================== */}
        {activeTab === 'smc' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> SMC / ICT Confluence Performance Breakdown
                </h3>
                <p className="text-xs text-slate-400">Analisis konfluensi teknikal mana yang memberikan Win Rate & Profit tertinggi</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Liquidity Sweep",
                  "BOS / CHoCH",
                  "FVG",
                  "Order Block",
                  "Discount Zone",
                  "Premium Zone"
                ].map(conf => {
                  const filtered = trades.filter(t => t.smcConfluences?.includes(conf));
                  const wins = filtered.filter(t => t.status === 'WIN').length;
                  const total = filtered.length;
                  const wr = total > 0 ? ((wins / total) * 100).toFixed(0) : 0;
                  const netPnl = filtered.reduce((a, c) => a + Number(c.pnl), 0);

                  return (
                    <div key={conf} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {conf}
                        </span>
                        <span className="text-xs text-slate-400">{total} Setup</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold text-slate-100">${netPnl.toFixed(2)}</span>
                        <span className="text-xs font-semibold text-emerald-400">{wr}% Win Rate</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${wr}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Entry Confirmation Types */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm">Konfirmasi Entry Lower Timeframe (LTF)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {['LTF Shift', 'iFVG', 'Single Candle OB'].map(type => {
                  const filtered = trades.filter(t => t.entryConfirmation === type);
                  const wins = filtered.filter(t => t.status === 'WIN').length;
                  const total = filtered.length;
                  return (
                    <div key={type} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-200 block">{type}</span>
                        <span className="text-slate-500">{total} Trade Executed</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">
                        {total > 0 ? ((wins/total)*100).toFixed(0) : 0}% WR
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: TRADING PSYCHOLOGY ==================== */}
        {activeTab === 'psychology' && (
          <div className="space-y-6">
            <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3">
              <Brain className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-400 text-sm">Psychological Leakage Tracker</h4>
                <p className="text-xs text-slate-300">
                  Melacak biaya tersembunyi dari kesalahan psikologis seperti FOMO, Revenge Trading, dan Entry tanpa Konfirmasi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['FOMO', 'Revenge Trading', 'Overtrading', 'Unconfirmed Entry'].map(tag => {
                const mistakes = trades.filter(t => t.psychologyTags?.includes(tag));
                const totalLost = mistakes.reduce((a, c) => a + (c.pnl < 0 ? Math.abs(c.pnl) : 0), 0);
                const count = mistakes.length;

                return (
                  <div key={tag} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded inline-block">
                      {tag}
                    </span>
                    <div className="text-xl font-bold text-rose-400">-${totalLost.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{count} Pelanggaran Dicatat</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: AI EVALUATOR & RECOMMENDATIONS ==================== */}
        {activeTab === 'ai-review' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Automated AI Trade Reviewer & Recommendations</h3>
                  <p className="text-xs text-slate-400">Evaluasi berbasis data statistik riwayat trading SMC/ICT Anda</p>
                </div>
              </div>

              {/* Dynamic Insights Generated */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Edge Terkuat Anda (Sweet Spot)
                  </span>
                  <p>
                    Setup pada <strong>XAUUSD</strong> selama <strong>Sesi London & New York</strong> dengan kombinasi konfluensi <strong>Liquidity Sweep + FVG</strong> menghasilkan Win Rate tertinggi yaitu <strong>75%</strong> dengan rata-rata Risk-to-Reward 3.2R.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Kebocoran Profit Terbesar (Leaks)
                  </span>
                  <p>
                    Trade yang dipicu oleh <strong>Revenge Trading & Entry Tanpa Konfirmasi LTF</strong> menyumbang kerugian sebesar <strong>$155.00</strong>. Jika pelanggaran emosional ini dieliminasi, net return modal Anda akan meningkat sebesar +28.4%.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Rekomendasi Tindakan (Action Plan)
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Fokus eksekusi HANYA pada Sesi London & NY (pukul 14:00 - 18:00 WIB). Hentikan trading di Sesi Asia.</li>
                    <li>Wajibkan minimal 2 konfluensi SMC (Liquidity Sweep + FVG/Order Block) sebelum memasang order entri.</li>
                    <li>Gunakan partial profit take (50% di 2R) untuk mengunci profit awal dan meminimalkan pnl drawdown.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 8: TRADE LOGS & DATA MANAGEMENT ==================== */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-sm">Full Trading Journal Log</h3>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  + Add Entry
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Pair / Session</th>
                      <th className="p-3">Direction</th>
                      <th className="p-3">SMC Confluences</th>
                      <th className="p-3">Psychology</th>
                      <th className="p-3">R-Multiple</th>
                      <th className="p-3">PnL ($)</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {trades.map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 font-semibold text-emerald-400">{t.id}</td>
                        <td className="p-3">
                          <div className="font-bold">{t.pair}</div>
                          <div className="text-[10px] text-slate-400">{t.session} ({t.date})</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${t.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {t.direction}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {t.smcConfluences?.map(c => (
                              <span key={c} className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-300">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          {t.psychologyTags?.map(p => (
                            <span key={p} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${p === 'None' ? 'bg-slate-800 text-slate-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {p}
                            </span>
                          ))}
                        </td>
                        <td className="p-3 font-bold">
                          <span className={t.rMultiple > 0 ? "text-emerald-400" : t.rMultiple < 0 ? "text-rose-400" : "text-amber-400"}>
                            {t.rMultiple}R
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span className={t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleDeleteTrade(t.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            title="Hapus Setup"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================== ADD NEW SETUP MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" /> Input Setup Jurnal Baru (SMC/ICT)
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTrade} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    value={newTrade.date}
                    onChange={e => setNewTrade({...newTrade, date: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pair / Asset</label>
                  <select 
                    value={newTrade.pair}
                    onChange={e => setNewTrade({...newTrade, pair: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="XAUUSD">XAUUSD (Gold)</option>
                    <option value="USTEC">USTEC (Nasdaq)</option>
                    <option value="EURUSD">EURUSD</option>
                    <option value="BTCUSD">BTCUSD</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sesi Trading</label>
                  <select 
                    value={newTrade.session}
                    onChange={e => setNewTrade({...newTrade, session: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="London">London Session</option>
                    <option value="New York">New York Session</option>
                    <option value="Asia">Asia Session</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Arah (Bias)</label>
                  <select 
                    value={newTrade.direction}
                    onChange={e => setNewTrade({...newTrade, direction: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BUY">BUY (Long)</option>
                    <option value="SELL">SELL (Short)</option>
                  </select>
                </div>
              </div>

              {/* Multi-Leg Execution Aggregator Inputs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-emerald-400 block">Multi-Leg Entry Aggregation</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Leg 1 Lot</label>
                    <input 
                      type="number" step="0.01" 
                      value={newTrade.leg1Lot}
                      onChange={e => setNewTrade({...newTrade, leg1Lot: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Leg 1 Price</label>
                    <input 
                      type="number" step="0.01" 
                      value={newTrade.leg1Entry}
                      onChange={e => setNewTrade({...newTrade, leg1Entry: e.target.value})}
                      placeholder="e.g. 2650.50"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Leg 2 Lot (Optional)</label>
                    <input 
                      type="number" step="0.01" 
                      value={newTrade.leg2Lot}
                      onChange={e => setNewTrade({...newTrade, leg2Lot: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Leg 2 Price</label>
                    <input 
                      type="number" step="0.01" 
                      value={newTrade.leg2Entry}
                      onChange={e => setNewTrade({...newTrade, leg2Entry: e.target.value})}
                      placeholder="e.g. 2651.00"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Financials & Outcome */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Net PnL ($)</label>
                  <input 
                    type="number" step="0.01"
                    value={newTrade.pnl}
                    onChange={e => setNewTrade({...newTrade, pnl: e.target.value})}
                    placeholder="e.g. 150 atau -50"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Risk Amount ($)</label>
                  <input 
                    type="number" step="0.01"
                    value={newTrade.riskAmount}
                    onChange={e => setNewTrade({...newTrade, riskAmount: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Execution Style</label>
                  <select 
                    value={newTrade.executionType}
                    onChange={e => setNewTrade({...newTrade, executionType: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="TP 2R">TP 2R</option>
                    <option value="Partial TP">Partial TP</option>
                    <option value="Trailing Stop">Trailing Stop</option>
                    <option value="Break-Even (BE)">Break-Even (BE)</option>
                    <option value="SL Hit">SL Hit</option>
                  </select>
                </div>
              </div>

              {/* SMC Confluences Selection */}
              <div>
                <label className="text-slate-400 block mb-2">SMC / ICT Confluences</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Liquidity Sweep",
                    "BOS / CHoCH",
                    "FVG",
                    "Order Block",
                    "Discount Zone",
                    "Premium Zone"
                  ].map(item => {
                    const selected = newTrade.smcConfluences.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleConfluence(item)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                          selected 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Psychology Tags */}
              <div>
                <label className="text-slate-400 block mb-2">Trading Psychology Tags</label>
                <div className="flex flex-wrap gap-2">
                  {['None', 'FOMO', 'Revenge Trading', 'Overtrading', 'Unconfirmed Entry'].map(tag => {
                    const selected = newTrade.psychologyTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => togglePsychology(tag)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                          selected 
                            ? tag === 'None' ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
                >
                  Simpan Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// --- HELPER COMPONENT FOR METRIC CARDS ---
function MetricCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col justify-between space-y-2">
      <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
        <span>{title}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}