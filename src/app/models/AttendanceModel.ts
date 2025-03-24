import mongoose, { Schema } from 'mongoose';

interface IAttendance {
  id: string;
  name: string;
  checkIn: string;
  checkOut?: string;
}

const attendanceSchema = new Schema<IAttendance>({
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

const AttendanceModel = mongoose.models.Attendance || 
  mongoose.model<IAttendance>('Attendance', attendanceSchema);

export default AttendanceModel;
