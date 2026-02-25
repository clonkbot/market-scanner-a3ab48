import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Asset {
  id: string;
  name: string;
  symbol: string;
  category: 'futures' | 'crypto' | 'memecoin';
  price: number;
  change24h: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  confirmations: Confirmation[];
}

interface Confirmation {
  name: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  value: string;
}

// Mock data generator
const generateMockData = (): Asset[] => {
  const assets: Asset[] = [
    // Futures
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', category: 'futures', price: 67432.50, change24h: 2.34, signal: 'bullish', strength: 78, confirmations: [] },
    { id: 'mnq', name: 'Micro Nasdaq', symbol: 'MNQ', category: 'futures', price: 18945.25, change24h: 0.87, signal: 'bullish', strength: 65, confirmations: [] },
    { id: 'mes', name: 'Micro S&P 500', symbol: 'MES', category: 'futures', price: 5312.75, change24h: 0.45, signal: 'neutral', strength: 52, confirmations: [] },
    { id: 'mgc', name: 'Micro Gold', symbol: 'MGC', category: 'futures', price: 2341.80, change24h: -0.23, signal: 'bearish', strength: 38, confirmations: [] },
    { id: 'si', name: 'Silver', symbol: 'SI', category: 'futures', price: 27.85, change24h: 1.12, signal: 'bullish', strength: 71, confirmations: [] },
    { id: 'hg', name: 'Copper', symbol: 'HG', category: 'futures', price: 4.32, change24h: -0.89, signal: 'bearish', strength: 35, confirmations: [] },
    { id: 'ng', name: 'Natural Gas', symbol: 'NG', category: 'futures', price: 2.87, change24h: 3.45, signal: 'bullish', strength: 82, confirmations: [] },
    // Memecoins
    { id: 'pepe', name: 'Pepe', symbol: 'PEPE', category: 'memecoin', price: 0.00001234, change24h: 15.67, signal: 'bullish', strength: 89, confirmations: [] },
    { id: 'wif', name: 'dogwifhat', symbol: 'WIF', category: 'memecoin', price: 2.45, change24h: -4.23, signal: 'bearish', strength: 28, confirmations: [] },
    { id: 'bonk', name: 'Bonk', symbol: 'BONK', category: 'memecoin', price: 0.00002156, change24h: 8.91, signal: 'bullish', strength: 74, confirmations: [] },
    { id: 'floki', name: 'Floki', symbol: 'FLOKI', category: 'memecoin', price: 0.000178, change24h: 5.34, signal: 'bullish', strength: 68, confirmations: [] },
    { id: 'brett', name: 'Brett', symbol: 'BRETT', category: 'memecoin', price: 0.089, change24h: 22.45, signal: 'bullish', strength: 92, confirmations: [] },
  ];

  // Add confirmations
  return assets.map(asset => ({
    ...asset,
    price: asset.price * (1 + (Math.random() - 0.5) * 0.001),
    change24h: asset.change24h + (Math.random() - 0.5) * 0.5,
    confirmations: generateConfirmations(asset.signal, asset.strength),
  }));
};

type SignalType = 'bullish' | 'bearish' | 'neutral';

const generateConfirmations = (signal: SignalType, strength: number): Confirmation[] => {
  const rsiValue = signal === 'bullish' ? 45 + Math.random() * 25 : signal === 'bearish' ? 55 + Math.random() * 25 : 45 + Math.random() * 10;
  const macdSignal: SignalType = strength > 60 ? (signal === 'bullish' ? 'bullish' : 'bearish') : 'neutral';
  const volumeSignal: SignalType = Math.random() > 0.5 ? 'bullish' : Math.random() > 0.5 ? 'bearish' : 'neutral';
  const emaSignal: SignalType = signal;
  const momentumSignal: SignalType = strength > 70 ? signal : 'neutral';

  return [
    { name: 'RSI (14)', signal: rsiValue < 30 ? 'bullish' : rsiValue > 70 ? 'bearish' : 'neutral', value: rsiValue.toFixed(1) },
    { name: 'MACD', signal: macdSignal, value: macdSignal === 'bullish' ? '+' : macdSignal === 'bearish' ? '-' : '~' },
    { name: 'Volume', signal: volumeSignal, value: volumeSignal === 'bullish' ? 'High' : volumeSignal === 'bearish' ? 'Low' : 'Avg' },
    { name: 'EMA Cross', signal: emaSignal, value: emaSignal === 'bullish' ? 'Above' : emaSignal === 'bearish' ? 'Below' : 'Near' },
    { name: 'Momentum', signal: momentumSignal, value: strength > 70 ? 'Strong' : strength > 40 ? 'Moderate' : 'Weak' },
    { name: 'Trend', signal: signal, value: signal === 'bullish' ? 'Up' : signal === 'bearish' ? 'Down' : 'Sideways' },
  ];
};

const SignalBadge = ({ signal, strength }: { signal: string; strength: number }) => {
  const colors = {
    bullish: 'from-emerald-500 to-cyan-400',
    bearish: 'from-rose-500 to-orange-400',
    neutral: 'from-slate-500 to-slate-400',
  };

  const glowColors = {
    bullish: 'shadow-emerald-500/50',
    bearish: 'shadow-rose-500/50',
    neutral: 'shadow-slate-500/50',
  };

  return (
    <motion.div
      className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-sm bg-gradient-to-r ${colors[signal as keyof typeof colors]} shadow-lg ${glowColors[signal as keyof typeof glowColors]}`}
      animate={{
        boxShadow: [
          `0 0 20px rgba(${signal === 'bullish' ? '16, 185, 129' : signal === 'bearish' ? '244, 63, 94' : '100, 116, 139'}, 0.3)`,
          `0 0 30px rgba(${signal === 'bullish' ? '16, 185, 129' : signal === 'bearish' ? '244, 63, 94' : '100, 116, 139'}, 0.6)`,
          `0 0 20px rgba(${signal === 'bullish' ? '16, 185, 129' : signal === 'bearish' ? '244, 63, 94' : '100, 116, 139'}, 0.3)`,
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="font-mono text-xs md:text-sm font-bold text-black uppercase tracking-wider">
        {signal} {strength}%
      </span>
    </motion.div>
  );
};

const ConfirmationPill = ({ confirmation }: { confirmation: Confirmation }) => {
  const bgColors = {
    bullish: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
    bearish: 'bg-rose-500/20 border-rose-500/50 text-rose-400',
    neutral: 'bg-slate-500/20 border-slate-500/50 text-slate-400',
  };

  return (
    <div className={`px-2 py-1 rounded border text-xs font-mono ${bgColors[confirmation.signal]}`}>
      <span className="opacity-70">{confirmation.name}:</span> {confirmation.value}
    </div>
  );
};

const AssetCard = ({ asset, index }: { asset: Asset; index: number }) => {
  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    if (price < 100) return price.toFixed(2);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${
        asset.signal === 'bullish' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' :
        asset.signal === 'bearish' ? 'bg-gradient-to-r from-rose-500 to-orange-500' :
        'bg-gradient-to-r from-slate-500 to-slate-400'
      }`} />

      <div className="relative bg-black/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 md:p-6 overflow-hidden">
        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 flex items-center justify-center">
              <span className="font-mono text-xs md:text-sm font-bold text-cyan-400">{asset.symbol}</span>
            </div>
            <div>
              <h3 className="font-display text-base md:text-lg font-bold text-white">{asset.name}</h3>
              <span className={`text-xs font-mono uppercase tracking-wider ${
                asset.category === 'futures' ? 'text-amber-400' :
                asset.category === 'memecoin' ? 'text-fuchsia-400' : 'text-cyan-400'
              }`}>
                {asset.category}
              </span>
            </div>
          </div>
          <SignalBadge signal={asset.signal} strength={asset.strength} />
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-2xl md:text-3xl font-bold text-white">${formatPrice(asset.price)}</span>
            <span className={`font-mono text-sm md:text-base font-semibold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Confirmations */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Confirmations</div>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {asset.confirmations.map((conf, i) => (
              <ConfirmationPill key={i} confirmation={conf} />
            ))}
          </div>
        </div>

        {/* Strength bar */}
        <div className="mt-4">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                asset.signal === 'bullish' ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' :
                asset.signal === 'bearish' ? 'bg-gradient-to-r from-rose-500 to-orange-400' :
                'bg-gradient-to-r from-slate-500 to-slate-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${asset.strength}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScanningOverlay = ({ isScanning }: { isScanning: boolean }) => (
  <AnimatePresence>
    {isScanning && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 border-4 border-cyan-500 rounded-full mx-auto mb-6"
            animate={{
              rotate: 360,
              boxShadow: [
                '0 0 20px rgba(6, 182, 212, 0.5)',
                '0 0 60px rgba(6, 182, 212, 0.8)',
                '0 0 20px rgba(6, 182, 212, 0.5)',
              ]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              boxShadow: { duration: 1, repeat: Infinity }
            }}
          >
            <motion.div
              className="w-full h-full border-4 border-transparent border-t-fuchsia-500 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
          <motion.div
            className="font-display text-2xl md:text-3xl font-bold text-cyan-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            SCANNING MARKETS...
          </motion.div>
          <div className="font-mono text-sm text-slate-500 mt-2">Analyzing signals & confirmations</div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [filter, setFilter] = useState<'all' | 'futures' | 'memecoin'>('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssets(generateMockData());
      setIsScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(generateMockData());
      setLastUpdate(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAssets(generateMockData());
      setLastUpdate(new Date());
      setIsScanning(false);
    }, 2000);
  };

  const filteredAssets = assets.filter(a => filter === 'all' || a.category === filter);
  const bullishCount = filteredAssets.filter(a => a.signal === 'bullish').length;
  const bearishCount = filteredAssets.filter(a => a.signal === 'bearish').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <ScanningOverlay isScanning={isScanning} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <motion.h1
                className="font-display text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
                style={{ textShadow: '0 0 40px rgba(6, 182, 212, 0.5)' }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400">
                  MARKET SCANNER
                </span>
              </motion.h1>
              <p className="font-mono text-xs md:text-sm text-slate-500 mt-2">
                Real-time signal detection across futures & memecoins
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="font-mono text-xs text-slate-600">
                Last scan: {lastUpdate.toLocaleTimeString()}
              </div>
              <motion.button
                onClick={handleRescan}
                disabled={isScanning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded font-mono text-sm font-bold uppercase tracking-wider text-black disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {isScanning ? 'Scanning...' : 'Rescan Markets'}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
        >
          <div className="bg-black/50 border border-slate-800 rounded-lg p-3 md:p-4">
            <div className="font-mono text-xs text-slate-500 uppercase tracking-wider">Assets</div>
            <div className="font-display text-xl md:text-2xl font-bold text-white">{filteredAssets.length}</div>
          </div>
          <div className="bg-black/50 border border-emerald-500/30 rounded-lg p-3 md:p-4">
            <div className="font-mono text-xs text-emerald-500 uppercase tracking-wider">Bullish</div>
            <div className="font-display text-xl md:text-2xl font-bold text-emerald-400">{bullishCount}</div>
          </div>
          <div className="bg-black/50 border border-rose-500/30 rounded-lg p-3 md:p-4">
            <div className="font-mono text-xs text-rose-500 uppercase tracking-wider">Bearish</div>
            <div className="font-display text-xl md:text-2xl font-bold text-rose-400">{bearishCount}</div>
          </div>
          <div className="bg-black/50 border border-slate-800 rounded-lg p-3 md:p-4">
            <div className="font-mono text-xs text-slate-500 uppercase tracking-wider">Neutral</div>
            <div className="font-display text-xl md:text-2xl font-bold text-slate-400">{filteredAssets.length - bullishCount - bearishCount}</div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {(['all', 'futures', 'memecoin'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded font-mono text-xs md:text-sm uppercase tracking-wider transition-all duration-200 min-h-[44px] ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black font-bold'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {f === 'all' ? 'All Assets' : f}
            </button>
          ))}
        </motion.div>

        {/* Asset grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredAssets.map((asset, index) => (
            <AssetCard key={asset.id} asset={asset} index={index} />
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-4 md:p-6 bg-black/50 border border-slate-800 rounded-lg"
        >
          <h3 className="font-display text-base md:text-lg font-bold text-white mb-4">Signal Confirmations Legend</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-mono text-cyan-400">RSI (14)</span>
              <span className="text-slate-500 ml-2">- Relative Strength Index. Below 30 = oversold (bullish), Above 70 = overbought (bearish)</span>
            </div>
            <div>
              <span className="font-mono text-cyan-400">MACD</span>
              <span className="text-slate-500 ml-2">- Moving Average Convergence Divergence crossover signal</span>
            </div>
            <div>
              <span className="font-mono text-cyan-400">Volume</span>
              <span className="text-slate-500 ml-2">- Trading volume relative to average. High volume confirms trend</span>
            </div>
            <div>
              <span className="font-mono text-cyan-400">EMA Cross</span>
              <span className="text-slate-500 ml-2">- Price position relative to 20/50 EMA. Above = bullish</span>
            </div>
            <div>
              <span className="font-mono text-cyan-400">Momentum</span>
              <span className="text-slate-500 ml-2">- Rate of price change. Strong momentum indicates continuation</span>
            </div>
            <div>
              <span className="font-mono text-cyan-400">Trend</span>
              <span className="text-slate-500 ml-2">- Overall directional bias based on higher timeframe analysis</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/50">
        <div className="text-center">
          <p className="font-mono text-xs text-slate-600">
            Requested by <span className="text-slate-500">@Quincy</span> · Built by <span className="text-slate-500">@clonkbot</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
