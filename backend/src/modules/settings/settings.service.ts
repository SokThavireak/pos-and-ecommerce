import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreSettings } from '../../database/entities/store-settings.entity';
import { AppGateway } from '../events/app.gateway';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(StoreSettings)
    private settingsRepo: Repository<StoreSettings>,
    private appGateway: AppGateway,
  ) {}

  async getSettings(): Promise<StoreSettings> {
    const settings = await this.settingsRepo.find();
    if (!settings.length) {
      throw new NotFoundException('Settings not initialized');
    }
    return settings[0];
  }

  async updateSettings(updateDto: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated = await this.settingsRepo.save({
      ...current,
      ...updateDto,
    });

    // Real-time broadcast to all connected web clients
    this.appGateway.broadcastThemeUpdate({
      colorPrimary: updated.colorPrimary,
      colorSecondary: updated.colorSecondary,
      colorSurface: updated.colorSurface,
      logoUrl: updated.logoUrl,
      storeName: updated.storeName,
    });

    return updated;
  }
}
