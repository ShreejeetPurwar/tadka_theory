import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const newOrder = await Order.create(data);
    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (error) {
    console.error("🚨 FULL MONGODB ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}