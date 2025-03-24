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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/attendance');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(data);

      const currentUserRecord = data.find(
        (record: AttendanceRecord) => 
          record.id === id && !record.checkOut
      );
      setCheckedIn(!!currentUserRecord);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch records');
    }
  };

  const handleCheckIn = async () => {
    if (!name || !id) {
      setError('Please enter both name and ID');
      return;
    }
    
    try {
      setError('');
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          checkIn: new Date().toLocaleString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check in');
      }

      await fetchRecords();
      setCheckedIn(true);
      setError('');
    } catch (error) {
      console.error('Error checking in:', error);
      setError(error instanceof Error ? error.message : 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!id) {
      setError('ID is required for check out');
      return;
    }

    try {
      setError('');
      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          checkOut: new Date().toLocaleString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check out');
      }

      console.log('Checkout response:', data);

      await fetchRecords();
      setCheckedIn(false);
      setName('');
      setId('');
      setError('');
    } catch (error) {
      console.error('Error checking out:', error);
      setError(error instanceof Error ? error.message : 'Failed to check out');
    }
  };

  const handleAdminAuth = () => {
    const ADMIN_PASSWORD = 'admin123'; // This is just for demonstration
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminAuth(false);
      setAdminPassword(''); // Clear password after successful login
      setError('');
    } else {
      setError('Invalid admin password');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!isAdmin) {
      setShowAdminAuth(true);
      return;
    }

    try {
      const response = await fetch(`/api/attendance/${recordId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      // Remove the deleted record from local state
      setRecords(records.filter(record => record.id !== recordId));
      setError('');
    } catch (error) {
      console.error('Error deleting record:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete record');
    }
  };

  const AdminAuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Authentication
          </h3>
          
          <div className="relative">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminAuth()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowAdminAuth(false);
                setAdminPassword('');
                setError('');
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdminAuth}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
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

      {showAdminAuth && <AdminAuthModal />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Attendance Records</h2>
          {isAdmin && (
            <span className="text-sm text-green-500">Admin Mode Active</span>
          )}
        </div>
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
              <button
                onClick={() => handleDeleteRecord(record.id)}
                className="text-red-500 hover:text-red-700"
                title={isAdmin ? "Delete Record" : "Requires Admin Access"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}