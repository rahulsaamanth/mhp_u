// A simple event system for cart-related events
type CartEventCallback = () => void

class CartEventSystem {
  private listeners: CartEventCallback[] = []

  // Register a listener for cart changes
  public subscribe(callback: CartEventCallback): () => void {
    this.listeners.push(callback)

    // Return an unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      )
    }
  }

  // Notify all listeners that the cart has changed
  public notifyCartChanged(): void {
    this.listeners.forEach((listener) => listener())
  }
}

// Export a singleton instance
export const cartEvents = new CartEventSystem()
