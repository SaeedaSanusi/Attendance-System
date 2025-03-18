// AttendanceForm.tsx
"use client";

import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: string;
  name: string;
  checkIn: string;
  checkOut?: string;
}

export default function AttendanceForm() {
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);

  // Load records from localStorage when component mounts
  useEffect(() => {
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  const handleCheckIn = () => {
    if (!name || !id) return;
    
    const newRecord = {
      id,
      name,
      checkIn: new Date().toLocaleString(),
    };
    
    setRecords(prevRecords => [newRecord, ...prevRecords]);
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    const updatedRecords = records.map(record => {
      if (record.id === id && !record.checkOut) {
        return {
          ...record,
          checkOut: new Date().toLocaleString()
        };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    setCheckedIn(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your ID"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={checkedIn}
            >
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              disabled={!checkedIn}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
        <div className="space-y-4">
          {records.map((record, index) => (
            <div
              key={index}
              className="border-b dark:border-gray-700 pb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{record.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {record.id}
                </p>
              </div>
              <div className="text-right">
                <div className="mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Check in: </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {record.checkIn}
                  </span>
                </div>
                {record.checkOut && (
                  <div className="mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Check out: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {record.checkOut}
                    </span>
                  </div>
                )}
                <span
                  className={`text-sm ${
                    record.checkOut ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {record.checkOut ? 'Checked Out' : 'Checked In'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}