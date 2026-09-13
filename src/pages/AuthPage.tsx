import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { Sparkles, Mail, Lock, Github, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import Spinner from '../components/Spinner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setSuccess('Account created! A verification link has been sent to your email.');
        setTimeout(() => navigate('/'), 2500);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderAuth = async (provider: any) => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // Don't navigate here — let onAuthStateChanged in the auth store
      // update isAuthenticated, which will trigger the AuthRoute guard
      // in App.tsx to automatically redirect to '/'. This prevents the
      // race condition where navigate fires before the store is updated.
    } catch (err: any) {
      setError(err.message || 'Authentication with provider failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-[#FAF9F7] dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sophisticated Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-orange-400/20 dark:bg-orange-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-pink-400/20 dark:bg-pink-500/10 blur-[120px] pointer-events-none animate-pulse duration-[10000ms]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Branding */}
        <div className="flex justify-center items-center mb-10 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 dark:text-white tracking-tight">
            AI UI-UX Generator
          </h1>
        </div>

        {/* Auth Card */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-3xl border border-stone-200/60 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-stone-200/50 dark:shadow-black/40">
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-white mb-6 text-center tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>

          {/* Feedback Toasts */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl mb-6 text-center animate-fade-in flex items-center justify-center shadow-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm p-4 rounded-xl mb-6 text-center animate-fade-in relative overflow-hidden shadow-sm">
              <span className="relative z-10 font-medium">{success}</span>
              <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 translate-y-full animate-[shimmer_2s_infinite]"></div>
            </div>
          )}

          {/* Core Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-neutral-300 mb-1.5 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/50 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white rounded-xl pl-12 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm group-hover:border-stone-300 dark:group-hover:border-white/20"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-neutral-300 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/50 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white rounded-xl pl-12 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm group-hover:border-stone-300 dark:group-hover:border-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all mt-4 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 text-white" />
                  Authenticating...
                </>
              ) : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Social Auth Providers */}
          <div className="my-8 flex items-center gap-4 px-2">
            <div className="flex-1 h-px bg-stone-200 dark:bg-white/10"></div>
            <span className="text-xs font-medium text-stone-400 dark:text-neutral-500 uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleProviderAuth(googleProvider)}
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900/50 hover:bg-stone-50 dark:hover:bg-slate-800 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-white font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5 text-current opacity-80" />
              Google
            </button>
            <button 
              onClick={() => handleProviderAuth(githubProvider)}
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900/50 hover:bg-stone-50 dark:hover:bg-slate-800 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-white font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5 text-current opacity-80" />
              GitHub
            </button>
          </div>

        </div>
        
        {/* Toggle Login/Sign Up */}
        <p className="text-center text-stone-500 dark:text-neutral-400 mt-8 text-sm font-medium">
          {isLogin ? "New to AI UI-UX Generator? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 dark:text-orange-400 hover:text-pink-600 dark:hover:text-pink-400 font-bold transition-colors"
          >
            {isLogin ? 'Create one now' : 'Sign in directly'}
          </button>
        </p>

      </motion.div>
    </div>
  );
}
