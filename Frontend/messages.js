// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAnnaMessagesAccepted', {
        method: "GET",
        credentials: "include"
    })     
    .then(response => response.json())
    .then(data => loadAcceptTable(data['data']));
    fetch('http://localhost:5050/getAnnaMessagesRejected', {
        method: "GET",
        credentials: "include"
    })     
    .then(response => response.json())
    .then(data => loadRejectTable(data['data']));
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

/* when the respond button is clicked
const respondBtn =  document.querySelector('#respond-btn');
respondBtn.onclick = function (){
    alert("Anna Johnson Service Requests Button Clicked");
            window.location.assign("./servreqanna.html");
            return;
}
*/

let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
      function(event){
        if(event.target.className === "delete-row-btn"){

            deleteRowById(event.target.dataset.id);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.id); // display the edit row interface
        }
      }
);


let idToUpdate = 0;

function showEditRowInterface(id){
    debug("id clicked: ");
    debug(id);
    document.querySelector('#update-name-input').value = ""; // clear this field
    const updateSetction = document.querySelector("#update-row");  
    updateSetction.hidden = false;
    // we assign the id to the update button as its id attribute value
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate+"");
}


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

function insertRowIntoTable(data){

   debug("index.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

  // debug(isTableData);

   let tableHtml = "<tr>";
   
   for(var key in data){ // iterating over the each property key of an object data
      if(data.hasOwnProperty(key)){   // key is a direct property for data
            if(key === 'dateAdded'){  // the property is 'dataAdded'
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

   tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
   tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;

   tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        // debug(tableHtml);

        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}


function loadAcceptTable(data){
    debug("index.js: loadAcceptTable called.");

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
    data.forEach(function ({adjustedPrice, messagebody, messagedate, recipientid, requestid}) {
        tableHtml += "<tr>";
        tableHtml += `<td>$${adjustedPrice}</td>`;
        tableHtml += `<td>${messagebody}</td>`;
        tableHtml += `<td>${new Date(messagedate).toLocaleString()}</td>`;
        tableHtml += `<td><button class="accept-btn" data-requestid="${requestid}" data-finalprice="${adjustedPrice}">Accept</button></td>`;
        tableHtml += `<td><button class="counter-btn" data-recipientid="${recipientid}">Counter</button></td>`;
        tableHtml += "</tr>";
      });

    table.innerHTML = tableHtml;

     // when the reject button is clicked
  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
        const recipientid = this.dataset.recipientid; //same requestid
        const note = prompt("Enter any notes:");

        const counter = {
            recipientid,
            note
        };

        try {
            const response = await fetch('http://localhost:5050/servicecounter', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify(counter),
                credentials: 'include'
            });

            const result = await response.json();
            if (result.success) {
                alert(`Countered!`);
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    })
});

   // when the accept button is clicked
   document.querySelectorAll('.accept-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
        const requestid = this.dataset.requestid; //same requestid
        const finalprice = this.dataset.finalprice; //same finalprice
        const ordernotes = prompt("Enter any notes:");

        const accept = {
            orderid: crypto.randomUUID(),
            requestid,
            finalprice,
            ordernotes
        };

        try {
            const response = await fetch('http://localhost:5050/serviceaccept', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify(accept),
                credentials: 'include'
            });

            const result = await response.json();
            if (result.success) {
                alert(`Accepted!`);
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    })
});
  
}

function loadRejectTable(data){
    debug("index.js: loadRejectTable called.");

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
    data.forEach(function ({messagebody, messagedate}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${messagebody}</td>`;
        tableHtml += `<td>${new Date(messagedate).toLocaleString()}</td>`;
        tableHtml += "</tr>";
      });

    table.innerHTML = tableHtml;
}