document.addEventListener('DOMContentLoaded', function() {
  // Fetch all bills for the logged-in client
  fetch('http://localhost:5050/getAllBills', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']))
    .catch(err => console.error("Error loading bills:", err));
});

// Debug helper (optional)
function debug(data) {
  fetch('http://localhost:5050/debug', {
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ debug: data })
  });
}

// when the back button is clicked
const backBtn =  document.querySelector('#back-btn');
backBtn.onclick = function (){
            window.location.assign("./clientPage.html");
}

function loadHTMLTable(data) {
  const table = document.querySelector('#table tbody');

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Bills Found</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(function ({ billid, orderid, finalprice, billnotes, billdate }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${billid}</td>`;
    tableHtml += `<td>${orderid}</td>`;
    tableHtml += `<td>$${finalprice}</td>`;
    tableHtml += `<td>${billnotes || ""}</td>`;
    tableHtml += `<td>${new Date(billdate).toLocaleDateString()}</td>`;
    tableHtml += `<td><button class="Pay-btn" data-billid="${billid}">Pay</button></td>`;
    tableHtml += `<td><button class="Dispute-btn" data-billid="${billid}">Dispute</button></td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;

  document.querySelectorAll('.Pay-btn').forEach(btn => {
    btn.addEventListener('click', async function () {

    const billid = this.dataset.billid;

    try {
      const response = await fetch('http://localhost:5050/payBill', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billid }),
        credentials: "include"
      });

      const result = await response.json();
      if (result.success) {
        alert(`Bill Has Been paid!`);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});

document.querySelectorAll('.Dispute-btn').forEach(btn => {
    btn.addEventListener('click', async function () {

    const billid = this.dataset.billid;
    const disputes = prompt("Enter your dispute note:");

    if (!disputes) return;
    
    try {
      const response = await fetch('http://localhost:5050/disputeBill', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billid, disputes }),
        credentials: "include"
      });

      const result = await response.json();
      if (result.success) {
        alert(`DIspute sent!`);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});




}