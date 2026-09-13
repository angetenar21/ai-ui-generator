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
      setDataState(prev => {
        const updates: Record<string, any> = {};
        for (const [key, val] of Object.entries(initialData)) {
          // STRATEGY:
          // 1. If key doesn't exist, always add it.
          // 2. If key exists but the NEW value is a complex object/array, 
          //    AI probably updated the dataset. Update it.
          // 3. If key exists and is a simple string/number, check if it changed.
          //    Avoid overwriting if AI is resetting to default value (e.g. empty string)
          //    but user has a value.

          const isComplex = val && typeof val === 'object';
          const isDefaultValue = val === '' || val === null || val === undefined;

          if (prev[key] === undefined) {
            updates[key] = val;
          } else if (isComplex) {
            // Check for structural changes
            if (JSON.stringify(prev[key]) !== JSON.stringify(val)) {
              updates[key] = val;
            }
          } else if (!isDefaultValue && prev[key] !== val) {
            // Simple value update (if not a "reset" to default)
            updates[key] = val;
          }
        }
        if (Object.keys(updates).length === 0) return prev;
        return { ...prev, ...updates };
      });
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
export const resolveVariables = (template: string, data: Record<string, any>): any => {
  if (!template || typeof template !== 'string') return template;

  let currentTemplate = template;
  let iteration = 0;
  const maxIterations = 5;

  while (iteration < maxIterations) {
    // 1. EXACT MATCH SHORT-CIRCUIT Check
    // If the entire *current* string is exactly one variable, e.g., "{subjects.Mathematics}"
    const exactMatch = currentTemplate.match(/^\{([^{}]+)\}$/);
    if (exactMatch) {
      const path = exactMatch[1];
      const keys = path.trim().replace(/\[(\w+|\d+)\]/g, '.$1').split('.').filter(Boolean);
      let value = data;
      let valid = true;
      for (const key of keys) {
        if (value === undefined || value === null) {
          valid = false;
          break;
        }

        // Resiliency Logic
        if (Array.isArray(value) && isNaN(Number(key))) {
          value = value[0];
          if (value === undefined || value === null) {
            valid = false;
            break;
          }
        } else if (typeof value === 'object' && !Array.isArray(value) && key === '0') {
          continue;
        }

        value = (value as any)[key];
      }

      if (valid && value !== undefined) {
        return value; // Return raw Object/Array/Number/String
      }
      return currentTemplate;
    }

    // 2. MIXED STRING RESOLUTION & NESTED BRACKETS
    // If not an exact match or has nested braces like "{subjects.{selected}}", we resolve the innermost braces first.
    const innermostBraces = /\{([^{}]+)\}/g;
    if (!innermostBraces.test(currentTemplate)) {
      break;
    }

    // Replace innermost brackets - this is a string replacement
    const nextTemplate = currentTemplate.replace(innermostBraces, (match, path) => {
      const cleanPath = path.trim().replace(/\[(\w+|\d+)\]/g, '.$1');
      const keys = cleanPath.split('.').filter(Boolean);

      let value = data;
      for (const key of keys) {
        if (value === undefined || value === null) return match;

        if (Array.isArray(value) && isNaN(Number(key))) {
          value = value[0];
          if (value === undefined || value === null) return match;
        } else if (typeof value === 'object' && !Array.isArray(value) && key === '0') {
          continue;
        }

        value = (value as any)[key];
      }

      return value !== undefined ? String(value) : match;
    });

    if (nextTemplate === currentTemplate) {
      break; // Stop if no changes
    }

    currentTemplate = nextTemplate;
    iteration++;
  }

  return currentTemplate;
};
