import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class TestConnectionDto {
  /**
   * Full PostgreSQL/Neon connection URI:
   * e.g. postgresql://user:password@ep-cool-lake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   */
  @IsString()
  @IsOptional()
  connectionString?: string;

  /**
   * Neon host address (e.g. ep-cool-lake-123456.us-east-2.aws.neon.tech)
   */
  @IsString()
  @IsOptional()
  host?: string;

  /**
   * Database port (defaults to 5432)
   */
  @IsNumber()
  @IsOptional()
  port?: number;

  /**
   * Database username
   */
  @IsString()
  @IsOptional()
  user?: string;

  /**
   * Database password
   */
  @IsString()
  @IsOptional()
  password?: string;

  /**
   * Database name (e.g. neondb or pos_ecommerce_db)
   */
  @IsString()
  @IsOptional()
  database?: string;

  /**
   * SSL enabled (defaults to true for Neon)
   */
  @IsBoolean()
  @IsOptional()
  ssl?: boolean;
}

