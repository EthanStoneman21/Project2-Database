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

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:5050/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert("Logged out successfully");
            window.location.assign('./index.html');
        } else {
            alert("Logout failed");
        }
    } catch (err) {
        console.error("Error logging out:", err);
    }
});