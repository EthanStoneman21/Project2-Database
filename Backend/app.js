// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
const session = require('express-session');
const crypto = require('crypto');
dotenv.config()

const app = express();

const dbService = require('./dbService');

app.use(cors({
    origin: ["http://localhost", "http://127.0.0.1:5500"],
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));



// create
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});




// read 
app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// getAll servicereq
app.get('/getAllservreq', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllDataservreq(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// getAll orders
app.get('/getAllOrders', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllOrders(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// getAll orders
app.get('/getAllCounterMessages', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllCounterMessages(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// get frequent clients
app.get('/getFrequentClients', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getFrequentClients(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// get uncommitted clients
app.get('/getUncommittedClients', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getUncommittedClients(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{userid, name} = request.body;
          console.log(userid);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(userid, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// register
app.post('/register', async (request, response) => {
    const { firstname, lastname, password, email, address, phonenum, creditcard, clientdate } = request.body;

    if (!firstname || !password) {
        return response.status(400).json({ error: "Firstname and password are required" });
    }

    console.log("Received registration:", request.body);

    try {
        const db = dbService.getDbServiceInstance();
        const clientid = crypto.randomUUID();

        // Fetch the newly registered user's data
        const newClient = await db.registerClient(
            clientid,
            firstname,
            lastname,
            password,
            email,
            address,
            phonenum,
            creditcard,
            clientdate
        );

        response.json({ success: true, client: newClient });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
});

//login
app.post('/login', async(request, response) => {
    const {email, password} = request.body;

    //validation
    if(!email || !password) {
        return response.status(400).json({error: "Email and password are required"});
    }

    try {
        const db = dbService.getDbServiceInstance();
        const result = await db.loginUser(email, password);

        if (result.success) {
            request.session.clientid = result.clientid;
            console.log("Session clientid set:", request.session.clientid); // Debug log
            response.status(200).json({ success: true, clientid: result.clientid });
        }
        else {
            response.status(401).json(result); //failure
        }
    }catch (err) {
            console.error(err);
            response.status(500).json({error: "error logging in"});
        }
    }
);

// logout
app.post('/logout', (request, response) => {
    request.session.destroy(err => {
        if (err) {
            return response.status(500).json({ error: "Logout failed" });
        }
        response.json({ success: true });
    });
});


app.post('/serviceRequest', async (req, res) => {
  try {

    console.log("Session object:", req.session); // debug
    const { reqaddress, cleaningtype, numofrooms, budget, servicenotes, servicestatus, servicedate } = req.body;

    const clientid = req.session.clientid;
    console.log("Session clientid:", req.session.clientid);
    const requestid = crypto.randomUUID();


    const db = dbService.getDbServiceInstance();
    const result = await db.serviceRequest(
      requestid,
      clientid,
      reqaddress,
      cleaningtype,
      numofrooms,
      budget,
      servicenotes,
      servicestatus,
      servicedate
    );

    res.json({ success: true, id: result.requestid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//servicereject
app.post('/serviceReject', async (req, res) => {
    try {
        console.log("Session data:", req.session); // Log session data

        const { messageid, requestid, messagebody } = req.body;
        const clientid = req.session.clientid;
    
        const db = dbService.getDbServiceInstance();
        const servicereq = await db.getServiceRequestById(requestid);
        console.log("Service request data:", servicereq); // Log database query result
    
        const recipientid = servicereq.client;
    
        const result = await db.serviceReject(
          messageid,
          clientid,
          recipientid,
          requestid,
          messagebody
        );
    
        res.json({ success: true, id: result.insertId });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
      }
  });

  //service quote
app.post('/servicequote', async (req, res) => {
    try {
        console.log("Session data:", req.session); // Log session data

        const { requestid, adjustedPrice, timeWindow, note } = req.body;
        const clientid = req.session.clientid;

        if (!clientid) {
            return res.status(400).json({ success: false, error: "Client ID is missing in session" });
        }

        const db = dbService.getDbServiceInstance();
        const servicereq = await db.getServiceRequestById(requestid);
        console.log("Service request data:", servicereq); // Log database query result

        if (!servicereq || !servicereq.clientid) {
            return res.status(400).json({ success: false, error: "Invalid request ID or missing client ID in service request" });
        }

        const recipientid = servicereq.clientid;

        const result = await db.serviceResponse(
            requestid,
            clientid,
            recipientid,
            adjustedPrice,
            timeWindow,
            note
        );

        res.json({ success: true, id: result.insertId || requestid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});


  //serviceaccept
  app.post('/serviceaccept', async (req, res) => {
    try {
        const { requestid, finalprice, ordernotes } = req.body;
        const orderid = crypto.randomUUID();
    
        const db = dbService.getDbServiceInstance();

        const result = await db.createServiceOrder(
            orderid,
            requestid,
            finalprice,
            ordernotes
        );
    
        res.json({ success: true, id: result.insertId || requestid});
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

//serviceservicecounter
  app.post('/servicecounter', async (req, res) => {
    try {
        const { requestid, note } = req.body;
        const clientid = req.session.clientid;
        const messageid = crypto.randomUUID();
    
        const db = dbService.getDbServiceInstance();

        const result = await db.serviceCounter(
            messageid,
            clientid,
            requestid,
            note,
            new Date().toISOString()
        );
    
        res.json({ success: true, id: result.insertId || requestid});
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

    //show annas messages
    app.get('/getAnnaMessages', async (req, res) => {
        try {
            const clientid = req.session.clientid;
            const db = dbService.getDbServiceInstance();
            const result = await db.getMessagesBetween('c67ebd4f-5d8c-4790-88d6-db7430af4730', clientid);
            res.json({ success: true, data: result });
            } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

    //complete order
    app.post('/completeOrder', async (req, res) => {
        try {
            const { orderid, typeoforder, finalprice, billnotes } = req.body;

        if (!orderid || !finalprice) {
            return res.status(400).json({ success: false, error: "Order ID and final price are required" });
        }

        const db = dbService.getDbServiceInstance();
        const result = await db.completeOrder(orderid, typeoforder, finalprice, billnotes);

        res.json({ success: true, id: result.insertId || orderid });
            } catch (err) {
            console.error("Complete Order Error:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

  

// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);