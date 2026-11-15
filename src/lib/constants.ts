// The backend address. Set NEXT_PUBLIC_API_URL in .env for a deployed backend;
// while developing we fall back to the local FastAPI server.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
