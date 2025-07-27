// Global type definitions for browser APIs
declare global {
  interface Window {
    mockSupabase?: boolean;
  }
  
  // HTML Element types
  interface HTMLButtonElement {}
  interface HTMLFormElement {}
  interface HTMLInputElement {}
  interface HTMLDivElement {}
  interface HTMLCanvasElement {}
  interface SVGSVGElement {}
  
  // Browser APIs
  const console: Console;
  const alert: (message: string) => void;
  const confirm: (message: string) => boolean;
  const window: Window;
  const document: Document;
  const localStorage: Storage;
  const setTimeout: (callback: (...args: any[]) => void, delay: number) => number;
  const clearTimeout: (id: number) => void;
  const setInterval: (callback: (...args: any[]) => void, delay: number) => number;
  const clearInterval: (id: number) => void;
  
  // Jest types for testing
  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void) => void;
  const expect: any;
  const jest: any;
}

export {}; 