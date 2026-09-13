// Thrown deliberately by application code for errors that are safe to show
// a customer verbatim (e.g. "Transfers must be at least 2 AED" from Ziina).
// handleError() only forwards messages from this type - anything else stays
// a generic "Internal server error" so internal/DB errors never leak.
export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
