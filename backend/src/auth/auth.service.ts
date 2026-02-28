import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
    constructor(private readonly supabaseService: SupabaseService) { }

    private get client() {
        return this.supabaseService.getClient();
    }

    async login(email: string, pass: string) {
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (error) {
            throw new UnauthorizedException(error.message);
        }

        // Get user profile/role from your database if needed
        // For now, we'll assume the role is stored in user metadata or a separate profiles table
        // In Supabase, you often store roles in a 'profiles' table or app_metadata

        const { data: profile } = await this.client
            .from('profiles')
            .select('role, full_name')
            .eq('id', data.user.id)
            .single();

        return {
            user: {
                id: data.user.id,
                email: data.user.email,
                name: profile?.full_name || data.user.user_metadata?.full_name || 'User',
                role: profile?.role || 'cashier', // Default to cashier
            },
            session: data.session,
        };
    }

    async logout() {
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
        return { success: true };
    }

    async getMe(token: string) {
        const { data: { user }, error } = await this.client.auth.getUser(token);
        if (error || !user) throw new UnauthorizedException('Invalid token');

        const { data: profile } = await this.client
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        return {
            id: user.id,
            email: user.email,
            name: profile?.full_name || user.user_metadata?.full_name || 'User',
            role: profile?.role || 'cashier',
        };
    }
}
