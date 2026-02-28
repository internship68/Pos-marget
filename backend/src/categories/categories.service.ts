import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateCategoryDto {
    name: string;
}

export class UpdateCategoryDto {
    name?: string;
}

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) throw new NotFoundException(`Category ${id} not found`);
        return category;
    }

    async create(dto: CreateCategoryDto) {
        return this.prisma.category.create({ data: dto });
    }

    async update(id: string, dto: UpdateCategoryDto) {
        return this.prisma.category.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.prisma.category.delete({ where: { id } });
        return { deleted: true };
    }
}
