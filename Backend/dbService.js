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

async getAllOrders(){
  try{
     // use await to call an asynchronous function
     const response = await new Promise((resolve, reject) => 
        {
            const query = "SELECT * FROM orders;";
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

async getAllCounterMessages(){
  try{
     // use await to call an asynchronous function
     const response = await new Promise((resolve, reject) => 
        {
            const query = `SELECT * 
                           FROM messages
                           WHERE counternote IS NOT NULL;`;
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

async getFrequentClients(){
  try{
     // use await to call an asynchronous function
     const response = await new Promise((resolve, reject) => 
        {
            const query = `SELECT firstname, lastname
                            FROM client
                            WHERE clientid IN (
                                SELECT clientid
                                FROM MostOrders
                                WHERE NUM = (SELECT MAX(NUM) FROM MostOrders)
                            );`;
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

async getUncommittedClients(){
  try{
     // use await to call an asynchronous function
     const response = await new Promise((resolve, reject) => 
        {
            const query = `SELECT c.firstname, c.lastname, COUNT(s.requestid) AS total_requests
                            FROM client c, servicereq s
                            WHERE c.clientid = s.clientid
                              AND s.requestid NOT IN (
                                SELECT requestid 
                                FROM orders
                                WHERE orderstatus = 1)
                            GROUP BY c.firstname, c.lastname
                            HAVING COUNT(s.requestid) >= 3;`;
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

async getProspectiveClients(){
  try{
     // use await to call an asynchronous function
     const response = await new Promise((resolve, reject) => 
        {
            const query = `SELECT DISTINCT c.firstname, c.lastname
                            FROM client c, servicereq s
                            WHERE c.clientid NOT IN (
                                SELECT s.clientid
                                FROM servicereq s
                            )
                            AND c.clientid <>'c67ebd4f-5d8c-4790-88d6-db7430af4730';`;
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

async getLargestJobs(){
  try{
     // use await to call an asynchronous function
     const response = await new Promise((resolve, reject) => 
        {
            const query = `SELECT s.requestid, s.numofrooms, s.servicedate
                            FROM servicereq s, orders o
                            WHERE s.requestid = o.requestid AND o.orderstatus = 1
                              AND s.numofrooms = (
                                  SELECT MAX(s2.numofrooms)
                                  FROM servicereq s2, orders o2
                                  WHERE s2.requestid = o2.requestid
                                  AND o2.orderstatus = 1
                            );`;
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


async getServiceRequestById(requestid) {
  try {
      const result = await new Promise((resolve, reject) => {
          const query = `
              SELECT *
              FROM servicereq
              WHERE requestid = ?;
          `;
          connection.query(query, [requestid], (err, results) => {
              if (err) reject(err);
              else resolve(results[0]); // Ensure we return the first result
          });
      });

      console.log("getServiceRequestById result:", result); // Debugging log
      return result;
  } catch (err) {
      console.error("getServiceRequestById Error:", err);
      throw err;
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
 async serviceReject(messageid, clientid, recipientid, requestid, messagebody) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query1 = `
        UPDATE servicereq
        SET isRejected = 1
        WHERE requestid = ?;
      `;
      const query2 = `
        INSERT INTO messages (messageid, clientid, recipientid, messagebody, messagedate)
        VALUES (?, ?, ?, ?, NOW());
      `;

      //run both queries
      connection.query(query1, [requestid], (err) => {
        if (err) reject(err);

      connection.query(
        query2,
        [messageid, clientid, recipientid, messagebody],
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
async serviceResponse(requestid, clientid, recipientid, adjustedPrice, timeWindow, note) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages (messageid, clientid, recipientid, requestid, adjustedPrice, messagebody, messagedate)
        VALUES (?, ?, ?, ?, ?, ?, NOW());
      `;

      const messageid = crypto.randomUUID();
      const messageBody = `Quote proposed = Time: ${timeWindow}, Note: ${note}`;

      connection.query(
        query,
        [messageid, clientid, recipientid, requestid, adjustedPrice, messageBody],
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

async createServiceOrder(orderid, requestid, finalprice, ordernotes) {
  try {
    const servicereq = await this.getServiceRequestById(requestid);
    if (!servicereq) {
      throw new Error(`Service request ${requestid} not found`);
    };
    const typeoforder = servicereq.cleaningtype;
    console.log("servicereq:", servicereq);


    const result = await new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO orders (orderid, requestid, typeoforder, finalprice, ordernotes, orderstatus, orderdate)
        VALUES (?, ?, ?, ?, ?, ?, NOW());
      `;
      const updateQuery = `
        UPDATE servicereq
        SET servicestatus = 1
        WHERE requestid = ?;
      `;

      // run both queries in sequence
      connection.query(insertQuery,
        [orderid, requestid, typeoforder, finalprice, ordernotes, false],
        (err, insertResult) => {
          if (err) return reject(err);

          connection.query(updateQuery, [requestid], (err) => {
            if (err) return reject(err);
            resolve(insertResult);
          });
        }
      );
    });

    return result;
  } catch (err) {
    console.error("Order Error:", err);
    throw err;
  }
}


async serviceCounter(messageid, clientid, requestid, counternote, messagedate) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages (messageid, clientid,requestid, counternote, messagedate)
        VALUES (?, ?, ?, ?, ?);
      `;

      connection.query(
        query,
        [messageid, clientid, requestid, counternote, messagedate],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return result;
  } catch (err) {
    console.error("Counter Error:", err);
    throw err;
  }
}

async getMessagesBySender(clientid) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT messageid, requestid, messagebody, messagedate, recipientid
        FROM messages
        WHERE clientid = ?;
      `;
      connection.query(query, [clientid], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getMessagesBySender Error:", err);
    throw err;
  }
}

async getMessagesAccepted(clientid, recipientid) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT requestid, adjustedPrice, messagebody, messagedate
        FROM messages
        WHERE clientid = ? AND recipientid = ? AND requestid IS NOT NULL;
      `;
      connection.query(query, [clientid, recipientid], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getMessagesAccepted Error:", err);
    throw err;
  }
}

async getMessagesRejected(clientid, recipientid) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT messagebody, messagedate
        FROM messages
        WHERE clientid = ? AND recipientid = ? AND requestid IS NULL;
      `;
      connection.query(query, [clientid, recipientid], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getMessagesRejected Error:", err);
    throw err;
  }
}

async getClientIdByRequestId(requestid) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `SELECT clientid FROM servicereq WHERE requestid = ?;`;
      connection.query(query, [requestid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]?.clientid);
      });
    });
    return result;
  } catch (err) {
    console.error("getClientIdByRequestId Error:", err);
    throw err;
  }
}

async getAcceptedQuotesByMonthYear(year, month) {
  try {
    const result = await new Promise((resolve, reject) => {
      //date rollover
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      //format correct YYYY-MM-DD
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const query = `
      SELECT o.orderid, o.requestid, o.orderdate, s.servicedate
      FROM orders o, servicereq s
      WHERE o.requestid = s.requestid
        AND o.orderdate >= ?
        AND o.orderdate < ?;
    `;
      connection.query(query, [start, end], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return result;
  } catch (err) {
    console.error("getAcceptedQuotesByMonthYear Error:", err);
    throw err;
  }
}

async completeOrder(orderid, typeoforder, finalprice, billnotes) {
  try {
    const billid = crypto.randomUUID();

    // Find the requestid and clientid
    const requestQuery = `SELECT requestid FROM orders WHERE orderid = ?;`;
    const requestRow = await new Promise((resolve, reject) => {
      connection.query(requestQuery, [orderid], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });

    const clientid = await this.getClientIdByRequestId(requestRow.requestid);


    const result = await new Promise((resolve, reject) => {
      //create bill
      const query = `
        INSERT INTO bill (billid, orderid, clientid, typeoforder, finalprice, billnotes, billdate)
        VALUES (?, ?, ?, ?, ?, ?, NOW());
      `;

      //update order status
      const query2 = `
        UPDATE orders
        SET orderstatus = 1
        WHERE orderid = ?;
      `;

      connection.query(
        query,
        [billid, orderid, clientid, typeoforder, finalprice, billnotes],
        (err, insertresult) => {
          if (err) reject(err);

      connection.query(
        query2,
        [orderid],
        (err, result) => {
          if (err) reject(err);
          else resolve({insertresult, result});
        }
      );
    }
  );
    });

    return result;
  } catch (err) {
    console.error("Complete Order Error:", err);
    throw err;
  }
}


// gets logged in client's bills
async getAllBillsForClient(clientid) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT billid, orderid, finalprice, billnotes, billdate
        FROM bill
        WHERE clientid = ?;
      `;
      connection.query(query, [clientid], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getAllBillsForClient Error:", err);
    throw err;
  }
}

// gets all unpayed bills
async getUnpayedBills() {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT billid, orderid, clientid, finalprice, billnotes, billdate
        FROM bill
        WHERE ispaid IS NULL;
      `;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getUnpayedBills Error:", err);
    throw err;
  }
}


//marks bill as paid
async payBill(billid) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        UPDATE bill
        SET ispaid = 1,
            paydate = NOW()
        WHERE billid = ?;
      `;
      connection.query(query, [billid], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return result;
  } catch (err) {
    console.error("payBill Error:", err);
    throw err;
  }
}


async disputeBill(billid, disputes) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        UPDATE bill
        SET disputes = ?
        WHERE billid = ?;
      `;
      connection.query(query, [disputes, billid], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return result;
  } catch (err) {
    console.error("disputeBill Error:", err);
    throw err;
  }
}


async getDisputedBills() {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT billid, orderid, finalprice, billnotes, billdate, disputes
        FROM bill
        WHERE disputes IS NOT NULL AND ispaid IS NULL;
      `;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getDisputedBills Error:", err);
    throw err;
  }
}


// anna edit for disputes
async editBill(billid, discounts, finalprice, explanations) {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        UPDATE bill
        SET discounts = ?, 
            finalprice = ?, 
            explanations = ?
        WHERE billid = ?;
      `;
      connection.query(
        query,
        [discounts, finalprice, explanations, billid],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    return result;
  } catch (err) {
    console.error("editBill Error:", err);
    throw err;
  }
}

// get paid bills
async getPaidBills() {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT billid, orderid, clientid, finalprice, typeoforder, billnotes, billdate, paydate
        FROM bill
        WHERE ispaid = 1;
      `;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getPaidBills Error:", err);
    throw err;
  }
}

// get overdue bills
async getOverdueBills() {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT billid, orderid, finalprice, billnotes, billdate
        FROM bill
        WHERE ispaid IS NULL
          AND billdate < DATE_SUB(NOW(), INTERVAL 7 DAY);
      `;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getOverdueBills Error:", err);
    throw err;
  }
}

// get bad clients
async getBadClients() {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT DISTINCT c.firstname, c.lastname
        FROM client c
        JOIN bill b ON c.clientid = b.clientid
        WHERE b.ispaid IS NULL
          AND b.billdate < DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND c.clientid NOT IN (
            SELECT clientid
            FROM bill
            WHERE ispaid = 1
          );
      `;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getBadClients Error:", err);
    throw err;
  }
}

// get good clients
async getGoodClients() {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
        SELECT DISTINCT c.firstname, c.lastname
        FROM client c
        WHERE NOT EXISTS (
          SELECT 1
          FROM bill b
          WHERE b.clientid = c.clientid
            AND b.ispaid = 1
            AND TIMESTAMPDIFF(HOUR, b.billdate, b.paydate) > 24
        )
        AND EXISTS (
          SELECT 1
          FROM bill b2
          WHERE b2.clientid = c.clientid
            AND b2.ispaid = 1
        );
      `;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return result;
  } catch (err) {
    console.error("getGoodClients Error:", err);
    throw err;
  }
}

// insert photos for service request
async insertPhotos(requestid, photo1, photo2, photo3, photo4, photo5) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO photos (requestid, photo1, photo2, photo3, photo4, photo5)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [requestid, photo1, photo2, photo3, photo4, photo5],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}







}
module.exports = DbService;