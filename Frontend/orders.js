// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAllOrders')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
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


function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");

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
    data.filter(item => item.orderstatus === 0).forEach(function ({orderid, requestid, typeoforder, finalprice, ordernotes, orderdate}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${orderid}</td>`;
        tableHtml += `<td>${requestid}</td>`;
        tableHtml += `<td>${typeoforder}</td>`;
        tableHtml += `<td>${finalprice}</td>`;
        tableHtml += `<td>${ordernotes}</td>`;
        tableHtml += `<td>${new Date(orderdate).toLocaleDateString()}</td>`;
        tableHtml += "</tr>";
        tableHtml += `<td><button class="completeOrder-btn" data-orderid="${orderid}" data-typeoforder="${typeoforder}" data-finalprice="${finalprice}">Complete</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;

    document.querySelectorAll('.completeOrder-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
    const orderid = this.dataset.orderid;
    const typeoforder = this.dataset.typeoforder;
    const finalprice = this.dataset.finalprice;
    const note = prompt("Enter any notes:");

    const completeOrder = {
      orderid,
      typeoforder,
      finalprice,
      billnotes: note
    };

    try {
      const response = await fetch('http://localhost:5050/completeOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeOrder),
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        alert(`Order Complete! Bill created.`);
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