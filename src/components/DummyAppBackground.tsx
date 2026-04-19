import React, { useMemo } from 'react';

type DummyVariant = 'dashboard' | 'ecommerce' | 'settings' | 'feed' | 'analytics';

interface DummyAppBackgroundProps {
  variant?: DummyVariant;
}

const DummyAppBackground: React.FC<DummyAppBackgroundProps> = ({ variant }) => {
  // Randomly select a variant if not provided, memoized to stay stable during lifetime
  const activeVariant = useMemo(() => {
    if (variant) return variant;
    const variants: DummyVariant[] = ['dashboard', 'ecommerce', 'settings', 'feed', 'analytics'];
    return variants[Math.floor(Math.random() * variants.length)];
  }, [variant]);

  return (
    <div className="absolute inset-0 bg-zinc-50 dark:bg-[#121212] pointer-events-none select-none opacity-60 flex flex-col overflow-hidden text-zinc-200">
      {activeVariant === 'dashboard' && (
        <div className="flex flex-col h-full pt-4 px-4 gap-4">
          <div className="h-10 w-full flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
          </div>
          <div className="flex gap-4 flex-1">
            <div className="hidden sm:flex flex-col gap-3 w-48 border-r border-zinc-200 dark:border-zinc-800 pr-4">
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-8 w-full mt-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="h-24 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl"></div>
                 <div className="h-24 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl"></div>
                 <div className="hidden md:block h-24 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl"></div>
              </div>
              <div className="flex-1 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                 <div className="h-5 w-1/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mb-2"></div>
                 <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-700/30 rounded-lg"></div>
                 <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-700/30 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeVariant === 'ecommerce' && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
             <div className="h-6 w-24 bg-orange-200 dark:bg-orange-900/50 rounded-full"></div>
             <div className="flex gap-4"><div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div><div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="aspect-[3/4] bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col">
              <div className="flex-1 bg-zinc-100 dark:bg-zinc-700/30 rounded-t-xl mb-2"></div>
              <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-1"></div>
              <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-3"></div>
            </div>
            <div className="aspect-[3/4] bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col">
              <div className="flex-1 bg-zinc-100 dark:bg-zinc-700/30 rounded-t-xl mb-2"></div>
              <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-1"></div>
              <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-3"></div>
            </div>
            <div className="hidden sm:flex aspect-[3/4] bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl flex-col">
              <div className="flex-1 bg-zinc-100 dark:bg-zinc-700/30 rounded-t-xl mb-2"></div>
              <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-1"></div>
              <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-3"></div>
            </div>
            <div className="hidden sm:flex aspect-[3/4] bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl flex-col">
              <div className="flex-1 bg-zinc-100 dark:bg-zinc-700/30 rounded-t-xl mb-2"></div>
              <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-1"></div>
              <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-700/50 rounded mx-3 mb-3"></div>
            </div>
          </div>
        </div>
      )}

      {activeVariant === 'settings' && (
        <div className="flex max-w-4xl w-full mx-auto h-full p-6 pt-10 gap-8">
          <div className="w-56 hidden sm:flex flex-col gap-2">
            <div className="h-6 w-32 bg-zinc-300 dark:bg-zinc-700 rounded mb-4"></div>
            <div className="h-8 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            <div className="h-8 w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg"></div>
            <div className="h-8 w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg"></div>
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-48 bg-zinc-300 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 mb-2"></div>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-zinc-800/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
               <div className="flex flex-col gap-2"><div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700/50 rounded"></div><div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700/30 rounded"></div></div>
               <div className="h-6 w-12 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-zinc-800/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
               <div className="flex flex-col gap-2"><div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700/50 rounded"></div><div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700/30 rounded"></div></div>
               <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      )}

      {activeVariant === 'feed' && (
        <div className="flex flex-col items-center w-full h-full pt-4">
          <div className="w-full max-w-lg flex flex-col gap-4">
            <div className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
              <div className="h-10 flex-1 bg-zinc-100 dark:bg-zinc-700/30 rounded-full"></div>
            </div>
            <div className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700/50"></div>
                <div className="flex flex-col gap-2"><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700/50 rounded"></div><div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-700/30 rounded"></div></div>
              </div>
              <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-700/30 rounded-xl mt-2"></div>
            </div>
          </div>
        </div>
      )}

      {activeVariant === 'analytics' && (
        <div className="flex flex-col h-full p-4 gap-4">
           <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700/80 rounded mb-2"></div>
           <div className="grid grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="bg-white dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                 <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700/50 rounded mb-4"></div>
                 <div className="h-8 w-16 bg-zinc-300 dark:bg-zinc-600 rounded"></div>
               </div>
             ))}
           </div>
           <div className="flex-1 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-end p-6 gap-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="flex-1 bg-indigo-200 dark:bg-indigo-900/40 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%`}}></div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default DummyAppBackground;
