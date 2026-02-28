import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.product.findMany({
            include: { category: true },
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        return product;
    }

    async create(dto: CreateProductDto) {
        const { category_id, ...rest } = dto;
        return this.prisma.product.create({
            data: {
                ...rest,
                category: category_id ? { connect: { id: category_id } } : undefined,
            },
            include: { category: true },
        });
    }

    async update(id: string, dto: UpdateProductDto) {
        const { category_id, ...rest } = dto;
        return this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                category: category_id ? { connect: { id: category_id } } : undefined,
            },
            include: { category: true },
        });
    }

    async remove(id: string) {
        await this.prisma.product.delete({ where: { id } });
        return { deleted: true };
    }
}
