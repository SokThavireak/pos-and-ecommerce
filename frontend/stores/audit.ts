import { defineStore } from 'pinia';

export type ActivityCategory =
  | 'ALL'
  | 'STOCK_RESTOCK'
  | 'PRICE_UPDATE'
  | 'POS_CHECKOUT'
  | 'USER_PROVISION'
  | 'FINANCIAL_EXPORT'
  | 'SECURITY_EVENT'
  | 'ORDER_MUTATION';

export interface AuditLogItem {
  id: string;
  actorName: string;
  role: 'OWNER' | 'ADMIN' | 'CASHIER' | 'SYSTEM';
  category: string;
  actionDescription: string;
  timeAgo: string;
  meta: string;
  severity?: 'normal' | 'notice' | 'critical';
}

export interface StockHistoryItem {
  id: string;
  time: string;
  productName: string;
  sku: string;
  type: 'RESTOCK' | 'POS_SALE' | 'WEB_ORDER' | 'ADJUSTMENT' | 'MANUAL_OVERRIDE';
  delta: number;
  user: string;
  balanceAfter: number;
}

export const useAuditStore = defineStore('audit', {
  state: () => ({
    logs: [
      {
        id: 'act-1',
        actorName: 'Store Owner',
        role: 'OWNER' as const,
        category: 'FINANCIAL_EXPORT',
        actionDescription: 'Exported monthly financial revenue ledger and sales breakdown',
        timeAgo: '18 mins ago',
        meta: 'IP: 192.168.1.10 • Owner Portal',
        severity: 'notice' as const,
      },
      {
        id: 'act-2',
        actorName: 'Sarah Chen (Terminal 01)',
        role: 'CASHIER' as const,
        category: 'POS_CHECKOUT',
        actionDescription: 'Executed barcode scan checkout order #POS-1049 ($225.00)',
        timeAgo: '32 mins ago',
        meta: 'Terminal #01 • Cash & Card Split',
        severity: 'normal' as const,
      },
      {
        id: 'act-3',
        actorName: 'Store Owner',
        role: 'OWNER' as const,
        category: 'PRICE_UPDATE',
        actionDescription: 'Adjusted unit price on BPC-157 5mg Vial ($45.00 -> $48.00)',
        timeAgo: '55 mins ago',
        meta: 'Catalog Ingest • SKU: PEP-BPC-05',
        severity: 'normal' as const,
      },
      {
        id: 'act-4',
        actorName: 'Admin Marcus',
        role: 'ADMIN' as const,
        category: 'SECURITY_EVENT',
        actionDescription: 'Synchronized live branding tokens (Deep Emerald & Neutral White)',
        timeAgo: '2 hours ago',
        meta: 'Brand Studio Broadcast',
        severity: 'notice' as const,
      },
      {
        id: 'act-5',
        actorName: 'Store Owner',
        role: 'OWNER' as const,
        category: 'STOCK_RESTOCK',
        actionDescription: 'Intake batch lot restock: +100 units Epithalon 20mg (SKU: PEP-EPI-20)',
        timeAgo: '3 hours ago',
        meta: 'Warehouse Receiving Dock #3',
        severity: 'normal' as const,
      },
      {
        id: 'act-6',
        actorName: 'Senior Cashier (Terminal 01)',
        role: 'CASHIER' as const,
        category: 'POS_CHECKOUT',
        actionDescription: 'Completed in-person split-payment checkout order #POS-1048 ($96.00)',
        timeAgo: '4 hours ago',
        meta: 'Counter 01 • Client receipt emitted',
        severity: 'normal' as const,
      },
      {
        id: 'act-7',
        actorName: 'Store Owner',
        role: 'OWNER' as const,
        category: 'USER_PROVISION',
        actionDescription: 'Provisioned role clearance and credentials for Cashier Sarah',
        timeAgo: '5 hours ago',
        meta: 'RBAC Authorization Table',
        severity: 'critical' as const,
      },
    ] as AuditLogItem[],

    stockHistory: [
      {
        id: 'sl-1',
        time: '11:42 AM Today',
        productName: 'BPC-157 5mg Vial',
        sku: 'PEP-BPC-05',
        type: 'RESTOCK' as const,
        delta: 50,
        user: 'Owner Alexander',
        balanceAfter: 85,
      },
      {
        id: 'sl-2',
        time: '11:15 AM Today',
        productName: 'Epithalon 20mg Peptide Vial',
        sku: 'PEP-EPI-20',
        type: 'POS_SALE' as const,
        delta: -2,
        user: 'Cashier Sarah',
        balanceAfter: 120,
      },
      {
        id: 'sl-3',
        time: '10:48 AM Today',
        productName: 'GHK-Cu 50mg Tripeptide',
        sku: 'PEP-GHK-50',
        type: 'WEB_ORDER' as const,
        delta: -1,
        user: 'Web Storefront',
        balanceAfter: 24,
      },
      {
        id: 'sl-4',
        time: '09:30 AM Today',
        productName: 'Structured Lab Oversized Tee',
        sku: 'APP-TEE-01',
        type: 'RESTOCK' as const,
        delta: 100,
        user: 'Owner Alexander',
        balanceAfter: 110,
      },
    ] as StockHistoryItem[],
  }),

  actions: {
    recordActivity(item: {
      actorName: string;
      role: 'OWNER' | 'ADMIN' | 'CASHIER' | 'SYSTEM';
      category?: string;
      actionDescription: string;
      meta?: string;
      severity?: 'normal' | 'notice' | 'critical';
    }) {
      this.logs.unshift({
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        actorName: item.actorName,
        role: item.role,
        category: item.category || 'OPERATION',
        actionDescription: item.actionDescription,
        timeAgo: 'Just now',
        meta: item.meta || 'System Event',
        severity: item.severity || 'normal',
      });
    },

    recordStockMovement(item: {
      productName: string;
      sku: string;
      type: 'RESTOCK' | 'POS_SALE' | 'WEB_ORDER' | 'ADJUSTMENT' | 'MANUAL_OVERRIDE';
      delta: number;
      user: string;
      balanceAfter: number;
    }) {
      this.stockHistory.unshift({
        id: `sl-${Date.now()}`,
        time: 'Just now',
        productName: item.productName,
        sku: item.sku,
        type: item.type,
        delta: item.delta,
        user: item.user,
        balanceAfter: item.balanceAfter,
      });

      // Automatically add to unified activity audit trail as well
      const actionText =
        item.delta > 0
          ? `Owner restocked +${item.delta} units of ${item.productName} (SKU: ${item.sku})`
          : `Stock adjusted by ${item.delta} units on ${item.productName} (SKU: ${item.sku})`;

      this.recordActivity({
        actorName: item.user,
        role: 'OWNER',
        category: 'STOCK_RESTOCK',
        actionDescription: actionText,
        meta: `New balance: ${item.balanceAfter} units`,
        severity: 'normal',
      });
    },

    clearLogs() {
      this.logs = [];
    },
  },
});
