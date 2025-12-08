
// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll', {
      method: "GET",
      credentials: "include"
  })     
    .then(response => response.json())
});

// when the back button is clicked
const backBtn =  document.querySelector('#back-btn');
backBtn.onclick = function (){
            window.location.assign("./clientPage.html");
}


const requestForm = document.getElementById('serviceRequest-form');
requestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const reqaddress = document.getElementById('SR-Address').value;
  const cleaningtype = document.getElementById('SR-cleanType').value;
  const numofrooms = document.getElementById('SR-roomNum').value;
  const servicenotes = document.getElementById('SR-info').value;
  const servicedate = document.getElementById('SR-date').value;
  const budget = document.getElementById('SR-budget').value;
  const servicestatus = "requested";

  const photo1 = document.getElementById('SR-photo1').value;
  const photo2 = document.getElementById('SR-photo2').value;
  const photo3 = document.getElementById('SR-photo3').value;
  const photo4 = document.getElementById('SR-photo4').value;
  const photo5 = document.getElementById('SR-photo5').value;

  if (!reqaddress || !cleaningtype || !numofrooms || !servicedate) {
    alert("Please fill in all required fields");
    return;
  }

console.log("Sending service request...");

  try {
    const response = await fetch("http://localhost:5050/serviceRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({reqaddress, cleaningtype, numofrooms, budget, servicenotes, servicestatus, servicedate, photo1, photo2, photo3, photo4, photo5}),
      credentials: 'include'
    });

    const data = await response.json();
    if (data.success === true) {
      alert("Service request submitted!");
      requestForm.reset();
    } else {
      alert("Request failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});
