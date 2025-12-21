import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Grid3X3, TrendingUp, RotateCw, Grid2X2, Key, Shuffle, Columns } from 'lucide-react';

const algorithms = [
  {
    id: 'playfair',
    name: 'Playfair Cipher',
    description: 'Classical 5x5 grid substitution using a keyword matrix',
    icon: Grid3X3,
    color: 'from-blue-500 to-cyan-600',
    bgGlow: 'blue',
  },
  {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    description: 'Zigzag transposition creating a fence-like pattern',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    bgGlow: 'emerald',
  },
  {
    id: 'monoalphabetic',
    name: 'Monoalphabetic Cipher',
    description: 'Single substitution mapping of the alphabet',
    icon: RotateCw,
    color: 'from-orange-500 to-red-600',
    bgGlow: 'orange',
  },
  {
    id: 'polyalphabetic',
    name: 'Polyalphabetic Cipher',
    description: 'Multiple substitution mappings using keywords',
    icon: Key,
    color: 'from-violet-500 to-purple-600',
    bgGlow: 'violet',
  },
  {
    id: 'hill',
    name: 'Hill Cipher',
    description: 'Matrix-based encryption using linear algebra',
    icon: Grid2X2,
    color: 'from-pink-500 to-rose-600',
    bgGlow: 'pink',
  },
  {
    id: 'otp',
    name: 'One-Time Pad',
    description: 'Theoretically unbreakable cipher with random keys',
    icon: Lock,
    color: 'from-amber-500 to-yellow-600',
    bgGlow: 'amber',
  },
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    description: 'Classic letter shifting with fixed displacement',
    icon: RotateCw,
    color: 'from-indigo-500 to-blue-600',
    bgGlow: 'indigo',
  },
  {
    id: 'rowcolumn',
    name: 'Row Column Transposition',
    description: 'Columnar rearrangement using numeric permutations',
    icon: Columns,
    color: 'from-lime-500 to-green-600',
    bgGlow: 'lime',
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <header className="text-center mb-20 pt-8">
            <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
              <div className="p-5 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 rounded-3xl shadow-2xl shadow-cyan-500/40 animate-pulse">
                <Lock className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 animate-fade-in-up">
              LOCKDOWN CIPHER
            </h1>
            <p className="text-slate-300 text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-light tracking-wide">
              Explore the most powerful classical and modern encryption algorithms through interactive visualizations
            </p>
            <div className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-fade-in-up animation-delay-400"></div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {algorithms.map((algo, index) => {
              const Icon = algo.icon;
              return (
                <button
                  key={algo.id}
                  onClick={() => navigate(`/${algo.id}`)}
                  className="group relative h-80 p-6 bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl hover:border-slate-700 transition-all duration-500 text-left overflow-hidden flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${algo.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${algo.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500 w-fit`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors line-clamp-2">
                      {algo.name}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 group-hover:text-slate-300 transition-colors">
                      {algo.description}
                    </p>

                    <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-4 transition-all mt-auto">
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className={`absolute -right-8 -bottom-8 w-40 h-40 bg-${algo.bgGlow}-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
                </button>
              );
            })}
          </div>

          <footer className="text-center mt-20 text-slate-500 text-sm animate-fade-in animation-delay-600">
            <p>Choose an algorithm to unlock the secrets of cryptography</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
