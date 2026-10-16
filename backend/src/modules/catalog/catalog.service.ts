import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { Category } from '../../database/entities/category.entity';
import { AppGateway } from '../events/app.gateway';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private appGateway: AppGateway,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.find({ relations: ['products'] });
  }

  async createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
    const category = this.categoryRepo.create({
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
    });
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: string, data: { name?: string; slug?: string; description?: string }): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    if (data.name) category.name = data.name;
    if (data.slug) category.slug = data.slug;
    if (data.description !== undefined) category.description = data.description;
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }

  async getProducts(categoryId?: string, search?: string): Promise<Product[]> {
    const qb = this.productRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .where('p.isActive = :active', { active: true });

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (search) {
      qb.andWhere('(LOWER(p.name) LIKE :s OR LOWER(p.sku) LIKE :s OR p.barcode LIKE :s)', {
        s: `%${search.toLowerCase()}%`,
      });
    }

    return qb.getMany();
  }

  async updateStock(id: string, delta: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.stock += delta;
    if (product.stock < 0) product.stock = 0;
    const saved = await this.productRepo.save(product);
    this.appGateway.broadcastInventoryUpdate({
      productId: saved.id,
      newStock: saved.stock,
    });
    return saved;
  }
}
