'use client';

import React from 'react';

interface ConsoleEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string[];
  timestamp: string;
}

export default function MobileConsole() {
  const [consoleEntries, setConsoleEntries] = React.useState<ConsoleEntry[]>([]);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const originalConsole = React.useRef<{
    log: typeof console.log;
    error: typeof console.error;
    warn: typeof console.warn;
    info: typeof console.info;
  } | null>(null);

  React.useEffect(() => {
    // Original-Konsolenmethoden speichern
    originalConsole.current = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };

    // Formatierungsfunktion für verschiedene Argumenttypen
    const formatArgs = (args: any[]): string[] => {
      return args.map(arg => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return arg.toString();
          }
        }
        return arg.toString();
      });
    };

    // Konsolenfunktionen überschreiben
    console.log = function(...args) {
      if (originalConsole.current) {
        originalConsole.current.log(...args);
        const timestamp = new Date().toTimeString().split(' ')[0];
        setConsoleEntries(prev => [...prev, { type: 'log', content: formatArgs(args), timestamp }]);
      }
    };

    console.error = function(...args) {
      if (originalConsole.current) {
        originalConsole.current.error(...args);
        const timestamp = new Date().toTimeString().split(' ')[0];
        setConsoleEntries(prev => [...prev, { type: 'error', content: formatArgs(args), timestamp }]);
      }
    };

    console.warn = function(...args) {
      if (originalConsole.current) {
        originalConsole.current.warn(...args);
        const timestamp = new Date().toTimeString().split(' ')[0];
        setConsoleEntries(prev => [...prev, { type: 'warn', content: formatArgs(args), timestamp }]);
      }
    };

    console.info = function(...args) {
      if (originalConsole.current) {
        originalConsole.current.info(...args);
        const timestamp = new Date().toTimeString().split(' ')[0];
        setConsoleEntries(prev => [...prev, { type: 'info', content: formatArgs(args), timestamp }]);
      }
    };

    // Unbehandelte Fehler abfangen
    const handleError = (event: ErrorEvent) => {
      const timestamp = new Date().toTimeString().split(' ')[0];
      setConsoleEntries(prev => [...prev, { 
        type: 'error', 
        content: [`${event.message} in ${event.filename}:${event.lineno}`], 
        timestamp 
      }]);
      return false;
    };

    // Unbehandelte Promise-Rejections abfangen
    const handleRejection = (event: PromiseRejectionEvent) => {
      const timestamp = new Date().toTimeString().split(' ')[0];
      setConsoleEntries(prev => [...prev, { 
        type: 'error', 
        content: [`Unhandled Promise Rejection: ${event.reason}`], 
        timestamp 
      }]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Initialnachricht
    console.log('Mobile Debug Console geladen');

    // Cleanup beim Unmount
    return () => {
      if (originalConsole.current) {
        console.log = originalConsole.current.log;
        console.error = originalConsole.current.error;
        console.warn = originalConsole.current.warn;
        console.info = originalConsole.current.info;
      }
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Automatisches Scrollen zum neuesten Eintrag
  React.useEffect(() => {
    if (contentRef.current && !isMinimized) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [consoleEntries, isMinimized]);

  const clearConsole = () => {
    setConsoleEntries([]);
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-black/85 text-white font-mono text-xs z-[9999] border-t border-gray-600 transition-all duration-300 ${
        isMinimized ? 'h-auto' : 'max-h-[50vh]'
      } flex flex-col`}
    >
      <div className="flex justify-between items-center px-2.5 py-1.5 bg-gray-800 border-b border-gray-600">
        <h3 className="m-0 text-sm">Debug Console</h3>
        <div className="flex">
          <button 
            className="bg-gray-600 text-white border-0 px-2 py-1 ml-1.5 rounded text-xs hover:bg-gray-500"
            onClick={clearConsole}
          >
            Löschen
          </button>
          <button 
            className="bg-gray-600 text-white border-0 px-2 py-1 ml-1.5 rounded text-xs hover:bg-gray-500"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? 'Maximieren' : 'Minimieren'}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div 
          ref={contentRef}
          className="p-1.5 overflow-y-auto flex-grow max-h-[calc(50vh-30px)]"
        >
          {consoleEntries.map((entry, index) => (
            <div 
              key={index}
              className={`p-1 border-b border-gray-700 break-words whitespace-pre-wrap
                ${entry.type === 'log' ? 'text-white' : 
                  entry.type === 'error' ? 'text-red-400' : 
                  entry.type === 'warn' ? 'text-yellow-400' : 'text-blue-400'}`}
            >
              <span className="text-gray-500 mr-1.5">{entry.timestamp}</span>
              {entry.content.map((item, i) => (
                <span key={i} className="ml-1 first:ml-0">{item}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 