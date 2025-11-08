**Project description**

SQL Tables used:

```SQL
CREATE TABLE client (
  clientid INT PRIMARY KEY,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  password VARCHAR(255),
  email VARCHAR(255),
  address VARCHAR(255),
  phonenum VARCHAR(255),
  creditcard VARCHAR(255),
  clientdate DATETIME
);

CREATE TABLE servicereq (
  requestid INT PRIMARY KEY,
  reqaddress VARCHAR(255),
  cleaningtype VARCHAR(255),
  numofrooms INT,
  budget FLOAT,
  servicenotes VARCHAR(255),
  servicestatus BOOL,
  servicedate DATETIME
);

CREATE TABLE order (
  orderid INT PRIMARY KEY,
  typeoforder VARCHAR(255),
  finalprice FLOAT,
  ordernotes VARCHAR(255),
  orderstatus BOOL,
  orderdate DATETIME,
);

CREATE TABLE bill (
  billid INT PRIMARY KEY,
  typeoforder VARCHAR(255),
  finalprice FLOAT,
  discounts FLOAT,
  adjustments FLOAT,
  billnotes VARCHAR(255),
  explanations VARCHAR(255),
  disputes VARCHAR(255),
  ispaid BOOL,
  paydate DATETIME,
  FOREIGN KEY finalprice REFERENCES order
);

CREATE TABLE messages (
  messageid INT PRIMARY KEY,
  servicenotes VARCHAR(255),
  ordernotes VARCHAR(255),
  billnotes VARCHAR(255),
  explanations VARCHAR(255),
  disputes VARCHAR(255),
  messagedate DATETIME,
  FOREIGN KEY servicenotes REFERENCES servicereq,
  FOREIGN KEY ordernotes REFERENCES order,
  FOREIGN KEY billnotes REFERENCES bill,
  FOREIGN KEY explanations REFERENCES bill,
  FOREIGN KEY disputes REFERENCES bill
);
```

**How to run the sample code**
1. We will use the Apache web server. Create the first webpage index.html under ```C:\xampp\htdocs>``` (or similar directory where you installed XAMPP) and point your browser to [http://localhost/index.html](http://localhost/index.html). You should see your first webpage. The purpose of this step is to confirm that the Web server is running, and understand the ROOT URL points to the path location: C:\xampp\htdocs or similar directory in your file system. 
2. At ```C:\xampp\htdocs```, run ```git clone https://github.com/EthanStoneman21/Project1_CSC4710.git``` to copy the whole sample code to the current directory.
3. Now you can access the Frontend via [http://localhost/Project1_CSC4710/Frontend/index.html](http://localhost/Project1_CSC4710/Frontend/index.html).
4. Go the Backend directory ```C:\xampp\htdocs\Project1_CSC4710\Backend```.
5. npm install express mysql cors nodemon dotenv
6. Start the Backend by running ```npm start```.
7. Feel free to access some of the Backend endpoints directly such as [http://localhost:5050/getAll](http://localhost:5050/getAll). You will only receive JSON data without nice rendering. 
8. Now you can interact with the Frontend.
---------------------------------------





