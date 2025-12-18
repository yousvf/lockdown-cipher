import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Grid3X3, Zap } from 'lucide-react';
import { playfairEncrypt, playfairDecrypt } from '../utils/encryption';

export function PlayfairPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('HELLOWORLD');
  const [key, setKey] = useState('PLAYFAIR');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [gridDisplay, setGridDisplay] = useState<string[][]>([]);

  useEffect(() => {
    if (inputText && key) {
      const result = operation === 'encrypt'
        ? playfairEncrypt(inputText, key)
        : playfairDecrypt(inputText, key);
      setOutput(result.result);

      const grid: string[][] = [];
      const used = new Set<string>();
      const combined = key.toUpperCase().replace(/J/g, 'I') + 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

      for (const char of combined) {
        if (!used.has(char) && /[A-Z]/.test(char)) {
          used.add(char);
        }
      }

      let idx = 0;
      for (let i = 0; i < 5; i++) {
        grid[i] = [];
        for (let j = 0; j < 5; j++) {
          const chars = Array.from(used);
          grid[i][j] = chars[idx++] || 'X';
        }
      }
      setGridDisplay(grid);
    }
  }, [inputText, key, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

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
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-2xl shadow-blue-500/30 mb-4">
              <Grid3X3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-3">
              Playfair Cipher
            </h1>
            <p className="text-slate-400 text-lg">
              Classical digraph substitution using a 5x5 keyword matrix
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
                  Keyword
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  placeholder="PLAYFAIR"
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Text (pairs of letters)
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  placeholder="Enter text..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-lg"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-blue-500/30 rounded-xl text-blue-300 font-mono text-lg resize-none focus:outline-none"
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

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Key Matrix (5x5 Grid)</h2>

            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-5 gap-3">
                {gridDisplay.flat().map((char, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-lg font-mono font-bold text-lg border border-blue-500/30 hover:from-blue-500 hover:to-cyan-600 hover:text-white hover:scale-110 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-xl border border-blue-500/20 flex items-start gap-4">
              <Zap className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-300 space-y-2">
                <p className="font-semibold text-blue-300">How the matrix is created:</p>
                <p>1. Write the keyword removing duplicates and J</p>
                <p>2. Fill remaining spaces with unused letters</p>
                <p>3. Use this grid to encrypt letter pairs (digraphs)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Encrypts pairs of letters (digraphs) using a 5x5 grid</p>
              <p>• For two letters in the same row: replace with letters to their right (wrapping around)</p>
              <p>• For two letters in the same column: replace with letters below (wrapping around)</p>
              <p>• For letters in different rows and columns: form a rectangle and swap columns</p>
              <p>• Much more secure than Caesar cipher - resistant to frequency analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
