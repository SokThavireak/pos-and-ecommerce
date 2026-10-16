import { defineStore } from 'pinia';

export type UserRole = 'OWNER' | 'ADMIN' | 'CASHIER' | 'CUSTOMER' | null;

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: 'usr-owner-01',
      email: 'owner@biolabs.com',
      fullName: 'Store Owner',
      role: 'OWNER' as UserRole,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    } as AuthUser | null,
    token: 'jwt-mock-session-token' as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentRole: (state) => state.user?.role || null,
    isOwner: (state) => state.user?.role === 'OWNER',
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isCashier: (state) => state.user?.role === 'CASHIER',
    isCustomer: (state) => state.user?.role === 'CUSTOMER',

    // Access permissions
    canAccessAdmin: (state) => state.user?.role === 'OWNER',
    canAccessBrandStudio: (state) => state.user?.role === 'ADMIN', // Exclusive to ADMIN role only
    canAccessPOS: (state) => state.user?.role === 'OWNER' || state.user?.role === 'CASHIER',
  },

  actions: {
    loginAs(role: 'OWNER' | 'ADMIN' | 'CASHIER' | 'CUSTOMER') {
      const presets: Record<'OWNER' | 'ADMIN' | 'CASHIER' | 'CUSTOMER', AuthUser> = {
        OWNER: {
          id: 'usr-owner',
          email: 'owner@biolabs.com',
          fullName: 'Store Owner',
          role: 'OWNER',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        },
        ADMIN: {
          id: 'usr-admin',
          email: 'admin@biolabs.com',
          fullName: 'System Administrator',
          role: 'ADMIN',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
        CASHIER: {
          id: 'usr-cashier',
          email: 'cashier@biolabs.com',
          fullName: 'Senior Cashier',
          role: 'CASHIER',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        },
        CUSTOMER: {
          id: 'usr-customer',
          email: 'customer@biolabs.com',
          fullName: 'Research Customer',
          role: 'CUSTOMER',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        },
      };

      this.user = presets[role];
      this.token = `jwt-token-${role.toLowerCase()}`;
    },

    logout() {
      this.user = null;
      this.token = null;
    },
  },
});
