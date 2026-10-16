import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ExportDatabaseDto {
  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RestoreDatabaseDto {
  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @IsString()
  @IsNotEmpty()
  snapshotPayload: string; // JSON snapshot containing entities data

  @IsString()
  @IsOptional()
  reason?: string;
}
