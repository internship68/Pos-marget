import { NextResponse } from 'next/server';
import { transactionsService } from '@/backend/modules/transactions/transactions.service';

export async function GET() {
  try {
    const transactions = await transactionsService.findAll();
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = await transactionsService.create(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
