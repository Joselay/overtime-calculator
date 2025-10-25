// Re-export from proxy.ts to satisfy Vercel's middleware detection
export { proxy as middleware, config } from './proxy';
