import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function POST(request) {
  try {
    await dbConnect();
    const payload = await request.json();
    
    // Asynchronously create the document record inside Atlas
    const orderRecord = await Order.create(payload);
    
    return NextResponse.json({ success: true, orderId: orderRecord._id }, { status: 201 });
  } catch (error) {
    console.error("🚨 CRITICAL PROD DATABASE EXCEPTION:", error);
    
    // Return a sanitized, secure notification back to the client UI
    return NextResponse.json({ 
      success: false, 
      error: "We encountered an operational issue logging your transaction. Please message our helpline directly via WhatsApp!" 
    }, { status: 500 });
  }
}