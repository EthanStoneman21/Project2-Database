// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
  // Table 1: unpaid bills
  fetch('http://localhost:5050/getUnpayedBills', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => loadHTMLTable(data.bills, '#unpaid-table tbody', false))
    .catch(err => console.error("Error loading unpaid bills:", err));

  // Table 2: disputed unpaid bills
  fetch('http://localhost:5050/getDisputedBills', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => loadHTMLTable(data.bills, '#disputed-table tbody', true))
    .catch(err => console.error("Error loading disputed bills:", err));
});

// Debug helper (optional)
function debug(data) {
  fetch('http://localhost:5050/debug', {
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ debug: data })
  });
}

/**
 * @param {Array} data
 * @param {string} selector
 * @param {boolean} showDisputes
 */
function loadHTMLTable(data, selector, showDisputes) {
  const table = document.querySelector(selector);

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Bills Found</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(function ({ billid, orderid, finalprice, billnotes, billdate, disputes }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${billid}</td>`;
    tableHtml += `<td>${orderid}</td>`;
    tableHtml += `<td>$${finalprice}</td>`;
    tableHtml += `<td>${billnotes || ""}</td>`;
    tableHtml += `<td>${new Date(billdate).toLocaleDateString()}</td>`;
    if (showDisputes) {
      tableHtml += `<td>${disputes || ""}</td>`;
      tableHtml += `<td><button class="Edit-btn" data-billid="${billid}">Edit</button></td>`;
    }
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;

  document.querySelectorAll('.Edit-btn').forEach(btn => {
    btn.addEventListener('click', async function () {

    const billid = this.dataset.billid;
    const discounts = prompt("Enter Discount Amount:");
    const finalprice = prompt("Enter Updated Price:");
    const explanations = prompt("Enter Explanation:");

    if (!discounts) return;
    if (!finalprice) return;
    if (!explanations) return;
    
    
   try {
      const response = await fetch('http://localhost:5050/editBill', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billid, discounts, finalprice, explanations }),
        credentials: "include"
      });

      const result = await response.json();
      if (result.success) {
        alert(`Bill Updated!`);
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
