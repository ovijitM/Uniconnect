
import { Attendee } from '../types';

export const exportAttendeesToCSV = (eventId: string, attendees: Attendee[]): void => {
  // Create CSV content
  const headers = ['Name', 'Email', 'Registration Date', 'Checked In', 'Check-in Time'];
  const csvRows = [
    headers.join(','),
    ...attendees.map(attendee => [
      `"${attendee.name}"`,
      `"${attendee.email}"`,
      `"${new Date(attendee.created_at).toLocaleString()}"`,
      `"${attendee.checked_in ? 'Yes' : 'No'}"`,
      `"${attendee.checked_in_at ? new Date(attendee.checked_in_at).toLocaleString() : 'N/A'}"`
    ].join(','))
  ];
  const csvContent = csvRows.join('\n');
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `event-attendees-${eventId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
