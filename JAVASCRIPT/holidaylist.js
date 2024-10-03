// holiday-calendar.js

document.addEventListener('DOMContentLoaded', () => {
    const holidays = [
      { date: 'January 26', holiday: 'Republic Day' },
      { date: 'March 8', holiday: 'Maha Shivaratri' },
      { date: 'March 25', holiday: 'Holi' },
      { date: 'March 29', holiday: 'Good Friday' },
      { date: 'April 10', holiday: 'Ramadan/Eid al-Fitr' },
      { date: 'August 15', holiday: 'Independence Day' },
      { date: 'August 19', holiday: 'Raksha Bandhan' },
      { date: 'August 26', holiday: 'Janmashtami' },
      { date: 'September 7', holiday: 'Ganesh Chaturthi' },
      { date: 'October 2', holiday: 'Gandhi Jayanti' },
      { date: 'October 12', holiday: 'Dussehra' },
      { date: 'November 1', holiday: 'Diwali' },
      { date: 'November 15', holiday: 'Guru Nanak Jayanti' },
      { date: 'December 25', holiday: 'Christmas' }
    ];
  
    const tableBody = document.querySelector('#holidayTable tbody');
  
    function loadHolidays() {
      tableBody.innerHTML = ''; // Clear existing table rows
  
      holidays.forEach(holiday => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${holiday.date}</td>
          <td>${holiday.holiday}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    document.getElementById('loadHolidays').addEventListener('click', loadHolidays);
  });
  