**Project description**

SQL Tables used:

```SQL
CREATE TABLE client (
  clientid VARCHAR(36) PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(255) NOT NULL,
  phonenum VARCHAR(255) NOT NULL,
  creditcard VARCHAR(255) NOT NULL,
  clientdate DATETIME
);

CREATE TABLE servicereq (
  requestid VARCHAR(36) PRIMARY KEY,
  clientid VARCHAR(36),
  reqaddress VARCHAR(255) NOT NULL,
  cleaningtype VARCHAR(255) NOT NULL,
  numofrooms INT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  servicenotes VARCHAR(500),
  servicestatus BOOL,
  servicedate DATETIME,
  FOREIGN KEY (clientid) REFERENCES client(clientid)
);

CREATE TABLE photos (
  clientid VARCHAR(36) PRIMARY KEY,
  photo1 VARCHAR(255),
  photo2 VARCHAR(255),
  photo3 VARCHAR(255),
  photo4 VARCHAR(255),
  photo5 VARCHAR(255),
  FOREIGN KEY (clientid) REFERENCES client(clientid)
);

CREATE TABLE orders (
  orderid VARCHAR(36) PRIMARY KEY,
  requestid VARCHAR(36),
  typeoforder VARCHAR(255) NOT NULL,
  finalprice DECIMAL(10,2) NOT NULL,
  ordernotes VARCHAR(500),
  orderstatus BOOL,
  orderdate DATETIME,
  FOREIGN KEY (requestid) REFERENCES servicereq(requestid)
);

CREATE TABLE bill (
  billid VARCHAR(36) PRIMARY KEY,
  orderid VARCHAR(36),
  typeoforder VARCHAR(255) NOT NULL,
  finalprice DECIMAL(10,2) NOT NULL,
  discounts DECIMAL(10,2),
  adjustments DECIMAL(10,2),
  billnotes VARCHAR(500),
  explanations VARCHAR(500),
  disputes VARCHAR(500),
  ispaid BOOL,
  paydate DATETIME,
  FOREIGN KEY (orderid) REFERENCES orders(orderid)
);

CREATE TABLE messages (
  messageid VARCHAR(36) PRIMARY KEY,
  requestid VARCHAR(36),
  orderid VARCHAR(36),
  billid VARCHAR(36),
  messagebody VARCHAR(500),
  messagedate DATETIME,
  FOREIGN KEY (requestid) REFERENCES servicereq(requestid),
  FOREIGN KEY (orderid) REFERENCES orders(orderid),
  FOREIGN KEY (billid) REFERENCES bill(billid)
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





