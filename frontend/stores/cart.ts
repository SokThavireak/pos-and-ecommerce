import { defineStore } from 'pinia';

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  spec?: string;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    discountPercent: 0,
    customerName: 'Walk-in Customer',
  }),

  getters: {
    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    discountAmount(): number {
      return (this.subtotal * this.discountPercent) / 100;
    },
    total(): number {
      return Math.max(0, this.subtotal - this.discountAmount);
    },
    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    addItem(product: {
      id: string;
      name: string;
      price: number;
      sku?: string;
      imageUrl?: string;
      spec?: string;
      quantity?: number;
    }) {
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          sku: product.sku || `SKU-${product.id}`,
          price: Number(product.price) || 0,
          quantity: product.quantity || 1,
          imageUrl: product.imageUrl || '',
          spec: product.spec || '',
        });
      }
    },
    decreaseItem(id: string) {
      const idx = this.items.findIndex((item) => item.id === id);
      if (idx !== -1) {
        if (this.items[idx].quantity > 1) {
          this.items[idx].quantity -= 1;
        } else {
          this.items.splice(idx, 1);
        }
      }
    },
    removeItem(id: string) {
      this.items = this.items.filter((item) => item.id !== id);
    },
    clearCart() {
      this.items = [];
      this.discountPercent = 0;
    },
    setDiscount(percent: number) {
      this.discountPercent = percent;
    },
  },
});
