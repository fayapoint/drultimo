export function excerptFromMarkdown(md: string, max = 150): string {
  // Remove code fences
  let text = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    // Remove images/links markup
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => m.replace(/\[[^\]]*\]\([^)]*\)/g, " "))
    // Remove headings, emphasis and other markdown
    .replace(/^#+\s+/gm, "")
    .replace(/[>*_#~`]+/g, " ")
    // Collapse spaces
    .replace(/\s+/g, " ")
    .trim();
  if (text.length > max) {
    text = text.slice(0, max).trimEnd() + "…";
  }
  return text;
}
