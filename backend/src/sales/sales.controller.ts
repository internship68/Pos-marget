import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { SalesService, CreateSaleDto } from './sales.service';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@Body() dto: CreateSaleDto) {
        return this.salesService.create(dto);
    }

    @Get()
    findAll(
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('status') status?: string,
    ) {
        return this.salesService.findAll({ from, to, status });
    }

    @Get('summary')
    getSummary() {
        return this.salesService.getSummary();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.salesService.cancel(id);
    }
}
