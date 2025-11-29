// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config(); // read from .env file

let instance = null; 


// if you use .env to configure
console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});


// if you configure directly in this file, there is a security issue, but it will work
/*
const connection = mysql.createConnection({
     host:"localhost",
     user:"root",        
     password:"",
     database:"web_app",
     port:3306
});
*/


connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "users" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "users" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */
    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM client;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }


    async getAllDataservreq(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM servicereq;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }

   async insertNewName(name){
         try{
            const dateAdded = new Date();
            // use await to call an asynchronous function
            const insertId = await new Promise((resolve, reject) => 
            {
               const query = "INSERT INTO users (name, date_added) VALUES (?, ?);";
               connection.query(query, [name, dateAdded], (err, result) => {
                   if(err) reject(new Error(err.message));
                   else resolve(result.insertId);
               });
            });
            console.log(insertId);  // for debugging to see the result of select
            return{
                 id: insertId,
                 name: name,
                 dateAdded: dateAdded
            }
         } catch(error){
               console.log(error);
         }
   }




   async searchByName(name){
        try{
             const dateAdded = new Date();
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = "SELECT * FROM users where username = ?;";
                     connection.query(query, [name], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             );

             // console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

   async deleteRowById(id){
         try{
              id = parseInt(id, 10);
              // use await to call an asynchronous function
              const response = await new Promise((resolve, reject) => 
                  {
                     const query = "DELETE FROM users WHERE userid = ?;";
                     connection.query(query, [id], (err, result) => {
                          if(err) reject(new Error(err.message));
                          else resolve(result.affectedRows);
                     });
                  }
               );

               console.log(response);  // for debugging to see the result of select
               return response === 1? true: false;

         }  catch(error){
              console.log(error);
         }
   }

  
  async updateNameById(id, newName){
      try{
           console.log("dbService: ");
           console.log(id);
           console.log(newName);
           id = parseInt(id, 10);
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
               {
                  const query = "UPDATE client SET firstname = ? WHERE userid = ?;";
                  connection.query(query, [newName, id], (err, result) => {
                       if(err) reject(new Error(err.message));
                       else resolve(result.affectedRows);
                  });
               }
            );

            // console.log(response);  // for debugging to see the result of select
            return response === 1? true: false;
      }  catch(error){
         console.log(error);
      }
  }

  async registerClient(clientid, firstname, lastname, password, email, address, phonenum, creditcard, clientdate) {
   try {
     const hashedPassword = await bcrypt.hash(password, 10);
     const result = await new Promise((resolve, reject) => {
       const query = `
         INSERT INTO client (clientid, firstname, lastname, password, email, address, phonenum, creditcard, clientdate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
       `;
       connection.query(
         query,
         [clientid, firstname, lastname, hashedPassword, email, address, phonenum, creditcard, clientdate],
         (err, result) => {
           if (err) reject(err);
           else resolve(result);
         }
       );
     });
 
     return result;
   } catch (err) {
     console.error("Register error:", err);
     throw err;
   }
 } 

 async loginUser(email, password) {
   try {
     const client = await new Promise((resolve, reject) => {
       const query = "SELECT * FROM client WHERE email = ?;";
       connection.query(query, [email], (err, results) => {
         if (err) reject(err);
         else if (results.length === 0) resolve(null);
         else resolve(results[0]);
       });
     });
 
     if (!client) return { success: false, message: "User not found" };
 
     const isMatch = await bcrypt.compare(password, client.password);
     if (!isMatch) return { success: false, message: "Incorrect password" };
 
     return {
       success: true,
       clientid: client.clientid,
       message: "Login successful",
       user: {
         firstname: client.firstname,
         lastname: client.lastname,
         password: client.password,
         email: client.email,
         address: client.address,
         phonenum: client.phonenum,
         creditcard: client.creditcard,
         clientdate: client.clientdate
       }
     };
   } catch (err) {
     console.error("Login error:", err);
     return { success: false, message: "An error occurred during login" };
   }
 }

 async serviceRequest(requestid, clientid, reqaddress, cleaningtype, numofrooms, budget, servicenotes, servicestatus, servicedate) {
   try {
     const result = await new Promise((resolve, reject) => {
       const query = `
         INSERT INTO servicereq (requestid, clientid, reqaddress, cleaningtype, numofrooms, budget, servicenotes, servicestatus, servicedate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
       `;
       connection.query(
         query,
         [requestid, clientid, reqaddress, cleaningtype, numofrooms, budget, servicenotes, servicestatus, servicedate],
         (err, result) => {
           if (err) reject(err);
           else resolve(result);
         }
       );
     });
 
     return result;
   } catch (err) {
     console.error("Request Error:", err);
     throw err;
   }
 } 

 //reject method
 async serviceReject(messageid, requestid, messagebody, messagedate) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query1 = `
        UPDATE servicereq
        SET servicestatus = 0
        WHERE requestid = ?;
      `;
      const query2 = `
        INSERT INTO messages (messageid, requestid, messagebody, messagedate)
        VALUES (?, ?, ?, ?);
      `;

      //run both queries
      connection.query(query1, [requestid], (err) => {
        if (err) reject(err);

      connection.query(
        query2,
        [messageid, requestid, messagebody, messagedate],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
      });
    });
  });

    return result;
  } catch (err) {
    console.error("Request Error:", err);
    throw err;
  }
} 

//response method
async serviceResponse(requestid, adjustedPrice, timeWindow, note) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages (messageid, requestid, messagebody, messagedate)
        VALUES (?, ?, ?, ?);
      `;

      const messageid = crypto.randomUUID();
      const messageBody = `Quote proposed = Price: $${adjustedPrice}, Time: ${timeWindow}, Note: ${note}`;

      connection.query(
        query,
        [messageid, requestid, messageBody],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return result;
  } catch (err) {
    console.error("Quote Error:", err);
    throw err;
  }
}

//client accepts work in progress
async clientAccepts(messageid, requestid, messagebody, messagedate) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query1 = `
        UPDATE servicereq
        SET servicestatus = 1
        WHERE requestid = ?;
      `;
      const query2 = `
        INSERT INTO orders (messageid, requestid, messagebody, messagedate)
        VALUES (?, ?, ?, ?);
      `;

      //run both queries
      connection.query(query1, [requestid], (err) => {
        if (err) reject(err);

      connection.query(
        query2,
        [messageid, requestid, messagebody, messagedate],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
      });
    });
  });

    return result;
  } catch (err) {
    console.error("Request Error:", err);
    throw err;
  }
} 

//client renegotiates work in progress
async clientRenogotiate(requestid, note) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages (messageid, requestid, messagebody, messagedate)
        VALUES (?, ?, ?, ?);
      `;

      const messageid = crypto.randomUUID();
      const messageBody = `Counter note ${note}`;

      connection.query(
        query,
        [messageid, requestid, messageBody],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return result;
  } catch (err) {
    console.error("Quote Error:", err);
    throw err;
  }
}

}
module.exports = DbService;