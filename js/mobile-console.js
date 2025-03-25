/**
 * Mobile Debug Console
 * Fängt console.log, console.error, console.warn und unbehandelte Fehler ab
 * und zeigt sie in einem div auf der Seite an.
 */
(function() {
    // DOM vollständig geladen abwarten
    document.addEventListener('DOMContentLoaded', function() {
        // Container für die Console einfügen, falls noch nicht vorhanden
        if (!document.getElementById('mobile-debug-console')) {
            createMobileConsole();
        }
        
        initConsole();
    });

    function createMobileConsole() {
        const consoleHTML = `
            <div id="mobile-debug-console">
                <div class="console-header">
                    <h3>Debug Console</h3>
                    <div class="console-actions">
                        <button id="console-clear">Löschen</button>
                        <button id="console-toggle">Minimieren</button>
                    </div>
                </div>
                <div class="console-content"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', consoleHTML);
    }

    function initConsole() {
        const consoleElement = document.getElementById('mobile-debug-console');
        const contentElement = consoleElement.querySelector('.console-content');
        const clearButton = document.getElementById('console-clear');
        const toggleButton = document.getElementById('console-toggle');
        
        // Original-Konsolenmethoden speichern
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };
        
        // Konsolenfunktionen überschreiben
        console.log = function() {
            originalConsole.log.apply(console, arguments);
            appendToConsole('log', Array.from(arguments));
        };
        
        console.error = function() {
            originalConsole.error.apply(console, arguments);
            appendToConsole('error', Array.from(arguments));
        };
        
        console.warn = function() {
            originalConsole.warn.apply(console, arguments);
            appendToConsole('warn', Array.from(arguments));
        };
        
        console.info = function() {
            originalConsole.info.apply(console, arguments);
            appendToConsole('info', Array.from(arguments));
        };
        
        // Unbehandelte Fehler abfangen
        window.addEventListener('error', function(event) {
            appendToConsole('error', [`${event.message} in ${event.filename}:${event.lineno}`]);
            return false;
        });
        
        // Unbehandelte Promise-Rejections abfangen
        window.addEventListener('unhandledrejection', function(event) {
            appendToConsole('error', [`Unhandled Promise Rejection: ${event.reason}`]);
        });
        
        // Button zum Löschen der Konsole
        clearButton.addEventListener('click', function() {
            contentElement.innerHTML = '';
        });
        
        // Button zum Ein-/Ausblenden der Konsole
        toggleButton.addEventListener('click', function() {
            consoleElement.classList.toggle('minimized');
            toggleButton.textContent = consoleElement.classList.contains('minimized') ? 'Maximieren' : 'Minimieren';
        });
        
        // Funktion zum Hinzufügen von Einträgen zur Konsole
        function appendToConsole(type, args) {
            const entry = document.createElement('div');
            entry.className = `console-entry console-${type}`;
            
            const timestamp = new Date().toTimeString().split(' ')[0];
            const timeElement = document.createElement('span');
            timeElement.className = 'console-time';
            timeElement.textContent = timestamp;
            entry.appendChild(timeElement);
            
            const content = document.createElement('span');
            content.className = 'console-message';
            
            // Formatierung verschiedener Arten von Argumenten
            args.forEach((arg, index) => {
                if (index > 0) {
                    content.appendChild(document.createTextNode(' '));
                }
                
                if (arg === null) {
                    const nullSpan = document.createElement('span');
                    nullSpan.className = 'console-null';
                    nullSpan.textContent = 'null';
                    content.appendChild(nullSpan);
                } else if (arg === undefined) {
                    const undefinedSpan = document.createElement('span');
                    undefinedSpan.className = 'console-undefined';
                    undefinedSpan.textContent = 'undefined';
                    content.appendChild(undefinedSpan);
                } else if (typeof arg === 'object') {
                    const objectSpan = document.createElement('span');
                    objectSpan.className = 'console-object';
                    try {
                        objectSpan.textContent = JSON.stringify(arg, null, 2);
                    } catch (e) {
                        objectSpan.textContent = arg.toString();
                    }
                    content.appendChild(objectSpan);
                } else {
                    content.appendChild(document.createTextNode(arg.toString()));
                }
            });
            
            entry.appendChild(content);
            contentElement.appendChild(entry);
            contentElement.scrollTop = contentElement.scrollHeight;
        }
        
        // Hallo-Nachricht anzeigen
        console.log('Mobile Debug Console geladen');
    }
})(); 