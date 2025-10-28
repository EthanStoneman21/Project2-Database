// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
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


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// Search by First Name
app.get('/searchf/:firstname', (request, response) => { // we can debug by URL
    
    const {firstname} = request.params;
    
    console.log(firstname);

    const db = dbService.getDbServiceInstance();

    let result;
    if(firstname === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByFirstName(firstname); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// Search by userid
app.get('/searchu/:userid', (request, response) => { // we can debug by URL
    
    const {userid} = request.params;
    
    console.log(userid);

    const db = dbService.getDbServiceInstance();

    let result;
    if(userid === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByUserId(userid); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

  // Search by salary where salary is between x and y inclusively
app.get('/searchs/:x/:y', (request, response) => { // we can debug by URL
    
    const {x, y} = request.params;
    
    console.log(x);
    console.log(y);

    const min = parseFloat(x);
    const max = parseFloat(y);

    const db = dbService.getDbServiceInstance();
    result = db.searchSalaries(min, max); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

  // Search by age where age is between x and y inclusively
  app.get('/searcha/:x/:y', (request, response) => { // we can debug by URL
    
    const {x, y} = request.params;
    
    console.log(x);
    console.log(y);

    const min = parseInt(x);
    const max = parseInt(y);

    const db = dbService.getDbServiceInstance();
    result = db.searchAges(min, max); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// made after specified user
app.get('/searchAfterJohn/:username', async (req, res) => {

    const { username } = req.params;
    
        
        const db = dbService.getDbServiceInstance();

        const johnResult = await db.getUserIdByUsername(username);
        const johnId = johnResult[0].userid;
        const result = await db.getUsersAfterId(johnId);

        res.json({ data: result });
    
});

app.get('/searchSameDay/:username', async (req, res) => {
    const { username } = req.params;
        const db = dbService.getDbServiceInstance();

        const johnResult = await db.getJohnDate(username);
        const johnDay = johnResult[0].registerday;
        const result = await db.getSameDayUsers(johnDay);

        res.json({ data: result });
    
});

app.get('/searchNeverSignedIn', async (req, res) => {
    try {
        const db = dbService.getDbServiceInstance();
        const result = await db.getUsersNeverSignedIn();
        res.json({ data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Search for users who registered today
app.get('/searchRegisteredToday', async (req, res) => {
    try {
        const db = dbService.getDbServiceInstance();
        const result = await db.getUsersRegisteredToday();
        res.json({ data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
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

// delete service
app.delete('/delete/:userid', 
     (request, response) => {     
        const {userid} = request.params;
        console.log("delete");
        console.log(userid);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(userid);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

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
    const { username, password, firstname, lastname, age, salary } = request.body;

    if (!username || !password) {
        return response.status(400).json({ error: "Username and password are required" });
    }

    console.log("Received registration:", request.body);

    try {
        const db = dbService.getDbServiceInstance();
        const result = await db.registerUser(username, password, firstname, lastname, age, salary);

        // Fetch the newly registered user's data
        const newUser = {
            userid: result.insertId,
            username,
            firstname,
            lastname,
            age,
            salary,
            registerday: new Date().toISOString(), // Current date
            signintime: null // No sign-in yet
        };

        response.json({ success: true, user: newUser });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
});

//login
app.post('/login', async(request, response) => {
    const {username, password} = request.body;

    //validation
    if(!username || !password) {
        return response.status(400).json({error: "Username and password are required"});
    }

    try {
        const db = dbService.getDbServiceInstance();
        const result = await db.loginUser(username, password);

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