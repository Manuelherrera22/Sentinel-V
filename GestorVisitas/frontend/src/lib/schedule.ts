export const VISITATION_SCHEDULE = {
  Tuesday: {
    'Building 1': [1, 2, 3, 4, 5, 6, 7, 8],
    'Building 2': [1, 2, 3, 4, 5, 6, 7, 8]
  },
  Thursday: {
    'Building 1': [9, 10, 11, 12]
  },
  Friday: {
    'Building 2': [9, 10, 11, 12, 13, 14]
  },
  Saturday: {
    'Building 1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  Sunday: {
    'Building 2': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  }
};

export const E_SERVICES_SCHEDULE = {
  timeSlots: '09:00 AM - 12:00 PM | 01:30 PM - 05:00 PM',
  Tuesday: {
    'Building 2': [9, 10, 11, 12, 14]
  },
  Wednesday: {
    'Building 2': [1, 2, 5, 6, 7, 8, 13]
  },
  Thursday: {
    'Building 1': [1, 3, 5, 6, 7, 8]
  },
  Friday: {
    'Building 1': [9, 10, 11, 12]
  }
};

export type ScheduleType = 'physical' | 'eservices';

export function checkEligibility(building: string, dormStr: string, type: ScheduleType = 'physical', date: Date = new Date()): { eligible: boolean; reason: string } {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  
  const scheduleObj = type === 'physical' ? VISITATION_SCHEDULE : E_SERVICES_SCHEDULE;
  const scheduleForDay = (scheduleObj as any)[dayName];
  
  if (!scheduleForDay) {
    return { eligible: false, reason: `No ${type} allowed on ${dayName}s.` };
  }

  const allowedDorms = scheduleForDay[building];
  if (!allowedDorms) {
    return { eligible: false, reason: `${building} is not scheduled for ${dayName}s.` };
  }

  // Parse dorm number from string like 'Dorm 5'
  const dormNumMatch = dormStr.match(/\d+/);
  if (!dormNumMatch) return { eligible: false, reason: 'Invalid dorm format.' };
  
  const dormNum = parseInt(dormNumMatch[0], 10);
  
  if (allowedDorms.includes(dormNum)) {
    const timeInfo = type === 'eservices' ? ` (${E_SERVICES_SCHEDULE.timeSlots})` : '';
    return { eligible: true, reason: `Eligible for ${type} today${timeInfo}.` };
  }

  return { eligible: false, reason: `Dorm ${dormNum} in ${building} is not scheduled for ${dayName}s.` };
}
