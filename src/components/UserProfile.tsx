import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, Trash2, CheckCircle, AlertCircle, Edit2, X, Check, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../config/firebase';
import { updateProfile, signOut as firebaseSignOut, deleteUser, sendEmailVerification } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal States
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
        setError(null);
        setMessage(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsOpen(false);
      setShowSignOutModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      useAuthStore.getState().setUser({ ...auth.currentUser });
      setIsEditing(false);
      setMessage('Profile updated!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || deleteInput.trim().toUpperCase() !== 'DELETE') return;
    setIsLoading(true);
    try {
      await deleteUser(auth.currentUser);
      setIsOpen(false);
      setShowDeleteModal(false);
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Please sign out and sign back in to delete your account.');
        setShowDeleteModal(false);
      } else {
        setError(err.message || 'Failed to delete account');
      }
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage('Verification email sent!');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U';

  const ModalsContent = (
    <AnimatePresence>
      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSignOutModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-stone-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <LogOut className="w-8 h-8 text-stone-500 dark:text-gray-400 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Sign out of App?</h3>
            <p className="text-stone-500 dark:text-gray-400 text-sm mb-8 px-2">You will be securely logged out of your session. You can log back in at any time.</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 bg-stone-100 dark:bg-slate-800/80 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-gray-200 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSignOut}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-900/20 dark:bg-black/80 backdrop-blur-md"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteInput('');
            }}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/50 rounded-3xl p-6 shadow-2xl flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Delete Account</h3>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="bg-stone-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-stone-200 dark:border-slate-700">
              <p className="text-stone-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                You are about to permanently wipe your user profile and all generated components.
                To confirm this deletion, please type <strong className="text-stone-900 dark:text-white select-all bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-stone-200 dark:border-slate-600">DELETE</strong> below.
              </p>
              
              <input 
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-600 text-stone-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteInput('');
                }}
                className="flex-[2] bg-stone-100 dark:bg-slate-800/80 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-gray-200 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteInput.trim().toUpperCase() !== 'DELETE'}
                className="flex-[3] bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isLoading ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white font-medium shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
          aria-label="User Profile"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="font-semibold">{userInitial}</span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-72 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col z-40 origin-top-right shadow-stone-200/50 dark:shadow-black/40"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-stone-100 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white text-lg flex-shrink-0 font-bold shadow-inner">
                    {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : userInitial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-stone-900 dark:text-gray-100 truncate tracking-tight">
                      {user.displayName || 'Anonymous User'}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-gray-400 truncate">
                      {user.email || 'No email provided'}
                    </span>
                  </div>
                </div>

                {/* Email Verification Status */}
                {user.email && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {user.emailVerified ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                          <AlertCircle className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </div>
                    {!user.emailVerified && (
                      <button
                        onClick={handleResendVerification}
                        disabled={isLoading}
                        className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors disabled:opacity-50"
                      >
                        Resend
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="px-3 py-2 flex flex-col gap-1">
                {error && <div className="mx-2 mb-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg whitespace-pre-wrap">{error}</div>}
                {message && <div className="mx-2 mb-2 px-3 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg">{message}</div>}

                {/* Editing State */}
                {isEditing ? (
                  <div className="p-2 animate-fade-in">
                    <label className="text-xs font-semibold text-stone-500 dark:text-gray-400 ml-1 mb-1 block uppercase tracking-wider">Display Name</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-stone-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                        placeholder="Enter your name"
                        autoFocus
                      />
                      <button onClick={handleUpdateProfile} disabled={isLoading || !newName.trim()} className="p-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-md disabled:opacity-50 transition-all active:scale-95">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setIsEditing(false)} className="p-1.5 bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-gray-300 rounded-lg hover:bg-stone-300 dark:hover:bg-slate-600 transition-colors active:scale-95">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Edit2 className="w-4 h-4 text-stone-400 dark:text-gray-500" />
                    Change Name
                  </button>
                )}

                <div className="h-px bg-stone-100 dark:bg-slate-700/50 my-1 mx-2"></div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowDeleteModal(true);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  Delete Account
                </button>

                <div className="h-px bg-stone-100 dark:bg-slate-700/50 my-1 mx-2"></div>

                {/* Logout */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors flex items-center gap-3 mb-1"
                >
                  <LogOut className="w-4 h-4 text-stone-400 dark:text-gray-500" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {createPortal(ModalsContent, document.body)}
    </>
  );
};

export default UserProfile;
