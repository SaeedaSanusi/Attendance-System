import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import AttendanceModel from '@/app/models/AttendanceModel';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }
    await connectDB();
    const records = await AttendanceModel.find().sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch records',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const record = await AttendanceModel.create(data);
    return NextResponse.json(record);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create record',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Find the most recent check-in without a checkout
    const record = await AttendanceModel.findOneAndUpdate(
      { 
        id: data.id,
        checkOut: { $exists: false } 
      },
      { 
        $set: { 
          checkOut: new Date().toLocaleString() 
        }
      },
      { 
        new: true,
        sort: { createdAt: -1 } 
      }
    );

    if (!record) {
      return NextResponse.json(
        { error: 'No active check-in found for this ID' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update record',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}