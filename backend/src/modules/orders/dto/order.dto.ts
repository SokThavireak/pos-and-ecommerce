import { IsString, IsNotEmpty, IsArray, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderSource, OrderStatus } from '../../../database/entities/order.entity';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(OrderSource)
  source: OrderSource;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
