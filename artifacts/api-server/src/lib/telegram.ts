// Telegram lead delivery now lives in the shared @workspace/leads package so
// the Express dev server and the Vercel serverless function stay in sync.
// Kept as a re-export for backward compatibility with existing imports.
export * from "@workspace/leads";
