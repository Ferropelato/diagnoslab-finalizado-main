import { useState, useEffect } from 'react';

// Hook para reloj en vivo
export const useLiveClock = () => {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const pad = (n) => String(n).padStart(2, '0');
    const updateTime = () => {
      const d = new Date();
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};

// Hook para debounce
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para newsletter
export const useNewsletter = () => {
  const [newsletter, setNewsletter] = useState([]);
  const newsKey = 'dlab_news_emails';

  useEffect(() => {
    const saved = localStorage.getItem(newsKey);
    if (saved) {
      try {
        setNewsletter(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando newsletter:', e);
      }
    }
  }, []);

  const subscribe = (email) => {
    const emailLower = email.toLowerCase();
    if (newsletter.includes(emailLower)) {
      return { success: false, message: 'Este email ya está suscripto.' };
    }
    
    const updated = [...newsletter, emailLower];
    setNewsletter(updated);
    localStorage.setItem(newsKey, JSON.stringify(updated));
    return { success: true, message: '¡Gracias por suscribirte! 📧' };
  };

  return { newsletter, subscribe };
};

