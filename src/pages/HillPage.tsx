import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Grid2X2 } from 'lucide-react';
import { hillEncrypt, hillDecrypt } from '../utils/encryption';

export function HillPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('HI');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputText) {
      const result = operation === 'encrypt' ? hillEncrypt(inputText) : hillDecrypt(inputText);
      setOutput(result.result);
    }
  }, [inputText, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const keyMatrix = [[6, 24], [1, 8]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>

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
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-2xl shadow-pink-500/30 mb-4">
              <Grid2X2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent mb-3">
              Hill Cipher
            </h1>
            <p className="text-slate-400 text-lg">
              Matrix-based encryption using linear algebra
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all font-mono text-lg"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-pink-500/30 rounded-xl text-pink-300 font-mono text-lg resize-none focus:outline-none"
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
            <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Encryption Key Matrix</h2>

            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-2 gap-4 p-6 bg-slate-800/40 rounded-xl border border-pink-500/20">
                {keyMatrix.flat().map((val, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-300 rounded-lg font-mono text-xl font-bold border border-pink-500/30 hover:from-pink-500 hover:to-rose-600 hover:text-white hover:scale-110 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-xl border border-pink-500/20">
              <h3 className="text-lg font-semibold text-pink-300 mb-4">Encryption Process</h3>
              <div className="space-y-3 text-slate-300 font-mono text-sm">
                <p>Plaintext: H = 7, I = 8</p>
                <p className="text-pink-400">Matrix multiplication modulo 26</p>
                <p>Result = (K × [7, 8]) mod 26</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Uses matrix multiplication to encrypt pairs of letters</p>
              <p>• Each plaintext block is treated as a vector and multiplied by a key matrix</p>
              <p>• Results are taken modulo 26 to stay within the alphabet</p>
              <p>• Decryption requires calculating the matrix inverse</p>
              <p>• Provides diffusion - changes in plaintext affect multiple ciphertext positions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
