export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const buildApiUrl = (path) => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
  }

  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data?.message || data?.error || fallbackMessage;
    }

    const text = await response.text();
    return text || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};