import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id/role')
    async updateRole(@Param('id') id: string, @Body('role') role: 'admin' | 'cashier') {
        if (!role || !['admin', 'cashier'].includes(role)) {
            throw new ConflictException('Invalid role name');
        }
        return this.usersService.updateRole(id, role);
    }

    @Patch(':id')
    async updateProfile(@Param('id') id: string, @Body() body: any) {
        return this.usersService.updateProfile(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.deleteProfile(id);
    }
}
