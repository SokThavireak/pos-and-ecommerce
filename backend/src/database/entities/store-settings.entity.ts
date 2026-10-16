import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('store_settings')
export class StoreSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'biolabs' })
  storeName: string;

  @Column({ default: '/logo.svg' })
  logoUrl: string;

  @Column({ default: '#d97757' }) // Editorial warm terracotta tone
  colorPrimary: string;

  @Column({ default: '#8b5cf6' }) // Accent violet for bento tiles and badges
  colorSecondary: string;

  @Column({ default: '#fdf2ee' }) // Tinted warm editorial surface background
  colorSurface: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
