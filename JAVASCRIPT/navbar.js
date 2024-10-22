$(document).ready(function () {
    $('#toggle-button').click(function () {
      $('#sidebar').toggleClass('sidebar-hidden');
      $('#main-content').toggleClass('ml-72');
    });
  
    $('#search-button').click(function () {
      const query = $('#search-input').val();
      console.log('You searched for: ' + query);
    });
  
    $('#logout-button').click(function() {
      console.log('Logged out successfully!');
    });
  });
  