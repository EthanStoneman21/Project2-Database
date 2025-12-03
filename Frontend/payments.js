document.addEventListener('DOMContentLoaded', function() {
  // Fetch all paid bills
  fetch('http://localhost:5050/getPaidBills', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => loadHTMLTable(data.bills))
    .catch(err => console.error("Error loading paid bills:", err));
});

// Debug helper (optional)
function debug(data) {
  fetch('http://localhost:5050/debug', {
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ debug: data })
  });
}

function loadHTMLTable(data) {
  const table = document.querySelector('#paid-table tbody');

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No Paid Bills Found</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(function ({ billid, orderid, clientid, finalprice, typeoforder, billnotes, billdate, paydate }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${billid}</td>`;
    tableHtml += `<td>${orderid}</td>`;
    tableHtml += `<td>${clientid}</td>`;
    tableHtml += `<td>$${finalprice}</td>`;
    tableHtml += `<td>${typeoforder}</td>`;
    tableHtml += `<td>${billnotes || ""}</td>`;
    tableHtml += `<td>${new Date(billdate).toLocaleDateString()}</td>`;
    tableHtml += `<td>${paydate ? new Date(paydate).toLocaleDateString() : ""}</td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}