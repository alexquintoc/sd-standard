export function isSafePublicAttachmentHref(value: string): boolean {
  const href = value.trim();
  if (!href || href.startsWith("//") || href.includes("\\")) return false;
  if (href.startsWith("/")) return !href.startsWith("//");
  if (!href.includes(":") && !href.startsWith(".") && !href.startsWith("#") && !href.startsWith("?")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
