
// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

/*
What is a Promise in Javascript? 

A Promise can be in one of three states:

    - Pending: The initial state; the promise is neither fulfilled nor rejected.

    - Fulfilled: The operation completed successfully, and the promise has a 
      resulting value.

    - Rejected: The operation failed, and the promise has a reason for the failure.

Promises have two main methods: then and catch.

    - The then method is used to handle the successful fulfillment of a promise. 
    It takes a callback function that will be called when the promise is resolved, 
    and it receives the resulting value.

    - The catch method is used to handle the rejection of a promise. It takes a 
    callback function that will be called when the promise is rejected, and it 
    receives the reason for the rejection.

What is a promise chain? 
    The Promise chain starts with some asyncOperation1(), which returns a promise, 
    and each subsequent ``then`` is used to handle the result of the previous Promise.

    The catch is used at the end to catch any errors that might occur at any point 
    in the chain.

    Each then returns a new Promise, allowing you to chain additional ``then`` calls to 
    handle subsequent results.

What is an arrow function?

    An arrow function in JavaScript is a concise way to write anonymous function 
    expressions.

    Traditional function syntax: 
        const add = function(x, y) {
           return x + y;
        };

    Arrow function syntax:
        const add = (x, y) => x + y;
    
    
Arrow functions have a few notable features:

    - Shorter Syntax: Arrow functions eliminate the need for the function keyword, 
      curly braces {}, and the return keyword in certain cases, making the syntax 
      more concise.

    - Implicit Return: If the arrow function consists of a single expression, it is 
      implicitly returned without needing the return keyword.

    - Lexical this: Arrow functions do not have their own this context; instead, they 
      inherit this from the surrounding code. This can be beneficial in certain situations,
      especially when dealing with callbacks and event handlers.
*/


// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll')     
    .then(response => response.json())
});

   // Registration handler
const regForm = document.getElementById('register-form');
regForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const firstname = document.getElementById('reg-firstname').value;
  const lastname = document.getElementById('reg-lastname').value;
  const age = document.getElementById('reg-age').value;
  const salary = document.getElementById('reg-salary').value;

  if (!username || !password) {
    alert("Username and password are required");
    return;
  }

  console.log("Sending registration request...");

  try {
    const response = await fetch("http://localhost:5050/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, firstname, lastname, age, salary })
    });

    const data = await response.json();
    if (data.success === true) {
      alert("Registration successful! Please log in.");
      regForm.reset();
    } else {
      alert("Registration failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});

    // Login handler
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      if (!username || !password) {
        alert("Username and password are required");
        return;
      }

      try {
        const response = await fetch("http://localhost:5050/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (data.success === true || data.success === "true") {
          alert("Login successful!");
          window.location.assign("./names.html");
        } else {
          alert("Login failed: " + (data.message || "Unknown error"));
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server");
      }
    });