import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/audit.dto';

export interface AuditRecord {
  id: string;
  time: string;
  actorName: string;
  role: string;
  category: string;
  actionDescription: string;
  meta: string;
}

@Injectable()
export class AuditService {
  private logs: AuditRecord[] = [
    {
      id: 'a-1',
      time: '11:42 AM Today',
      actorName: 'Store Owner',
      role: 'OWNER',
      category: 'FINANCIAL_EXPORT',
      actionDescription: 'Exported quarterly financial analytics and store revenue breakdown',
      meta: 'IP: 192.168.1.10 • Owner Portal',
    },
    {
      id: 'a-2',
      time: '11:15 AM Today',
      actorName: 'Senior Cashier (Terminal 01)',
      role: 'CASHIER',
      category: 'POS_CHECKOUT',
      actionDescription: 'Completed in-person split-payment checkout order #POS-1049 ($225.00)',
      meta: 'Terminal #01 • Cash & Card Split',
    },
    {
      id: 'a-3',
      time: '10:50 AM Today',
      actorName: 'Store Owner',
      role: 'OWNER',
      category: 'PRICE_UPDATE',
      actionDescription: 'Updated unit price on BPC-157 5mg Vial ($45.00 -> $48.00)',
      meta: 'Catalog Ingest • SKU: PEP-BPC-05',
    },
    {
      id: 'a-4',
      time: '10:30 AM Today',
      actorName: 'Admin System',
      role: 'ADMIN',
      category: 'THEME_SYNC',
      actionDescription: 'Synchronized live branding tokens (Deep Emerald & Neutral White)',
      meta: 'Brand Studio Broadcast',
    },
    {
      id: 'a-5',
      time: '09:20 AM Today',
      actorName: 'Store Owner',
      role: 'OWNER',
      category: 'STOCK_RESTOCK',
      actionDescription: 'Batch lot intake: +100 units Epithalon 20mg (SKU: PEP-EPI-20)',
      meta: 'Warehouse Receiving Dock #3',
    },
    {
      id: 'a-6',
      time: '09:05 AM Today',
      actorName: 'Junior Cashier (Terminal 02)',
      role: 'CASHIER',
      category: 'TICKET_VOID',
      actionDescription: 'Voided order ticket #POS-1042 due to customer item swap request',
      meta: 'Manager PIN Authorization Verified',
    },
  ];

  findAll(role?: string): AuditRecord[] {
    if (role && role !== 'ALL') {
      return this.logs.filter((l) => l.role === role);
    }
    return this.logs;
  }

  create(dto: CreateAuditLogDto): AuditRecord {
    const record: AuditRecord = {
      id: `a-${Date.now()}`,
      time: 'Just now',
      actorName: dto.actorName,
      role: dto.role,
      category: dto.category,
      actionDescription: dto.actionDescription,
      meta: dto.meta || 'System Event',
    };
    this.logs.unshift(record);
    return record;
  }
}
