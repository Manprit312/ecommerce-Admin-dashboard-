export const isAuthenticated = () => {
  if (typeof window === "undefined") return false; // SSR-safe
  const token = localStorage.getItem("adminToken");
  return !!token;
};
