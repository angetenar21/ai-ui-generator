import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface DataContextType {
  data: Record<string, any>;
  setData: (key: string, value: any) => void;
  setMultiple: (updates: Record<string, any>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  initialData?: Record<string, any>;
  children: React.ReactNode;
  onDataChange?: (data: Record<string, any>) => void;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  initialData = {},
  children,
  onDataChange
}) => {
  const [data, setDataState] = useState<Record<string, any>>(initialData);

  // Update local state when initialData changes (e.g. from parent re-render)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDataState(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Notify parent of changes (optional, for debugging or persistence)
  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  const setData = useCallback((key: string, value: any) => {
    setDataState(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMultiple = useCallback((updates: Record<string, any>) => {
    setDataState(prev => ({ ...prev, ...updates }));
  }, []);

  const value = {
    data,
    setData,
    setMultiple
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    // Return a dummy implementation if used outside a provider
    // This allows components to render safely even if not wrapped
    return {
      data: {},
      setData: () => console.warn('useData: No DataProvider found'),
      setMultiple: () => console.warn('useData: No DataProvider found')
    };
  }
  return context;
};

/**
 * Helper to resolve variables in a string template
 * e.g. "Hello {user.name}" -> "Hello John"
 * Supports nested keys: "Teacher: {subjects.{selectedSubject}[0].teacher}"
 */
export const resolveVariables = (template: string, data: Record<string, any>): string => {
  if (!template || typeof template !== 'string') return template;

  let result = template;
  const maxIterations = 5; // Prevent infinite loops
  let iteration = 0;

  // Regex to find the innermost {variable}
  // It looks for { followed by anything that doesn't contain { or } followed by }
  const variableRegex = /\{([^{}]+)\}/g;

  // console.log('[resolveVariables] Input:', template);
  // console.log('[resolveVariables] Data keys:', Object.keys(data || {}));

  while (variableRegex.test(result) && iteration < maxIterations) {
    result = result.replace(variableRegex, (match, path) => {
      // console.log('[resolveVariables] Match:', match, 'Path:', path);

      // Remove any array brackets for splitting, but keep index logic
      // e.g. "subjects.Math[0].teacher" -> ["subjects", "Math", "0", "teacher"]
      const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');

      let value = data;
      for (const key of keys) {
        if (value === undefined || value === null) return match;
        value = value[key];
      }

      return value !== undefined ? String(value) : match;
    });
    iteration++;
  }

  return result;
};
