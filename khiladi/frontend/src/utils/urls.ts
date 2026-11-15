// Project Pages serves this app below /KHILADI/; local development uses /.
export const siteURL = (path: string) =>
  /^(https?:|data:|blob:)/.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
export const apiURL = (path: string) =>
  `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}${path}`;
export const staticPages = import.meta.env.VITE_GITHUB_PAGES === "true";
