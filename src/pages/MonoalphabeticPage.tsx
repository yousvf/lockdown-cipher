import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RotateCw, Shuffle } from 'lucide-react';
import { monoalphabeticEncrypt, monoalphabeticDecrypt } from '../utils/encryption';

export function MonoalphabeticPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('HELLO');
  const [key, setKey] = useState('QWERTYUIOPASDFGHJKLZXCVBNM');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputText && key) {
      const result = operation === 'encrypt'
        ? monoalphabeticEncrypt(inputText, key)
        : monoalphabeticDecrypt(inputText, key);
      setOutput(result.result);
    }
  }, [inputText, key, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>

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
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/30 mb-4">
              <RotateCw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
              Monoalphabetic Cipher
            </h1>
            <p className="text-slate-400 text-lg">
              Single substitution mapping of the entire alphabet
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
                  Substitution Key (26 letters)
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase().slice(0, 26))}
                  maxLength={26}
                  placeholder="QWERTYUIOPASDFGHJKLZXCVBNM"
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono text-lg"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-orange-500/30 rounded-xl text-orange-300 font-mono text-lg resize-none focus:outline-none"
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
            <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Substitution Map</h2>

            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                {alphabet.map((char, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg font-mono font-bold border border-slate-700 mb-1">
                      {char}
                    </div>
                    <div className="text-xs text-slate-500">↓</div>
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-300 rounded-lg font-mono font-bold border border-orange-500/30">
                      {key[i] || '?'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Each letter of the alphabet is mapped to exactly one other letter</p>
              <p>• The mapping stays the same throughout the encryption (monoalphabetic)</p>
              <p>• Vulnerable to frequency analysis - common letters become obvious</p>
              <p>• Also known as substitution cipher or simple substitution</p>
              <p>• Easy to break with enough ciphertext due to letter frequency patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
