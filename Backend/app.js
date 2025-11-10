// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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
            response.status(200).json(result); //success
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