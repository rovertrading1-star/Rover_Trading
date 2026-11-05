import React, { useEffect, useRef, useState } from 'react';

// 24 Candlestick tuples: [open, high, low, close]
const INITIAL_CANDLES: [number, number, number, number][] = [
  [88, 99, 83, 96],
  [96, 104, 90, 92],
  [92, 99, 78, 84],
  [84, 90, 72, 77],
  [77, 95, 73, 90],
  [90, 102, 82, 97],
  [97, 111, 91, 103],
  [103, 108, 89, 94],
  [94, 107, 90, 102],
  [102, 118, 98, 114],
  [114, 124, 106, 111],
  [111, 119, 101, 105],
  [105, 113, 95, 99],
  [99, 116, 96, 111],
  [111, 127, 107, 121],
  [121, 130, 109, 115],
  [115, 133, 112, 128],
  [128, 139, 120, 135],
  [135, 141, 124, 129],
  [129, 145, 126, 141],
  [141, 152, 134, 149],
  [149, 155, 136, 143],
  [143, 158, 139, 153],
  [153, 166, 146, 161],
];

export const CandleChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candles, setCandles] = useState(INITIAL_CANDLES);
  const [hoverData, setHoverData] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
  } | null>(null);

  // Subtle real-time tick on the last candle to bring the lab to life!
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = [...prev[prev.length - 1]] as [number, number, number, number];
        const delta = (Math.random() - 0.48) * 1.8;
        const newClose = Math.round((last[3] + delta) * 10) / 10;
        const newHigh = Math.max(last[1], newClose);
        const newLow = Math.min(last[2], newClose);
        const next = [...prev];
        next[next.length - 1] = [last[0], newHigh, newLow, newClose];
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, box.width, box.height);

    const w = box.width;
    const h = box.height;
    const l = 24,
      r = 24,
      t = 20,
      b = 24;
    const pw = w - l - r;
    const ph = h - t - b;

    // Grid lines
    ctx.strokeStyle = '#1e2b25';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = t + (i * ph) / 4;
      ctx.beginPath();
      ctx.moveTo(l, y);
      ctx.lineTo(w - r, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const x = l + (i * pw) / 6;
      ctx.beginPath();
      ctx.moveTo(x, t);
      ctx.lineTo(x, h - b);
      ctx.stroke();
    }

    const all = candles.flat();
    const min = Math.min(...all) - 10;
    const max = Math.max(...all) + 10;
    const mapY = (v: number) => t + ((max - v) / (max - min)) * ph;

    const step = pw / candles.length;
    const cw = Math.max(4, Math.min(12, step * 0.6));

    candles.forEach((c, i) => {
      const [o, hi, lo, cl] = c;
      const x = l + i * step + step / 2;
      const isBullish = cl >= o;
      const color = isBullish ? '#b4fc78' : '#ff7777';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, mapY(hi));
      ctx.lineTo(x, mapY(lo));
      ctx.stroke();

      // Body
      const topY = Math.min(mapY(o), mapY(cl));
      const bodyH = Math.max(2, Math.abs(mapY(cl) - mapY(o)));
      ctx.fillRect(x - cw / 2, topY, cw, bodyH);
    });

    // Last price dotted reference line
    const lastClose = candles[candles.length - 1][3];
    const ly = mapY(lastClose);
    ctx.strokeStyle = 'rgba(180, 252, 120, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(l, ly);
    ctx.lineTo(w - r, ly);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price badge on right axis
    ctx.fillStyle = '#b4fc78';
    ctx.font = '10px monospace';
    ctx.fillText(`${lastClose.toFixed(1)}`, w - r + 3, ly + 3);
  };

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [candles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 24;
    const pw = rect.width - 48;
    const idx = Math.floor((x / pw) * candles.length);
    if (idx >= 0 && idx < candles.length) {
      const [o, h, l, c] = candles[idx];
      setHoverData({ open: o, high: h, low: l, close: c });
    }
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  const currentCandle = hoverData || {
    open: candles[candles.length - 1][0],
    high: candles[candles.length - 1][1],
    low: candles[candles.length - 1][2],
    close: candles[candles.length - 1][3],
  };

  return (
    <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#27342e] mb-4">
        <div>
          <div className="text-xs uppercase font-extrabold tracking-widest text-[#b4fc78]">
            PRICE ACTION LAB
          </div>
          <div className="text-xs text-[#94a69a]">Educational candlestick illustration</div>
        </div>
        <div className="text-[10px] font-bold px-2 py-1 bg-[#173d28] text-[#b4fc78] rounded border border-[#27342e] tracking-wider">
          SIMULATED
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 text-xs">
        <div>
          <strong className="block text-sm text-[#f6faf7] font-semibold">Market Structure</strong>
          <span className="text-[#94a69a] text-[11px]">Learn how to interpret price movements</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#94a69a]">
          <span>O: <span className="text-white">{currentCandle.open}</span></span>
          <span>H: <span className="text-white">{currentCandle.high}</span></span>
          <span>L: <span className="text-white">{currentCandle.low}</span></span>
          <span>C: <span className={currentCandle.close >= currentCandle.open ? 'text-[#b4fc78]' : 'text-[#ff7777]'}>{currentCandle.close}</span></span>
        </div>
      </div>

      <div className="relative w-full h-[220px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair block"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e2b25] flex justify-between items-center text-[10px] font-semibold tracking-wider text-[#94a69a] uppercase">
        <span>TECHNICAL ANALYSIS</span>
        <span className="hidden sm:inline">CANDLESTICK STRUCTURE</span>
        <span className="text-[#b4fc78]">EDUCATION MODE</span>
      </div>
    </div>
  );
};
