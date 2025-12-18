import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, TrendingUp } from 'lucide-react';
import { railFenceEncrypt, railFenceDecrypt } from '../utils/encryption';

export function RailFencePage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('WEAREDISCOVEREDFLEEATONCE');
  const [rails, setRails] = useState(3);
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [fenceVisualization, setFenceVisualization] = useState<string[][]>([]);

  useEffect(() => {
    if (inputText) {
      const result = operation === 'encrypt'
        ? railFenceEncrypt(inputText, rails)
        : railFenceDecrypt(inputText, rails);
      setOutput(result.result);

      const text = inputText.toUpperCase().replace(/[^A-Z]/g, '');
      const fence: string[][] = Array(rails).fill(null).map(() => []);
      let rail = 0;
      let direction = 1;

      for (const char of text) {
        fence[rail].push(char);
        if (rail === 0) direction = 1;
        else if (rail === rails - 1) direction = -1;
        rail += direction;
      }
      setFenceVisualization(fence);
    }
  }, [inputText, rails, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const text = inputText.toUpperCase().replace(/[^A-Z]/g, '');
  const positions: number[] = [];
  let rail = 0;
  let direction = 1;
  for (let i = 0; i < text.length; i++) {
    positions.push(rail);
    if (rail === 0) direction = 1;
    else if (rail === rails - 1) direction = -1;
    rail += direction;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>

      <div className="relative">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Algorithms
          </button>

          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-3">
              Rail Fence Cipher
            </h1>
            <p className="text-slate-400 text-lg">
              Zigzag transposition creating vertical fence patterns
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Input</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-300">Mode</label>
                  <div className="flex gap-2 bg-slate-800/60 p-1 rounded-lg">
                    <button
                      onClick={() => setOperation('encrypt')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        operation === 'encrypt'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Encrypt
                    </button>
                    <button
                      onClick={() => setOperation('decrypt')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        operation === 'decrypt'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Decrypt
                    </button>
                  </div>
                </div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Rails: {rails}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={rails}
                  onChange={(e) => setRails(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Text
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  placeholder="Enter text..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono text-lg"
                />
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Output</h2>

              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-emerald-300 font-mono text-lg resize-none focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-8 overflow-x-auto">
            <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Zigzag Visualization</h2>

            <div className="space-y-6">
              <div className="min-w-min">
                <div className="flex gap-2 justify-center mb-4">
                  {text.split('').map((char, i) => (
                    <div key={i} className="relative">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono font-bold border-2 transition-all duration-500 ${
                          positions[i] === 0
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 scale-110'
                            : positions[i] === rails - 1
                            ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-teal-400 scale-105'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {char}
                      </div>
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 font-mono">
                        R{positions[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center h-48 bg-slate-800/20 rounded-xl border border-slate-700/50 overflow-x-auto">
                <svg className="h-full w-full min-w-full" viewBox={`0 0 ${Math.max(text.length * 50, 100)} ${rails * 40 + 40}`}>
                  {text.split('').map((char, i) => {
                    const x = (i * 50) + 25;
                    const railSpacing = (rails > 1) ? (rails * 40) / (rails - 1) : 20;
                    const y = 20 + positions[i] * railSpacing;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill={
                            positions[i] === 0 ? '#10b981' : positions[i] === rails - 1 ? '#06b6d4' : '#94a3b8'
                          }
                          opacity="0.7"
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold fill-white"
                        >
                          {char}
                        </text>
                      </g>
                    );
                  })}
                  {text.split('').map((_, i) => {
                    if (i === text.length - 1) return null;
                    const x1 = i * 50 + 25;
                    const railSpacing = (rails > 1) ? (rails * 40) / (rails - 1) : 20;
                    const y1 = 20 + positions[i] * railSpacing;
                    const x2 = (i + 1) * 50 + 25;
                    const y2 = 20 + positions[i + 1] * railSpacing;
                    return (
                      <line
                        key={`line-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#10b981"
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {fenceVisualization.map((rail_chars, railIdx) => (
                  <div key={railIdx} className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
                    <span className="text-xs text-slate-500 mr-3">Rail {railIdx}:</span>
                    <span className="text-emerald-300 font-mono font-bold">{rail_chars.join('')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Text is written in a zigzag pattern across N horizontal rails</p>
              <p>• The pattern bounces up and down as you move left to right</p>
              <p>• To encrypt: read off each rail from top to bottom</p>
              <p>• To decrypt: reverse the process by rebuilding the zigzag pattern</p>
              <p>• More rails = stronger encryption, but requires knowing the rail count</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
