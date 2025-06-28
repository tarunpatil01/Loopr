import { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message, type = 'info', duration = 5000) => {
    const id = new Date().getTime() + Math.random().toString(36).substring(2, 9);
    
    setAlerts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => removeAlert(id), duration);
    }
    
    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    showSuccess: (message, duration) => addAlert(message, 'success', duration),
    showError: (message, duration) => addAlert(message, 'error', duration),
    showInfo: (message, duration) => addAlert(message, 'info', duration),
    showWarning: (message, duration) => addAlert(message, 'warning', duration),
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;
