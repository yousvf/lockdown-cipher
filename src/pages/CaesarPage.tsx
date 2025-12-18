import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RotateCw, ArrowRight } from 'lucide-react';
import { caesarEncrypt, caesarDecrypt } from '../utils/encryption';

export function CaesarPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('HELLO');
  const [shift, setShift] = useState(3);
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputText) {
      const result = operation === 'encrypt'
        ? caesarEncrypt(inputText, shift)
        : caesarDecrypt(inputText, shift);
      setOutput(result.result);
    }
  }, [inputText, shift, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>

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
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-2xl shadow-indigo-500/30 mb-4">
              <RotateCw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent mb-3">
              Caesar Cipher
            </h1>
            <p className="text-slate-400 text-lg">
              Named after Julius Caesar - the oldest known cipher
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

                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Shift: {shift}
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-lg"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-indigo-500/30 rounded-xl text-indigo-300 font-mono text-lg resize-none focus:outline-none"
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
            <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Alphabet Rotation</h2>

            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-3">Original Alphabet</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {alphabet.map((char, i) => (
                    <div key={i} className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg font-mono font-bold border border-slate-700">
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <ArrowRight className="w-6 h-6" />
                  Shift by {shift}
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-3">Shifted Alphabet</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {alphabet.map((char, i) => {
                    const shiftedIndex = (i + shift) % 26;
                    const shiftedChar = alphabet[shiftedIndex];
                    return (
                      <div key={i} className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-300 rounded-lg font-mono font-bold border border-indigo-500/30 animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
                        {shiftedChar}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 text-center">
                  <div className="text-sm text-slate-400 mb-1">Example</div>
                  <div className="text-xl font-bold text-indigo-400">H → {String.fromCharCode(((7 + shift) % 26) + 65)}</div>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 text-center">
                  <div className="text-sm text-slate-400 mb-1">Current Shift</div>
                  <div className="text-xl font-bold text-indigo-400">{shift} positions</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Each letter is shifted by a fixed number of positions</p>
              <p>• Example: with shift of 3, A→D, B→E, C→F, etc.</p>
              <p>• Z wraps around: Z→C (with shift of 3)</p>
              <p>• To decrypt: shift backwards (or shift forward by 26 - original shift)</p>
              <p>• Easy to break - only 25 possible shifts (brute force)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
