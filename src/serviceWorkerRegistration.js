export function registerServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA ServiceWorker registered successfully:", registration.scope);
        })
        .catch((error) => {
          console.warn("PWA ServiceWorker registration failed:", error);
        });
    });
  }
}
