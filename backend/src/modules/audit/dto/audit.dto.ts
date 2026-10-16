import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  @IsNotEmpty()
  actorName: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  actionDescription: string;

  @IsString()
  @IsOptional()
  meta?: string;
}
