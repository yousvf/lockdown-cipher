import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Lock, RefreshCw } from 'lucide-react';
import { otpEncrypt, otpDecrypt } from '../utils/encryption';

export function OtpPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('SECRET');
  const [key, setKey] = useState('');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputText) {
      if (operation === 'encrypt') {
        const result = otpEncrypt(inputText);
        setOutput(result.result);
        setKey(result.key || '');
      } else if (key) {
        const result = otpDecrypt(inputText, key);
        setOutput(result.result);
      }
    }
  }, [inputText, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyKey() {
    navigator.clipboard.writeText(key);
  }

  function generateNewKey() {
    if (inputText) {
      const result = otpEncrypt(inputText);
      setKey(result.key || '');
      setOutput(result.result);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent"></div>

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
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-2xl shadow-amber-500/30 mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-3">
              One-Time Pad
            </h1>
            <p className="text-slate-400 text-lg">
              Theoretically perfect encryption with perfect secrecy
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

              {operation === 'decrypt' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    One-Time Key
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="Enter the key..."
                    className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Text
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  placeholder="Enter text..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono text-lg"
                />
              </div>

              {operation === 'encrypt' && (
                <button
                  onClick={generateNewKey}
                  className="w-full mt-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate New Key
                </button>
              )}
            </div>

            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Output</h2>

              <div className="space-y-4">
                <div className="relative">
                  <div className="text-xs font-medium text-slate-400 mb-2">Ciphertext</div>
                  <textarea
                    value={output}
                    readOnly
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/60 border border-amber-500/30 rounded-xl text-amber-300 font-mono text-lg resize-none focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute top-8 right-3 p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  </button>
                </div>

                {operation === 'encrypt' && (
                  <div className="relative">
                    <div className="text-xs font-medium text-slate-400 mb-2">One-Time Key (keep secret!)</div>
                    <textarea
                      value={key}
                      readOnly
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-red-500/30 rounded-xl text-red-300 font-mono text-sm resize-none focus:outline-none"
                    />
                    <button
                      onClick={handleCopyKey}
                      className="absolute top-8 right-3 p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-300 mb-3">Critical Security Notes</h2>
            <div className="space-y-2 text-red-200 text-sm">
              <p>• The key must be as long as the message</p>
              <p>• The key must be truly random and never reused</p>
              <p>• The key must be kept absolutely secret</p>
              <p>• If the key is reused or discovered, the cipher is broken</p>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Generates a random key as long as the plaintext message</p>
              <p>• XORs each character with the corresponding key character</p>
              <p>• Decryption is identical to encryption (XOR is symmetric)</p>
              <p>• Proven to be theoretically unbreakable - offers perfect secrecy</p>
              <p>• Major limitation: key must be securely shared and never reused</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
