import { defineStore } from 'pinia';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  spec?: string;
  imageUrl?: string;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'REFUND_REQUESTED' | 'REFUNDED';

export interface CustomerOrder {
  id: string;
  userEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  refundReason?: string;
  cancelReason?: string;
}

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [
      {
        id: 'ORD-9842',
        userEmail: 'customer@biolabs.com',
        customerName: 'Research Customer',
        items: [
          {
            id: 'p-1',
            name: 'Epithalon 20mg Peptide Vial',
            price: 75.0,
            quantity: 2,
            spec: '20mg Lyophilized',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'p-9',
            name: 'Precision Micro-Syringes (100pk)',
            price: 35.0,
            quantity: 1,
            spec: '100 Sterile Units',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotal: 185.0,
        tax: 14.8,
        total: 199.8,
        status: 'PENDING' as OrderStatus,
        createdAt: '15 mins ago',
        trackingNumber: 'BIO-US-8923419',
      },
      {
        id: 'ORD-9835',
        userEmail: 'customer@biolabs.com',
        customerName: 'Research Customer',
        items: [
          {
            id: 'p-2',
            name: 'BPC-157 5mg Vial',
            price: 48.0,
            quantity: 2,
            spec: '5mg Lyophilized',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'p-3',
            name: 'GHK-Cu 50mg Tripeptide',
            price: 62.0,
            quantity: 1,
            spec: '50mg Pure Copper',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotal: 158.0,
        tax: 12.64,
        total: 170.64,
        status: 'COMPLETED' as OrderStatus,
        createdAt: '2 days ago',
        trackingNumber: 'BIO-US-7712301',
      },
      {
        id: 'ORD-9820',
        userEmail: 'customer@biolabs.com',
        customerName: 'Research Customer',
        items: [
          {
            id: 'p-5',
            name: 'Structured Lab Oversized Tee',
            price: 95.0,
            quantity: 1,
            spec: '320 GSM French Terry',
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotal: 95.0,
        tax: 7.6,
        total: 102.6,
        status: 'ACCEPTED' as OrderStatus,
        createdAt: '5 days ago',
        trackingNumber: 'BIO-US-5412984',
      },
      {
        id: 'ORD-9811',
        userEmail: 'customer@biolabs.com',
        customerName: 'Research Customer',
        items: [
          {
            id: 'p-4',
            name: 'TB-500 10mg Vial',
            price: 58.0,
            quantity: 1,
            spec: '10mg Thymosin Beta-4',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotal: 58.0,
        tax: 4.64,
        total: 62.64,
        status: 'REFUNDED' as OrderStatus,
        createdAt: '2 weeks ago',
        trackingNumber: 'BIO-US-1029482',
        refundReason: 'Customer requested temperature indicator inspection return.',
      },
    ] as CustomerOrder[],
  }),

  getters: {
    getOrdersByUser: (state) => (email?: string) => {
      if (!email) return state.orders;
      return state.orders.filter(
        (o) => o.userEmail.toLowerCase() === email.toLowerCase() || o.userEmail === 'customer@biolabs.com'
      );
    },
  },

  actions: {
    createOrder(payload: {
      customerName: string;
      userEmail: string;
      items: OrderItem[];
      subtotal: number;
      tax: number;
      total: number;
    }) {
      const newOrder: CustomerOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        userEmail: payload.userEmail || 'customer@biolabs.com',
        customerName: payload.customerName || 'Customer',
        items: [...payload.items],
        subtotal: payload.subtotal,
        tax: payload.tax,
        total: payload.total,
        status: 'PENDING',
        createdAt: 'Just now',
        trackingNumber: `BIO-US-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };
      this.orders.unshift(newOrder);
      return newOrder;
    },

    cancelOrder(orderId: string, reason = 'Cancelled by customer') {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = 'CANCELLED';
        order.cancelReason = reason;
        return true;
      }
      return false;
    },

    requestRefund(orderId: string, reason: string) {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = 'REFUND_REQUESTED';
        order.refundReason = reason;
        return true;
      }
      return false;
    },
  },
});
