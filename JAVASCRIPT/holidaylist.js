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

    // Load holidays immediately when the page loads
    loadHolidays();
});



const toggleButton = document.getElementById('toggle-button');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('sidebar-hidden');
  mainContent.classList.toggle('ml-0');
});



document.addEventListener("DOMContentLoaded", function() {
  const menuItems = document.querySelectorAll(".sidebar a");

  menuItems.forEach(item => {
    item.addEventListener("click", function() {
      // Remove active class from all menu items
      menuItems.forEach(i => i.classList.remove("active"));
      // Add active class to the clicked menu item
      this.classList.add("active");
    });
  });
});