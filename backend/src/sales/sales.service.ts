import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateSaleDto {
    cashier_id?: string;
    cashier_name?: string;
    subtotal: number;
    discount: number;
    total: number;
    payment_method: string;
    note?: string;
    items: {
        product_id: string;
        product_name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }[];
}

@Injectable()
export class SalesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateSaleDto) {
        // สร้างเลขที่บิล: RCP-YYYYMMDD-XXXX
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const count = await this.prisma.sale.count({
            where: {
                created_at: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                },
            },
        });
        const receiptNumber = `RCP-${dateStr}-${String(count + 1).padStart(4, '0')}`;

        // สร้างบิล + รายการสินค้า + ตัดสต็อก ทั้งหมดใน transaction
        const sale = await this.prisma.$transaction(async (tx) => {
            // 1. สร้าง Sale + SaleItems
            const newSale = await tx.sale.create({
                data: {
                    receipt_number: receiptNumber,
                    cashier_id: dto.cashier_id,
                    cashier_name: dto.cashier_name,
                    subtotal: dto.subtotal,
                    discount: dto.discount,
                    total: dto.total,
                    payment_method: dto.payment_method,
                    status: 'completed',
                    note: dto.note,
                    items: {
                        create: dto.items.map((item) => ({
                            product_id: item.product_id,
                            product_name: item.product_name,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            total_price: item.total_price,
                        })),
                    },
                },
                include: { items: true },
            });

            // 2. ตัดสต็อกสินค้าแต่ละรายการ
            for (const item of dto.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return newSale;
        });

        return sale;
    }

    async findAll(query?: { from?: string; to?: string; status?: string }) {
        const where: any = {};

        if (query?.from || query?.to) {
            where.created_at = {};
            if (query.from) where.created_at.gte = new Date(query.from);
            if (query.to) where.created_at.lte = new Date(query.to + 'T23:59:59');
        }

        if (query?.status && query.status !== 'all') {
            where.status = query.status;
        }

        return this.prisma.sale.findMany({
            where,
            include: { items: true },
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.sale.findUnique({
            where: { id },
            include: { items: true },
        });
    }

    async cancel(id: string) {
        // ยกเลิกบิล + คืนสต็อก
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!sale || sale.status === 'cancelled') return sale;

        return this.prisma.$transaction(async (tx) => {
            // คืนสต็อก
            for (const item of sale.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } },
                });
            }

            // อัปเดตสถานะบิล
            return tx.sale.update({
                where: { id },
                data: { status: 'cancelled' },
                include: { items: true },
            });
        });
    }

    async getSummary() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const [todaySales, allSales] = await Promise.all([
            this.prisma.sale.findMany({
                where: { created_at: { gte: startOfDay }, status: 'completed' },
            }),
            this.prisma.sale.findMany({
                where: { status: 'completed' },
            }),
        ]);

        const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total), 0);
        const todayCount = todaySales.length;
        const totalRevenue = allSales.reduce((sum, s) => sum + Number(s.total), 0);
        const totalCount = allSales.length;

        return { todayRevenue, todayCount, totalRevenue, totalCount };
    }
}
