// A simple event system for cart-related events with debounce support
type CartEventCallback = () => void

class CartEventSystem {
  private listeners: CartEventCallback[] = []
  private debounceTimers: Map<CartEventCallback, NodeJS.Timeout> = new Map()
  private isNotifying = false // Flag to prevent recursive notifications

  // Register a listener for cart changes
  public subscribe(callback: CartEventCallback): () => void {
    this.listeners.push(callback)

    // Return an unsubscribe function
    return () => {
      // Clear any pending debounced calls for this listener
      if (this.debounceTimers.has(callback)) {
        clearTimeout(this.debounceTimers.get(callback))
        this.debounceTimers.delete(callback)
      }
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      )
    }
  }

  // Notify all listeners that the cart has changed
  public notifyCartChanged(debounceMs = 100): void {
    // Prevent notification loops
    if (this.isNotifying) return

    this.isNotifying = true
    setTimeout(() => (this.isNotifying = false), 50)

    this.listeners.forEach((listener) => {
      // Clear any existing timer for this listener
      if (this.debounceTimers.has(listener)) {
        clearTimeout(this.debounceTimers.get(listener))
      }

      // Set a new debounced timer
      const timerId = setTimeout(() => {
        listener()
        this.debounceTimers.delete(listener)
      }, debounceMs)

      this.debounceTimers.set(listener, timerId)
    })
  }
}

// Export a singleton instance
export const cartEvents = new CartEventSystem()
