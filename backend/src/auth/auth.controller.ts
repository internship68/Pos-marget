import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        const { email, password } = body;
        if (!email || !password) {
            throw new UnauthorizedException('Email and password required');
        }
        return this.authService.login(email, password);
    }

    @Post('logout')
    async logout() {
        return this.authService.logout();
    }

    @Get('me')
    async getMe(@Headers('authorization') authHeader: string) {
        if (!authHeader) throw new UnauthorizedException('No token provided');
        const token = authHeader.replace('Bearer ', '');
        return this.authService.getMe(token);
    }
}
