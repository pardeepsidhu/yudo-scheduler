'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context shape
interface NavigationContextType {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

// Create context with default values
const NavigationContext = createContext<NavigationContextType>({
  activeItem: 'dashboard',
  setActiveItem: () => {},
});

// Props for the provider component
interface NavigationProviderProps {
  children: ReactNode;
  defaultActiveItem?: string;
}

// Provider component
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  defaultActiveItem = 'dashboard'
}) => {
  // Simple useState hook for active item
  const [activeItem, setActiveItem] = useState<string>(defaultActiveItem);
  
  return (
    <NavigationContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigation context
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
};