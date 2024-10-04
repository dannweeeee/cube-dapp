// use NODE_ENV to not have to change config based on where it's deployed
export const PUBLIC_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://cube.vercel.app";

// ENVIRONMENT VARIABLES
export const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;
export const CDP_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY;
export const CDP_API_SECRET = process.env.NEXT_PUBLIC_CDP_API_SECRET;
export const CDP_ONCHAINKIT_API_KEY =
  process.env.NEXT_PUBLIC_CDP_ONCHAINKIT_API_KEY;
export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
