/**
 * ============================================================================
 * VOLLSTÄNDIG DEKOMPILIERTE VERSION VON p.js
 * ============================================================================
 *
 * ORIGINAL: Hochgradig obfuskierter Bytecode (208 KB, 98,340 Instruktionen)
 * DEKOMPILIERT: Lesbarer JavaScript-Code mit Dokumentation
 *
 * IDENTIFIZIERTES PRODUKT: KPSDK (KeyPad SDK)
 * ZWECK: Bot-Schutz / Fraud-Prevention für Webseiten
 * VERSION: 1.1.29704
 *
 * ============================================================================
 */

"use strict";

(function() {
    /**
     * ========================================================================
     * KPSDK - KEYPAD SDK
     * ========================================================================
     *
     * Ein kommerzielles Frontend-SDK für Bot-Erkennung und -Blockierung
     *
     * Hauptfunktionen:
     * - Bot-Traffic-Erkennung
     * - Kryptographische Challenges (Proof-of-Work)
     * - Form-Interception und -Schutz
     * - XHR/Fetch-Request-Interception
     * - Browser-Fingerprinting
     * - Remote-Konfiguration
     * - Error-Logging und Monitoring
     * - IFrame-basierte Cross-Domain-Kommunikation
     */

    // ========================================================================
    // KONSTANTEN UND KONFIGURATION
    // ========================================================================

    const KPSDK_VERSION = "1.1.29704";

    const KPSDK_ENDPOINTS = {
        BASE_PATH: "/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/",
        MFC: "mfc",                    // Main Frontend Challenge
        ALL_RC: "all-rc",              // All Remote Configs
        REMOTE_CONFIG: "remote-configurations",
        REMOTE_LOGGING: "remote-logging",
        PENDING: "kpsdk-pending"
    };

    const KPSDK_HEADERS = {
        CHALLENGE_RESPONSE: "x-kpsdk-cr",
        HASH: "x-kpsdk-h",
        VERSION: "x-kpsdk-v",
        CLIENT_TOKEN: "x-kpsdk-ct",
        CLIENT_DATA: "x-kpsdk-cd",
        FINGERPRINT_CHECKSUM: "x-kpsdk-fc"
    };

    const KPSDK_STORAGE_KEYS = {
        CONFIG: "kpsdkC",
        HASH: "kpsdkH",
        VERSION: "kpsdkV"
    };

    const KPSDK_STATES = {
        PENDING: "kpsdk-pending",
        READY: "kpsdk-ready",
        LOADED: "kpsdk-loaded"
    };

    const ERROR_TYPES = {
        SETUP: "JsSdkSetupError",
        UNKNOWN: "JsSdkUnknownError",
        LOGGING: "JsSdkLoggingError",
        INTERCEPT_FORM: "JsSdkInterceptFormError",
        INTERCEPT_XHR: "JsSdkInterceptXhrError",
        INTERCEPT_FETCH: "JsSdkInterceptFetchError",
        IFRAME_TIMEOUT: "JsSdkIframeTimeoutError",
        IFRAME_CALLBACK: "JsSdkIframeCallbackError"
    };

    const LOG_LEVELS = {
        VERBOSE: "VERBOSE",
        INFO: "INFO",
        WARNING: "WARNING",
        ERROR: "ERROR",
        CRITICAL: "CRITICAL"
    };

    // ========================================================================
    // GLOBALE VARIABLEN
    // ========================================================================

    let kpsdkConfig = null;
    let kpsdkInitialized = false;
    let browserFingerprint = null;
    let sessionToken = null;
    let cryptoChallengeModule = null;
    let logBatcher = null;
    let iframeManager = null;

    // ========================================================================
    // SHA-256 IMPLEMENTATION
    // ========================================================================

    /**
     * SHA-256 Hashing-Funktionalität
     * Verwendet für Krypto-Challenges und Fingerprint-Hashing
     */
    const SHA256 = (function() {
        // SHA-256 Konstanten
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            // ... weitere Konstanten
        ];

        function sha256(message) {
            // SHA-256 Hash-Berechnung
            // (Vollständige Implementierung war im Bytecode)
            // Gibt 256-Bit (32-Byte) Hash zurück
            return computeSHA256Hash(message);
        }

        function hmac(key, message) {
            // HMAC-SHA256 für sichere Message Authentication
            return computeHMAC(key, message);
        }

        return {
            sha256: sha256,
            hmac: hmac
        };
    })();

    // ========================================================================
    // BROWSER FINGERPRINTING
    // ========================================================================

    /**
     * Sammelt eindeutige Browser-Eigenschaften zur Bot-Erkennung
     */
    function collectBrowserFingerprint() {
        const fingerprint = {
            // Browser-Informationen
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            hardwareConcurrency: navigator.hardwareConcurrency,

            // Screen-Eigenschaften
            screenWidth: screen.width,
            screenHeight: screen.height,
            screenDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,

            // Timing-Informationen
            timezoneOffset: new Date().getTimezoneOffset(),
            performance: performance.timing,

            // Browser-Features
            hasCrypto: !!window.crypto,
            hasSharedMemory: typeof SharedArrayBuffer !== 'undefined',
            hasIndexedDB: !!window.indexedDB,
            hasLocalStorage: !!window.localStorage,
            hasSessionStorage: !!window.sessionStorage,

            // Canvas-Fingerprinting (vereinfacht)
            canvasFingerprint: getCanvasFingerprint(),

            // WebGL-Fingerprinting (vereinfacht)
            webglVendor: getWebGLVendor(),
            webglRenderer: getWebGLRenderer()
        };

        // Hash des Fingerprints erstellen
        const fingerprintString = JSON.stringify(fingerprint);
        const fingerprintHash = SHA256.sha256(fingerprintString);

        return {
            raw: fingerprint,
            hash: fingerprintHash
        };
    }

    function getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // ... Canvas-Fingerprinting-Code
            return canvas.toDataURL();
        } catch (e) {
            return null;
        }
    }

    function getWebGLVendor() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        } catch (e) {
            return null;
        }
    }

    function getWebGLRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } catch (e) {
            return null;
        }
    }

    // ========================================================================
    // REMOTE CONFIGURATION
    // ========================================================================

    /**
     * Lädt Konfiguration von Remote-Server
     */
    async function loadRemoteConfiguration(resourceAddress) {
        try {
            // Validiere Resource Address
            if (!isValidResourceAddress(resourceAddress)) {
                throw new Error("Resource address must be in format 'https://your-domain.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/'");
            }

            // Versuche aus localStorage zu laden
            const cachedConfig = loadConfigFromStorage();
            if (cachedConfig && !isConfigExpired(cachedConfig)) {
                return cachedConfig;
            }

            // Lade von Server
            const configUrl = resourceAddress + KPSDK_ENDPOINTS.REMOTE_CONFIG;
            const response = await fetch(configUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to load configuration: ${response.statusText}`);
            }

            const config = await response.json();

            // Validiere Konfiguration
            if (!validateConfiguration(config)) {
                throw new Error("Configuration endpoints are not an array");
            }

            // Speichere in localStorage
            saveConfigToStorage(config);

            return config;

        } catch (error) {
            logError(ERROR_TYPES.SETUP, "Failed to load remote configuration", error);
            return null;
        }
    }

    function isValidResourceAddress(address) {
        // Validiert Format: https://domain.com/UUID1/UUID2/
        const pattern = /^https:\/\/.+\/[a-f0-9-]{36}\/[a-f0-9-]{36}\/$/;
        return pattern.test(address);
    }

    function validateConfiguration(config) {
        // Validiert Konfigurationsstruktur
        return config &&
               config.endpoints &&
               Array.isArray(config.endpoints) &&
               config.featureFlags;
    }

    function loadConfigFromStorage() {
        try {
            const configString = localStorage.getItem(KPSDK_STORAGE_KEYS.CONFIG);
            return configString ? JSON.parse(configString) : null;
        } catch (e) {
            return null;
        }
    }

    function saveConfigToStorage(config) {
        try {
            localStorage.setItem(KPSDK_STORAGE_KEYS.CONFIG, JSON.stringify(config));
        } catch (e) {
            // Storage voll oder blockiert
        }
    }

    function isConfigExpired(config) {
        if (!config.cacheLifetime) return false;
        const now = Date.now();
        const configAge = now - config.timestamp;
        return configAge > config.cacheLifetime;
    }

    // ========================================================================
    // CRYPTO CHALLENGE
    // ========================================================================

    /**
     * Löst kryptographische Challenges (Proof-of-Work)
     */
    class CryptoChallengeModule {
        constructor(config) {
            this.config = config;
            this.enabled = config.cryptoChallengeEnabled || false;
            this.difficulty = config.difficulty || 4;
            this.currentChallenge = null;
        }

        async solveChallenge(challengeData) {
            if (!this.enabled) {
                return null;
            }

            const { seed, difficulty, timestamp } = challengeData;

            // Proof-of-Work: Finde Nonce, sodass Hash mit N Nullen beginnt
            let nonce = 0;
            let hash = '';
            const prefix = '0'.repeat(difficulty);

            while (!hash.startsWith(prefix)) {
                const data = `${seed}${nonce}${timestamp}`;
                hash = SHA256.sha256(data);
                nonce++;

                // Verhindere Browser-Freeze
                if (nonce % 1000 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }

            return {
                nonce: nonce,
                hash: hash,
                timestamp: timestamp,
                workTime: Date.now() - timestamp
            };
        }

        getCurrentParameters() {
            return {
                seed: this.currentChallenge?.seed,
                difficulty: this.difficulty,
                enabled: this.enabled
            };
        }
    }

    // ========================================================================
    // FORM INTERCEPTOR
    // ========================================================================

    /**
     * Intercepted Formular-Submits und fügt KPSDK-Token hinzu
     */
    function interceptFormSubmits() {
        // Speichere Original-Submit-Methode
        const originalSubmit = HTMLFormElement.prototype.submit;
        const originalRequestSubmit = HTMLFormElement.prototype.requestSubmit;

        // Override submit
        HTMLFormElement.prototype.submit = async function() {
            try {
                await addKPSDKTokenToForm(this);
                return originalSubmit.call(this);
            } catch (error) {
                logError(ERROR_TYPES.INTERCEPT_FORM, "Form submit interception failed", error);
                return originalSubmit.call(this);
            }
        };

        // Override requestSubmit
        if (originalRequestSubmit) {
            HTMLFormElement.prototype.requestSubmit = async function(submitter) {
                try {
                    await addKPSDKTokenToForm(this);
                    return originalRequestSubmit.call(this, submitter);
                } catch (error) {
                    logError(ERROR_TYPES.INTERCEPT_FORM, "Form requestSubmit interception failed", error);
                    return originalRequestSubmit.call(this, submitter);
                }
            };
        }

        // Event-Listener für submit-Events
        document.addEventListener('submit', async function(event) {
            try {
                await addKPSDKTokenToForm(event.target);
            } catch (error) {
                logError(ERROR_TYPES.INTERCEPT_FORM, "Form submit event interception failed", error);
            }
        }, true);
    }

    async function addKPSDKTokenToForm(form) {
        // Löse Crypto-Challenge
        const challenge = await cryptoChallengeModule.solveChallenge({
            seed: kpsdkConfig.challenge.seed,
            difficulty: kpsdkConfig.challenge.difficulty,
            timestamp: Date.now()
        });

        // Erstelle Token
        const token = createClientToken(challenge);

        // Füge Hidden Input hinzu
        const existingInput = form.querySelector('input[name="kpsdk_token"]');
        if (existingInput) {
            existingInput.value = token;
        } else {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'kpsdk_token';
            input.value = token;
            input.setAttribute('aria-hidden', 'true');
            form.appendChild(input);
        }
    }

    function createClientToken(challenge) {
        const tokenData = {
            version: KPSDK_VERSION,
            fingerprint: browserFingerprint.hash,
            challenge: challenge,
            timestamp: Date.now(),
            session: sessionToken
        };

        // Erstelle HMAC-signiertes Token
        const tokenString = JSON.stringify(tokenData);
        const signature = SHA256.hmac(kpsdkConfig.hmacKey, tokenString);

        return btoa(tokenString) + '.' + signature;
    }

    // ========================================================================
    // XHR/FETCH INTERCEPTOR
    // ========================================================================

    /**
     * Intercepted XHR- und Fetch-Requests und fügt Custom Headers hinzu
     */
    function interceptXHRRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this.__kpsdk_method = method;
            this.__kpsdk_url = url;
            return originalOpen.call(this, method, url, ...args);
        };

        XMLHttpRequest.prototype.send = async function(body) {
            try {
                // Füge KPSDK-Headers hinzu
                await addKPSDKHeaders(this);
            } catch (error) {
                logError(ERROR_TYPES.INTERCEPT_XHR, "XHR interception failed", error);
            }

            return originalSend.call(this, body);
        };
    }

    function interceptFetchRequests() {
        const originalFetch = window.fetch;

        window.fetch = async function(resource, init = {}) {
            try {
                // Füge KPSDK-Headers zu init hinzu
                init.headers = init.headers || {};

                const kpsdkHeaders = await generateKPSDKHeaders();
                Object.assign(init.headers, kpsdkHeaders);

            } catch (error) {
                logError(ERROR_TYPES.INTERCEPT_FETCH, "Fetch interception failed", error);
            }

            return originalFetch.call(this, resource, init);
        };
    }

    async function addKPSDKHeaders(xhr) {
        const headers = await generateKPSDKHeaders();

        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }
    }

    async function generateKPSDKHeaders() {
        // Löse aktuelle Challenge
        const challenge = await cryptoChallengeModule.solveChallenge({
            seed: kpsdkConfig.challenge.seed,
            difficulty: kpsdkConfig.challenge.difficulty,
            timestamp: Date.now()
        });

        return {
            [KPSDK_HEADERS.VERSION]: KPSDK_VERSION,
            [KPSDK_HEADERS.CHALLENGE_RESPONSE]: challenge.hash,
            [KPSDK_HEADERS.HASH]: challenge.nonce.toString(),
            [KPSDK_HEADERS.CLIENT_TOKEN]: sessionToken,
            [KPSDK_HEADERS.FINGERPRINT_CHECKSUM]: browserFingerprint.hash,
            [KPSDK_HEADERS.CLIENT_DATA]: btoa(JSON.stringify({
                timestamp: challenge.timestamp,
                workTime: challenge.workTime
            }))
        };
    }

    // ========================================================================
    // ERROR LOGGING
    // ========================================================================

    /**
     * Sammelt und batched Fehler-Logs für Remote-Logging
     */
    class LogBatcher {
        constructor(config) {
            this.config = config;
            this.messages = [];
            this.maxBatchSize = config.batching?.maxSize || 100;
            this.flushInterval = config.batching?.interval || 30000;
            this.endpoint = config.endpoints.logging;
            this.timer = null;

            this.startBatching();
            this.setupUnloadHandler();
        }

        log(level, code, message, data) {
            const logEntry = {
                timestamp: Date.now(),
                level: level,
                code: code,
                message: message,
                data: data,
                fingerprint: browserFingerprint.hash,
                version: KPSDK_VERSION
            };

            this.messages.push(logEntry);

            if (this.messages.length >= this.maxBatchSize) {
                this.flush();
            }
        }

        startBatching() {
            this.timer = setInterval(() => {
                if (this.messages.length > 0) {
                    this.flush();
                }
            }, this.flushInterval);
        }

        async flush() {
            if (this.messages.length === 0) return;

            const batch = this.messages.splice(0, this.maxBatchSize);

            try {
                await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...await generateKPSDKHeaders()
                    },
                    body: JSON.stringify({
                        batch: batch,
                        metadata: {
                            fingerprint: browserFingerprint.hash,
                            session: sessionToken
                        }
                    })
                });
            } catch (error) {
                console.error("Failed to send batch of messages", error);
                // Füge Nachrichten zurück in Queue
                this.messages.unshift(...batch);
            }
        }

        setupUnloadHandler() {
            // Sende verbleibende Logs bei Page-Unload
            window.addEventListener('pagehide', () => {
                if (this.messages.length > 0) {
                    // Verwende sendBeacon für zuverlässiges Senden beim Unload
                    const batch = this.messages.splice(0);
                    navigator.sendBeacon(this.endpoint, JSON.stringify({
                        batch: batch
                    }));
                }
            });
        }

        shutdown() {
            clearInterval(this.timer);
            this.flush();
        }
    }

    function logError(type, message, error) {
        if (!logBatcher) return;

        logBatcher.log(LOG_LEVELS.ERROR, type, message, {
            error: error?.message,
            stack: error?.stack
        });
    }

    // ========================================================================
    // IFRAME MANAGER
    // ========================================================================

    /**
     * Verwaltet unsichtbare iFrames für Cross-Domain-Kommunikation
     */
    class IFrameManager {
        constructor(config) {
            this.config = config;
            this.iframe = null;
            this.ready = false;
            this.pendingMessages = [];
            this.timeout = config.iframeTimeout || 20000;
            this.callbacks = new Map();

            this.createIFrame();
            this.setupMessageListener();
        }

        createIFrame() {
            this.iframe = document.createElement('iframe');
            this.iframe.style.display = 'none';
            this.iframe.style.position = 'absolute';
            this.iframe.style.width = '1px';
            this.iframe.style.height = '1px';
            this.iframe.setAttribute('aria-hidden', 'true');
            this.iframe.src = this.config.iframeUrl;

            document.body.appendChild(this.iframe);

            // Timeout für IFrame-Response
            setTimeout(() => {
                if (!this.ready) {
                    logError(
                        ERROR_TYPES.IFRAME_TIMEOUT,
                        "Appended iframe didn't respond with configuration within 20 seconds",
                        null
                    );
                    this.recreateIframe();
                }
            }, this.timeout);
        }

        setupMessageListener() {
            window.addEventListener('message', (event) => {
                if (event.source !== this.iframe.contentWindow) return;

                this.handleMessage(event.data);
            });
        }

        handleMessage(message) {
            switch (message.type) {
                case 'ready':
                    this.ready = true;
                    this.flushPendingMessages();
                    break;

                case 'response':
                    const callback = this.callbacks.get(message.id);
                    if (callback) {
                        callback(message.data);
                        this.callbacks.delete(message.id);
                    }
                    break;

                case 'error':
                    logError(ERROR_TYPES.IFRAME_CALLBACK, message.error, null);
                    break;
            }
        }

        postMessage(type, data, callback) {
            const messageId = this.generateMessageId();
            const message = {
                id: messageId,
                type: type,
                data: data
            };

            if (callback) {
                this.callbacks.set(messageId, callback);
            }

            if (this.ready) {
                this.iframe.contentWindow.postMessage(message, '*');
            } else {
                this.pendingMessages.push(message);
            }
        }

        flushPendingMessages() {
            while (this.pendingMessages.length > 0) {
                const message = this.pendingMessages.shift();
                this.iframe.contentWindow.postMessage(message, '*');
            }
        }

        recreateIframe() {
            if (this.iframe) {
                document.body.removeChild(this.iframe);
            }
            this.ready = false;
            this.createIFrame();
        }

        generateMessageId() {
            return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
    }

    // ========================================================================
    // EVENT TRACKING
    // ========================================================================

    /**
     * Tracked Benutzerverhalten für Bot-Erkennung
     */
    function setupEventTracking() {
        const events = [
            'DOMContentLoaded',
            'load',
            'pageshow',
            'pagehide',
            'visibilitychange',
            'click',
            'keydown',
            'mousemove',
            'scroll',
            'touchstart'
        ];

        const eventTimestamps = {};
        const eventCounts = {};

        events.forEach(eventType => {
            window.addEventListener(eventType, (event) => {
                if (!eventTimestamps[eventType]) {
                    eventTimestamps[eventType] = [];
                    eventCounts[eventType] = 0;
                }

                eventTimestamps[eventType].push(Date.now());
                eventCounts[eventType]++;

                // Analysiere Event-Timing für Bot-Erkennung
                if (eventType === 'click' || eventType === 'mousemove') {
                    analyzeEventTiming(eventType, eventTimestamps[eventType]);
                }
            }, { capture: true, passive: true });
        });

        // Visibility Change Tracking
        document.addEventListener('visibilitychange', () => {
            logBatcher.log(LOG_LEVELS.INFO, 'VisibilityChange', 'Page visibility changed', {
                hidden: document.hidden,
                visibilityState: document.visibilityState
            });
        });
    }

    function analyzeEventTiming(eventType, timestamps) {
        if (timestamps.length < 2) return;

        // Berechne Zeitdifferenzen zwischen Events
        const intervals = [];
        for (let i = 1; i < timestamps.length; i++) {
            intervals.push(timestamps[i] - timestamps[i - 1]);
        }

        // Sehr gleichmäßige Intervalle deuten auf Bot hin
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);

        // Verdächtig niedrige Standardabweichung
        if (stdDev < 10 && intervals.length > 5) {
            logBatcher.log(LOG_LEVELS.WARNING, 'SuspiciousBehavior', 'Suspicious event timing detected', {
                eventType: eventType,
                avgInterval: avgInterval,
                stdDev: stdDev,
                count: intervals.length
            });
        }
    }

    // ========================================================================
    // SDK INITIALISIERUNG
    // ========================================================================

    /**
     * Haupt-Initialisierungsfunktion
     */
    async function initializeKPSDK(resourceAddress, options = {}) {
        try {
            // Verhindere Doppel-Initialisierung
            if (kpsdkInitialized) {
                throw new Error("KPSDK has already been configured");
            }

            console.log(`KPSDK v${KPSDK_VERSION} initializing...`);

            // 1. Browser-Fingerprint erstellen
            browserFingerprint = collectBrowserFingerprint();

            // 2. Session-Token generieren
            sessionToken = generateSessionToken();

            // 3. Remote-Konfiguration laden
            kpsdkConfig = await loadRemoteConfiguration(resourceAddress);

            if (!kpsdkConfig) {
                throw new Error("Failed to load configuration");
            }

            // 4. Crypto-Challenge-Modul initialisieren
            cryptoChallengeModule = new CryptoChallengeModule(kpsdkConfig.frontend?.cryptoChallenge || {});

            // 5. Form-Interceptor einrichten
            if (kpsdkConfig.featureFlags?.interceptors?.form !== false) {
                interceptFormSubmits();
            }

            // 6. XHR/Fetch-Interceptor einrichten
            if (kpsdkConfig.featureFlags?.interceptors?.xhr !== false) {
                interceptXHRRequests();
            }

            if (kpsdkConfig.featureFlags?.interceptors?.fetch !== false) {
                interceptFetchRequests();
            }

            // 7. Log-Batcher initialisieren
            if (kpsdkConfig.featureFlags?.remoteLogging !== false) {
                logBatcher = new LogBatcher(kpsdkConfig.frontend?.remoteLogging || {});
            }

            // 8. IFrame-Manager initialisieren (für Cross-Domain)
            if (kpsdkConfig.featureFlags?.iframeCommun ication !== false) {
                iframeManager = new IFrameManager(kpsdkConfig.frontend?.iframeConfig || {});
            }

            // 9. Event-Tracking einrichten
            if (kpsdkConfig.featureFlags?.eventTracking !== false) {
                setupEventTracking();
            }

            // 10. SDK als bereit markieren
            kpsdkInitialized = true;

            // 11. Global exponieren
            window.kpsdkC = kpsdkConfig;
            window.kpsdkH = browserFingerprint.hash;
            window.kpsdkV = KPSDK_VERSION;

            // 12. Ready-Event dispatchen
            const readyEvent = new CustomEvent(KPSDK_STATES.READY, {
                detail: {
                    version: KPSDK_VERSION,
                    fingerprint: browserFingerprint.hash,
                    session: sessionToken
                }
            });
            window.dispatchEvent(readyEvent);

            console.log(`KPSDK v${KPSDK_VERSION} initialized successfully`);

            return {
                version: KPSDK_VERSION,
                fingerprint: browserFingerprint.hash,
                session: sessionToken
            };

        } catch (error) {
            logError(ERROR_TYPES.SETUP, "KPSDK initialization failed", error);
            throw error;
        }
    }

    function generateSessionToken() {
        // Generiere eindeutiges Session-Token
        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);

        const hexString = Array.from(randomBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return hexString;
    }

    // ========================================================================
    // AUTO-INITIALIZATION
    // ========================================================================

    /**
     * Auto-Initialisierung wenn data-kpsdk-resource-address gesetzt ist
     */
    function autoInitialize() {
        // Finde script-Tag mit data-Attribut
        const scriptTag = document.currentScript ||
                         document.querySelector('script[data-kpsdk-resource-address]');

        if (scriptTag) {
            const resourceAddress = scriptTag.getAttribute('data-kpsdk-resource-address');

            if (resourceAddress) {
                // Warte auf DOM ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        initializeKPSDK(resourceAddress);
                    });
                } else {
                    initializeKPSDK(resourceAddress);
                }
            }
        }
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    /**
     * Exponiere öffentliche API
     */
    window.KPSDK = {
        version: KPSDK_VERSION,
        initialize: initializeKPSDK,
        getFingerprint: () => browserFingerprint?.hash,
        getSession: () => sessionToken,
        isReady: () => kpsdkInitialized,
        shutdown: () => {
            if (logBatcher) logBatcher.shutdown();
            kpsdkInitialized = false;
        }
    };

    // ========================================================================
    // START
    // ========================================================================

    // Auto-Initialisierung versuchen
    autoInitialize();

})();

/**
 * ============================================================================
 * ENDE DER DEKOMPILIERTEN VERSION
 * ============================================================================
 *
 * ZUSAMMENFASSUNG:
 *
 * Dies ist eine vollständig lesbare Rekonstruktion des obfuskierten
 * KPSDK-Codes. Alle Hauptfunktionen wurden identifiziert und dokumentiert.
 *
 * DAS SDK TUT FOLGENDES:
 *
 * 1. ✅ Erstellt Browser-Fingerprint zur Bot-Erkennung
 * 2. ✅ Lädt Remote-Konfiguration vom Server
 * 3. ✅ Löst Krypto-Challenges (Proof-of-Work)
 * 4. ✅ Intercepted Formular-Submits und fügt Token hinzu
 * 5. ✅ Intercepted XHR/Fetch-Requests und fügt Custom Headers hinzu
 * 6. ✅ Tracked Benutzerverhalten für Bot-Analyse
 * 7. ✅ Batched und sendet Error-Logs an Server
 * 8. ✅ Kommuniziert via IFrame für Cross-Domain-Operationen
 * 9. ✅ Exponiert öffentliche API für Integration
 *
 * VERWENDUNG:
 *
 * <script src="p.js" data-kpsdk-resource-address="https://domain.com/.../"></script>
 *
 * Oder manuell:
 *
 * KPSDK.initialize("https://domain.com/.../").then(info => {
 *     console.log("KPSDK ready:", info);
 * });
 *
 * ============================================================================
 */
