// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getFrequentClients')     
    .then(response => response.json())
    .then(data => loadFrequentClients(data['data']));
    fetch('http://localhost:5050/getUncommittedClients')     
    .then(response => response.json())
    .then(data => loadUncommittedClients(data['data']));
});
// when the addBtn is clicked
/*const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function (){
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}*/

// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

// when the servreq button is clicked
const servreqBtn =  document.querySelector('#servreq-btn');
servreqBtn.onclick = function (){
    alert("Anna Johnson Service Requests Button Clicked");
            window.location.assign("./servreqanna.html");
            return;
}

// when the negotiations button is clicked
const negotiationsBtn =  document.querySelector('#negotiations-btn');
negotiationsBtn.onclick = function (){
    alert("Anna Johnson Negotiations Page Button Clicked");
            window.location.assign("./negotiations.html");
            return;
}

// when the orders button is clicked
const ordersBtn =  document.querySelector('#orders-btn');
ordersBtn.onclick = function (){
    alert("Anna Johnson Orders Page Button Clicked");
            window.location.assign("./orders.html");
            return;
}

// when the bills button is clicked
const billsBtn =  document.querySelector('#bills-btn');
billsBtn.onclick = function (){
    alert("Anna Johnson Orders Bills Button Clicked");
            window.location.assign("./annabills.html");
            return;
}

// when the payments button is clicked
const paymentsBtn =  document.querySelector('#payments-btn');
paymentsBtn.onclick = function (){
    alert("Anna Johnson Orders Payments Button Clicked");
            window.location.assign("./payments.html");
            return;
}

//logout button
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

function loadFrequentClients(data){
    debug("index.js: loadFrequentClients called.");

    const table = document.querySelector('#table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='11'>No Data</td></tr>";
        return;
    }
  
    /*
    In the following JavaScript code, the forEach method is used to iterate over the 
    elements of the data array. The forEach method is a higher-order function 
    that takes a callback function as its argument. The callback function is 
    executed once for each element in the array.
    
    In this case, the callback function takes a single argument, which is an object 
    destructuring pattern:


    function ({id, name, date_added}) {
        // ... code inside the callback function
    }

    This pattern is used to extract the id, name, and date_added properties from each 
    element of the data array. The callback function is then executed for each element
    in the array, and within the function, you can access these properties directly 
    as variables (id, name, and date_added).

    
    In summary, the forEach method is a convenient way to iterate over each element in 
    an array and perform some operation or execute a function for each element. 
    The provided callback function is what gets executed for each element in the 
    data array.
    */

    let tableHtml = "";
    data.forEach(function ({firstname, lastname}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${firstname}</td>`;
        tableHtml += `<td>${lastname}</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

function loadUncommittedClients(data){
    debug("index.js: loadUncommittedClients called.");

    const table = document.querySelector('#table1 tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='11'>No Data</td></tr>";
        return;
    }
  
    /*
    In the following JavaScript code, the forEach method is used to iterate over the 
    elements of the data array. The forEach method is a higher-order function 
    that takes a callback function as its argument. The callback function is 
    executed once for each element in the array.
    
    In this case, the callback function takes a single argument, which is an object 
    destructuring pattern:


    function ({id, name, date_added}) {
        // ... code inside the callback function
    }

    This pattern is used to extract the id, name, and date_added properties from each 
    element of the data array. The callback function is then executed for each element
    in the array, and within the function, you can access these properties directly 
    as variables (id, name, and date_added).

    
    In summary, the forEach method is a convenient way to iterate over each element in 
    an array and perform some operation or execute a function for each element. 
    The provided callback function is what gets executed for each element in the 
    data array.
    */

    let tableHtml = "";
    data.forEach(function ({firstname, lastname, total_requests}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${firstname}</td>`;
        tableHtml += `<td>${lastname}</td>`;
        tableHtml += `<td>${total_requests}</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}