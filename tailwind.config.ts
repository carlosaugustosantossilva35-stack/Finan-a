import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { bg: "#0a0a0a", card: "#141414", line: "#262626", gain: "#22c55e", loss: "#ef4444" } } },
} satisfies Config;
