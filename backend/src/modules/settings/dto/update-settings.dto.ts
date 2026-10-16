import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  primaryColor: string;

  @IsString()
  @IsNotEmpty()
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  surfaceColor: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
