import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Columns, AlertCircle } from 'lucide-react';
import { rowColumnEncrypt, rowColumnDecrypt } from '../utils/encryption';

function isValidPermutation(perm: number[]): boolean {
  if (perm.length === 0) return false;
  const sorted = [...perm].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) return false;
  }
  return true;
}

function parsePermutation(keyStr: string): number[] | null {
  const nums = keyStr.trim().split(/[\s,]+/).map(n => parseInt(n)).filter(n => !isNaN(n));
  if (isValidPermutation(nums)) {
    return nums;
  }
  return null;
}

export function RowColumnPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('SECRETMESSAGE');
  const [key, setKey] = useState('3 1 2');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [matrixViz, setMatrixViz] = useState<string[][]>([]);
  const [isValidKey, setIsValidKey] = useState(true);

  useEffect(() => {
    if (inputText && key) {
      const perm = parsePermutation(key);
      setIsValidKey(perm !== null);

      if (perm) {
        const result = operation === 'encrypt'
          ? rowColumnEncrypt(inputText, key)
          : rowColumnDecrypt(inputText, key);
        setOutput(result.result);

        let text = inputText.toUpperCase().replace(/[^A-Z]/g, '');
        const cols = perm.length;
        const rows = Math.ceil(text.length / cols);

        while (text.length < rows * cols) text += 'X';

        const matrix: string[][] = [];
        for (let i = 0; i < rows; i++) {
          matrix[i] = text.substring(i * cols, (i + 1) * cols).split('');
        }
        setMatrixViz(matrix);
      }
    }
  }, [inputText, key, operation]);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const perm = parsePermutation(key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-900/20 via-transparent to-transparent"></div>

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
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-lime-500 to-green-600 shadow-2xl shadow-lime-500/30 mb-4">
              <Columns className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent mb-3">
              Row Column Transposition
            </h1>
            <p className="text-slate-400 text-lg">
              Columnar rearrangement based on keyword alphabetical order
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
                  Permutation (e.g., 3 1 2 or 3,1,2)
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="3 1 2"
                  className={`w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-mono ${
                    isValidKey
                      ? 'border-slate-700 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20'
                      : 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                />
                {!isValidKey && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Invalid permutation. Use numbers 1 to n (e.g., 3 1 2 for 3 columns)
                  </div>
                )}
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 transition-all font-mono text-lg"
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-lime-500/30 rounded-xl text-lime-300 font-mono text-lg resize-none focus:outline-none"
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

          {perm && (
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Matrix Rearrangement</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm mb-3 text-center">Column Reading Order</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {perm.map((permIdx, displayOrder) => (
                      <div key={displayOrder} className="text-center">
                        <div className="text-xs font-mono text-slate-500 mb-1">Read {displayOrder + 1}</div>
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-lime-500/20 to-green-500/20 text-lime-300 rounded-lg font-mono font-bold border border-lime-500/30">
                          {permIdx}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400 text-xs text-center mb-4">Columns are read in this order: {perm.join(' → ')}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-3 text-center">Original Matrix</p>
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 overflow-x-auto">
                    <div className="space-y-2">
                      {matrixViz.map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-2 justify-center">
                          {row.map((char, cIdx) => {
                            const readOrder = perm.indexOf(cIdx + 1) + 1;
                            return (
                              <div
                                key={cIdx}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono font-bold border transition-all relative group ${
                                  'bg-gradient-to-br from-lime-500/20 to-green-500/20 text-lime-300 border-lime-500/30'
                                }`}
                              >
                                {char}
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Col {cIdx + 1} (Read {readOrder})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-3 text-center">Example: Columns are rearranged by reading column {perm[0]} first, then column {perm[1]}{perm.length > 2 ? `, then column ${perm[2]}` : ''}...</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">How It Works</h3>
            <div className="space-y-3 text-slate-400">
              <p>• Write plaintext in rows, with number of columns = length of permutation</p>
              <p>• The permutation specifies which column to read in each position</p>
              <p>• Read columns according to the permutation order to produce ciphertext</p>
              <p>• Example: permutation "3 1 2" means read column 3 first, then column 1, then column 2</p>
              <p>• Decryption uses the inverse permutation to reconstruct the original matrix</p>
              <p>• Valid permutations must contain each number from 1 to n exactly once</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
