import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { StoreSettings } from '../../database/entities/store-settings.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<StoreSettings> {
    return this.settingsService.getSettings();
  }

  @Patch()
  @Roles(UserRole.ADMIN)
  async updateSettings(@Body() body: Partial<StoreSettings>): Promise<StoreSettings> {
    return this.settingsService.updateSettings(body);
  }
}
