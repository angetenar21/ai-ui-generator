import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Trash2, CheckCircle, AlertCircle, Edit2, X, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../config/firebase';
import { updateProfile, signOut as firebaseSignOut, deleteUser, sendEmailVerification } from 'firebase/auth';

const UserProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
        setIsDeleting(false);
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
      // Force store refresh
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
    if (!auth.currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteUser(auth.currentUser);
      // The auth observer will catch the deletion and update the Zustand store, redirecting automatically.
      setIsOpen(false);
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Please sign out and sign back in to delete your account.');
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-medium shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
        aria-label="User Profile"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          userInitial
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col z-50 animate-fade-in-up origin-top-right">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : userInitial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.displayName || 'Anonymous User'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || 'No email provided'}
                </span>
              </div>
            </div>

            {/* Email Verification Status */}
            {user.email && (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {user.emailVerified ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </div>
                {!user.emailVerified && (
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
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
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1 mb-1 block">Display Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <button onClick={handleUpdateProfile} disabled={isLoading || !newName.trim()} className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3"
              >
                <Edit2 className="w-4 h-4 text-gray-400" />
                Change Name
              </button>
            )}

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2"></div>

            {/* Deletion State */}
            {isDeleting ? (
              <div className="p-2 animate-fade-in bg-red-50 dark:bg-red-900/10 rounded-xl my-1 border border-red-100 dark:border-red-900/30">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-3">
                  Are you absolutely sure? This will permanently delete your account and all data.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Delete Forever
                  </button>
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsDeleting(true)}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete Account
              </button>
            )}

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2"></div>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3 mb-1"
            >
              <LogOut className="w-4 h-4 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
