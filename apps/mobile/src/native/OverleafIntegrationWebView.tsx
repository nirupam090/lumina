import React from 'react';
import { WebView } from 'react-native-webview';

// Native React Webview explicit injection displaying LaTeX payload cleanly
export class OverleafIntegrationView {
  
  // Natively dynamically calls the exact Overleaf read-only webhook securely
  public getOverleafLaTeXHook(projectId: string, secureToken: string): string {
    // Explicitly avoids caching stale PDFs
    return `https://www.overleaf.com/read/${secureToken}?project_id=${projectId}&cache_bypass=${Date.now()}`;
  }

  // Example React Native render mapping physically
  public renderCompiledPreview(urlPayload: string) {
    return `
      <WebView 
        source={{ uri: '${urlPayload}' }}
        style={{ flex: 1, backgroundColor: '#1A1A1A' }} // Seamless Dark Mode
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    `;
  }
}
