# Attendance System Documentation 

## Project Overview 

This is a web-based attendance system built with Next.js 15.2.2, providing a simple interface for tracking attendance records. 

### Technical Stack 

Core Technologies: 
- Next.js 15.2.2 (React Framework) 
- React 19.0.0 
- TypeScript 
- Tailwind CSS 

- Local Storage 
 
 
Development Tools: 
- ESLint 9.x 
- PostCSS 
   

### Installation & Setup 

Clone the repository 

#### Install dependencies: 

npm install 
  

#### Run development server: 

npm run dev 
  

The app will be available at http://localhost:3000 

## Implementation Details 

### Data Model 

interface AttendanceRecord { 
  id: string; 
  name: string; 
  checkIn: string; 
  checkOut?: string; 
} 
  

### Key Functions 

const handleCheckIn = () => { 
  // Validation 
  if (!name || !id) return; 
   
  // Create record 

  const newRecord = { 
    id, 
    name, 
    checkIn: new Date().toLocaleString() 
  }; 
   
  // Update state & storage 
  
  setRecords([newRecord, ...records]); 
  setCheckedIn(true); 
}; 
 
const handleCheckOut = () => { 
  // Find active record 
  const updatedRecords = records.map(record => { 
    if (record.id === id && !record.checkOut) { 
      return { 
        ...record, 
        checkOut: new Date().toLocaleString() 
      }; 
    } 
    return record; 
  }); 
   
  // Update state & storage 

  setRecords(updatedRecords); 
  setCheckedIn(false); 
}; 
 

 

### Font Configuration 

The project uses the Geist font family, configured in layout.tsx: 

import { Geist } from 'next/font/google' 
 
// Font

 configuration with variable support 
const geist = Geist({  
  variable: '--font-geist' 
}) 
  

### State Management 

The application uses React's built-in useState hook for managing form state in the AttendanceForm component: 

// Form state 

const [name, setName] = useState("") 
const [date, setDate] = useState("") 
const [checkIn, setCheckIn] = useState("") 
const [checkOut, setCheckOut] = useState("") 
  

#### State Variables: 

name: Stores employee name 

date: Stores attendance date 

checkIn: Stores check-in time 

checkOut: Stores check-out time 

### Components 

#### AttendanceForm Component 

The main form component handles: 

User input collection 

Form validation 

Submission handling 

## Core Features 

### Primary Functions 

User Check-in 

User Check-out 

Attendance History Display 

Data Persistence 

Real-time Updates 

### User Flow 

Enter name and ID 

Record check-in date and time 

Record check-out date and time 

View attendance history 

## Data Flow 

### Check-in Process 

User inputs name and ID 

Validation check 

Create new record 

Update state 

Save to localStorage 

Update UI 

### Check-out Process 

Find matching record 

Add check-out time 

Update record 

Save changes 

Reset check-in status 

 

 

## Development Guide 

### Running in Development Mode 

npm run dev 
  

### Building for Production 

npm run build 
  

### Running Production Build 

npm run start 
  

### Code Linting 

npm run lint 
  

## Project Phases 

### Setup Phase 

Project initialization with create-next-app 

Dependencies installation 

TypeScript configuration 

### Development Phase 

Component creation 

State management implementation 

Form validation setup 

Styling with Tailwind CSS 

### Testing Phase 

Component testing 

Form validation testing 

Responsive design testing  

## Development Requirements 

Node.js

npm or yarn package manager 

Basic understanding of React and TypeScript 

Familiarity with Next.js framework 

## Future Enhancements 

### Planned Features 

Database integration 

User authentication 

Report generation 

Admin dashboard 

### Technical Improvements 

Add unit tests 

Implement error boundary 

Add form validation library 