import { Controller, Get, Post, Query, Patch, Delete, Param, Body } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@Controller('api/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  async getCategories() {
    return this.catalogService.getCategories();
  }

  @Post('categories')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalogService.createCategory(dto);
  }

  @Patch('categories/:id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.catalogService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async deleteCategory(@Param('id') id: string) {
    await this.catalogService.deleteCategory(id);
    return { success: true };
  }

  @Get('products')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.catalogService.getProducts(categoryId, search);
  }

  @Patch('products/:id/stock')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.CASHIER)
  async updateStock(
    @Param('id') id: string,
    @Body('delta') delta: number,
  ) {
    return this.catalogService.updateStock(id, Number(delta) || 0);
  }
}
