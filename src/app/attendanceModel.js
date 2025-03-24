import mongoose, { Schema, Document } from 'mongoose';

const attendanceSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
  }
}, {
  timestamps: true
});

export const AttendanceModel = mongoose.models.Attendance || 
  mongoose.model<AttendanceRecord>('Attendance', attendanceSchema);
