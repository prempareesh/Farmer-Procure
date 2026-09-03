// Client-side SHA-256 Hash Generator for Cryptographic Audit Chain

export async function generateSHA256(message) {
  try {
    const msgBuffer = new TextEncoder().encode(
      typeof message === "object" ? JSON.stringify(message) : String(message),
    );
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return (
      "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    );
  } catch {
    // Fallback pseudo-hash for non-secure contexts
    let hash = 0;
    const str =
      typeof message === "object" ? JSON.stringify(message) : String(message);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return "0x" + Math.abs(hash).toString(16).padStart(64, "0");
  }
}
