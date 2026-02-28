import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    constructor() {
        // 1. สร้าง connection pool โดยใช้ pg
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        // 2. สร้าง Driver Adapter สำหรับ Prisma 7
        const adapter = new PrismaPg(pool);

        // 3. ส่ง adapter เข้าไปใน PrismaClient
        super({ adapter });
        this.pool = pool;
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end(); // ปิด pool เมื่อแอปหยุด
    }
}