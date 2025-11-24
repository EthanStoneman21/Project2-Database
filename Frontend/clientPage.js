document.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById('serviceRequest-btn').addEventListener('click', () => {
    window.location.href = 'serviceRequest.html';
  });

  document.getElementById('serviceQuotes-btn').addEventListener('click', () => {
    window.location.href = 'serviceQuotes.html';
  });

  document.getElementById('bills-btn').addEventListener('click', () => {
    window.location.href = 'bills.html';
  });
});