import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly supabaseService: SupabaseService) { }

    @Post('product-image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProductImage(@UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer }) {
        if (!file) throw new BadRequestException('No file provided');

        const supabase = this.supabaseService.getClient();
        const ext = file.originalname.split('.').pop();
        const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) throw new BadRequestException(`Upload failed: ${error.message}`);

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        return { url: data.publicUrl };
    }
}
