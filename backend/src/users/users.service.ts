import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.profile.findMany({
            orderBy: { full_name: 'asc' },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.profile.findUnique({
            where: { id },
        });

        if (!user) throw new NotFoundException('User profile not found');
        return user;
    }

    async updateRole(id: string, role: string) {
        const user = await this.prisma.profile.update({
            where: { id },
            data: { role },
        });

        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(id: string, profileData: any) {
        return this.prisma.profile.update({
            where: { id },
            data: profileData,
        });
    }

    async deleteProfile(id: string) {
        await this.prisma.profile.delete({
            where: { id },
        });
        return { success: true };
    }
}
