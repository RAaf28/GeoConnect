import { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';

/**
 * Custom hook for managing WebView maps with common functionality
 * @param {Object} options - Configuration options
 * @param {Function} options.getHtmlContent - Function that returns HTML string for WebView
 * @param {Function} options.onMessage - Handler for messages from WebView
 * @param {boolean} options.isDark - Whether dark mode is enabled
 * @param {Function} options.onError - Optional error handler
 * @returns {Object} Object containing WebView props and ref
 */
export const useWebViewMap = ({
  getHtmlContent,
  onMessage,
  isDark,
  onError
}) => {
  const webViewRef = useRef(null);

  // Handle theme changes and cleanup
  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);

    // Cleanup function to prevent memory leaks
    return () => {
      if (webViewRef.current) {
        webViewRef.current?.injectJavaScript(`
          // Cleanup map resources if they exist
          if (typeof markersLayer !== 'undefined' && markersLayer) {
            markersLayer.clearLayers();
          }
          if (typeof map !== 'undefined' && map) {
            map.remove();
          }
          true;
        `);
      }
    };
  }, [isDark]);

  const webViewProps = {
    ref: webViewRef,
    source: { html: getHtmlContent(isDark) },
    style: { flex: 1, backgroundColor: 'transparent' },
    originWhitelist: ['*'],
    javaScriptEnabled: true,
    domStorageEnabled: true,
    onMessage,
    onError: onError || (error => {
      console.warn('[WebViewMap] WebView error:', error);
    })
  };

  return { webViewRef, webViewProps };
};