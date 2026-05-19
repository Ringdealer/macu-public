export const API_BASE = (() => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "http://127.0.0.1:8000";
  //if (host === "macuexpress.com" || host === "www.macuexpress.com") return "https://api.macuexpress.com";
  return "https://macu-platform.onrender.com"; // fallback
})();

export const CONTACT_INFO = {
  whatsapp: "34619683950", // new
  facebook: "carlosmanueltorresespinosa", // new
  email: "macucmt@gmail.com", // new
};

export const MEDIA_CDN = "https://macu-media.onrender.com"; // new
export const FALLBACK_IMAGE = `${MEDIA_CDN}/fallback.png`;  // new