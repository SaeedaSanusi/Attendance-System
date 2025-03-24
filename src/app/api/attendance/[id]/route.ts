import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import AttendanceModel from '@/app/models/AttendanceModel';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const record = await AttendanceModel.findOneAndDelete({ id: params.id });
    
    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    );
  }
}