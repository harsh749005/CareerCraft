/**
 * Strips leading bullet markers (*, •, -, numbered) from each line of model output
 * so stored/displayed text shows only the point text.
 */
export function stripBulletLinesFromPolishedText(rawText: string): string[] {
  const trimmed = (rawText || "").trim();
  if (!trimmed) return [];
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const stripMarker = (line: string) =>
    line
      .replace(/^[*•\-]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .trim();
  const sourceLines = lines.length > 0 ? lines : [trimmed];
  return sourceLines.map(stripMarker).filter(Boolean);
}

export function stripBulletMarkersFromPolishedText(rawText: string): string {
  return stripBulletLinesFromPolishedText(rawText).join("\n");
}
