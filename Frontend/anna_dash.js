// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getFrequentClients')     
    .then(response => response.json())
    .then(data => loadFrequentClients(data['data']));
    fetch('http://localhost:5050/getUncommittedClients')     
    .then(response => response.json())
    .then(data => loadUncommittedClients(data['data']));
    fetch('http://localhost:5050/getProspectiveClients')     
    .then(response => response.json())
    .then(data => loadProspectiveClients(data['data']));
    fetch('http://localhost:5050/getLargestJobs')     
    .then(response => response.json())
    .then(data => largestJob(data['data']));
    fetch('http://localhost:5050/getOverdueBills')
    .then(response => response.json())
    .then(data => loadOverdueBills(data['data']));
    fetch('http://localhost:5050/getBadClients')
    .then(response => response.json())
    .then(data => loadBadClients(data['data']));
    fetch('http://localhost:5050/getGoodClients')
    .then(response => response.json())
    .then(data => loadGoodClients(data['data']));

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
            window.location.assign("./servreqanna.html");
}

// when the negotiations button is clicked
const negotiationsBtn =  document.querySelector('#negotiations-btn');
negotiationsBtn.onclick = function (){
            window.location.assign("./negotiations.html");
}

// when the orders button is clicked
const ordersBtn =  document.querySelector('#orders-btn');
ordersBtn.onclick = function (){
            window.location.assign("./orders.html");
}

// when the bills button is clicked
const billsBtn =  document.querySelector('#bills-btn');
billsBtn.onclick = function (){
            window.location.assign("./annabills.html");
}

// when the payments button is clicked
const paymentsBtn =  document.querySelector('#payments-btn');
paymentsBtn.onclick = function (){
            window.location.assign("./payments.html");
}

// when the submit button is clicked
const submitBtn = document.querySelector('#accepted-quotes-form button');

submitBtn.onclick = async function (e) {
    e.preventDefault();
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    try {
        const response = await fetch(`http://localhost:5050/acceptedquotes?month=${month}&year=${year}`);
        const { data } = await response.json();

        const table = document.querySelector("#table2 tbody");

        if (!data || data.length === 0) {
            table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>";
            return;
        }
          

        let tableHtml = "";
        data.forEach(function ({ orderid, requestid, orderdate, servicedate }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${orderid}</td>`;
        tableHtml += `<td>${requestid}</td>`;
        tableHtml += `<td>${new Date(orderdate).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(servicedate).toLocaleDateString()}</td>`;
        tableHtml += "</tr>";
        });

        table.innerHTML = tableHtml;
    } catch (err) {
        console.error("Error fetching accepted quotes:", err);
    }
};


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

function loadProspectiveClients(data){
    debug("index.js: loadProspectiveClients called.");

    const table = document.querySelector('#table3 tbody'); 
    
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
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

function largestJob(data){
    debug("index.js: largestJob called.");

    const table = document.querySelector('#table4 tbody'); 
    
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
    data.forEach(function ({requestid, numofrooms, servicedate}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${requestid}</td>`;
        tableHtml += `<td>${numofrooms}</td>`;
        tableHtml += `<td>${servicedate}</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}


function loadOverdueBills(data) {
  debug("index.js: loadOverdueBills called.");

  const table = document.querySelector('#table5 tbody'); 

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Overdue Bills</td></tr>";
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
    tableHtml += "</tr>";
  });


  table.innerHTML = tableHtml;

}

function loadBadClients(data) {
  debug("index.js: loadBadClients called.");

  const table = document.querySelector('#table6 tbody'); 

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='2'>No Bad Clients</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(function ({ firstname, lastname }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${firstname}</td>`;
    tableHtml += `<td>${lastname}</td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

function loadGoodClients(data) {
  debug("index.js: loadGoodClients called.");

  const table = document.querySelector('#table7 tbody'); 

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='2'>No Good Clients</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(function ({ firstname, lastname }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${firstname}</td>`;
    tableHtml += `<td>${lastname}</td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}