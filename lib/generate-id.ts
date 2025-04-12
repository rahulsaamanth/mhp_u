export const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // Remove hyphens from the UUID to make it 32 chars instead of 36
    return crypto.randomUUID().replace(/-/g, "")
  }

  return (
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  )
}
