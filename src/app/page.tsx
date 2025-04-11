import AttendanceForm from './components/AttendanceForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Attendance System
        </h1>
        <AttendanceForm />
      </div>
    </div>
  );
}
