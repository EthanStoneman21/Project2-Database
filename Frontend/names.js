// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll')     
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

// when the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

//when search by firstname button is clicked
const searchFirstnameBtn = document.querySelector('#search-firstname-btn');
searchFirstnameBtn.onclick = function () {
  const searchInput = document.querySelector('#search-firstname-input');
  const searchValue = searchInput.value;
  searchInput.value = "";

  fetch('http://localhost:5050/searchf/' + searchValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//when search by userid is clicked
const searchUseridBtn = document.querySelector('#search-userid-btn');
searchUseridBtn.onclick = function () {
  const searchInput = document.querySelector('#search-userid-input');
  const searchValue = searchInput.value;
  searchInput.value = "";

  fetch('http://localhost:5050/searchu/' + searchValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//when search by salaries is clicked
const searchSalariesBtn = document.querySelector('#search-salaries-btn');
searchSalariesBtn.onclick = function () {
  const minInput = document.querySelector('#min-salaries-input');
  const maxInput = document.querySelector('#max-salaries-input');

  console.log("Button clicked");


  const minValue = minInput.value;
  const maxValue = maxInput.value;

  minInput.value = "";
  maxInput.value = "";

  fetch('http://localhost:5050/searchs/' + minValue + '/' + maxValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//when search by ages is clicked
const searchAgesBtn = document.querySelector('#search-ages-btn');
searchAgesBtn.onclick = function () {
  const minInput = document.querySelector('#min-ages-input');
  const maxInput = document.querySelector('#max-ages-input');

  console.log("Button clicked");


  const minValue = minInput.value;
  const maxValue = maxInput.value;

  minInput.value = "";
  maxInput.value = "";

  fetch('http://localhost:5050/searcha/' + minValue + '/' + maxValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//search users made after specified user
const searchpostJohnBtn = document.querySelector('#search-postJohn-btn');
searchpostJohnBtn.onclick = function () {
const searchInput = document.querySelector('#search-postJohn-input');
const searchValue = searchInput.value;
  searchInput.value = "";
  fetch('http://localhost:5050/searchAfterJohn/' + searchValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//search users who never signed in
const searchNeverSignedBtn = document.querySelector('#search-neverSigned-btn');
searchNeverSignedBtn.onclick = function () {
  fetch('http://localhost:5050/searchNeverSignedIn')
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//search who registered on the same day as User
const searchSameDayBtn = document.querySelector('#search-sameDay-btn');
searchSameDayBtn.onclick = function () {
  const searchInput = document.querySelector('#search-sameDay-input');
  const searchValue = searchInput.value;
  searchInput.value = "";
  fetch('http://localhost:5050/searchSameDay/' + searchValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

//search who registered today
const searchTodayBtn = document.querySelector('#search-today-btn');
searchTodayBtn.onclick = function () {
  fetch('http://localhost:5050/searchRegisteredToday')
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

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

function deleteRowById(id){
    // debug(id);
    fetch('http://localhost:5050/delete/' + id,
       { 
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementById("table").deleteRow(rowToDelete);
                // location.reload();
             }
         }
    );
}

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


// when the update button on the update interface is clicked
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);
    
    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5050/update',
          {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(
                  {
                    id: idToUpdate,
                    name: updatedNameInput.value
                  }
            )
          }
    ) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
        else 
           debug("no update occurs");
    })
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
    data.forEach(function ({userid, username, password, firstname, lastname, age, salary, registerday, signintime}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${userid}</td>`;
        tableHtml += `<td>${username}</td>`;
        tableHtml += `<td>${password}</td>`;
        tableHtml += `<td>${firstname}</td>`;
        tableHtml += `<td>${lastname}</td>`;
        tableHtml += `<td>${salary}</td>`;
        tableHtml += `<td>${age}</td>`;
        tableHtml += `<td>${new Date(registerday).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-userid="${userid}">Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-userid="${userid}">Edit</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}