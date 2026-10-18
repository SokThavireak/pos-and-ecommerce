import { Controller, Post, Body } from '@nestjs/common';
import { BackupService } from './backup.service';
import { ExportDatabaseDto, RestoreDatabaseDto } from './dto/backup.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@Controller('api/backup')
@Roles(UserRole.ADMIN)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('export')
  async exportSnapshot(@Body() dto: ExportDatabaseDto) {
    return this.backupService.generateExportSnapshot(dto);
  }

  @Post('restore')
  async restoreDatabase(@Body() dto: RestoreDatabaseDto) {
    return this.backupService.restoreFromSnapshot(dto);
  }
}
