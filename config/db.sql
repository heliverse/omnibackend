create db omifi
 CREATE table users(id serial Unique, 
  balance INTEGER  NOT NULL, 
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  password VARCHAR(200), 
  email  VARCHAR(200) NOT NULL,
  Is_authenticated VARCHAR(100) NOT NULL ,  
  Last_transactions_time TIMESTAMP,
  status  BOOLEAN,
  Role_type VARCHAR(200) NOT NULL,
  interest VARCHAR(200) NOT NULL,
  isConfirmed BOOLEAN,
  PRIMARY KEY ( id,email ) );
                 
              
CREATE TABLE transactions (id serial NOT NULL,
amount INTEGER  NOT NULL, 
user_id int NOT NULL, 
status  VARCHAR(100) NOT NULL,
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id), 
FOREIGN KEY (user_id) REFERENCES users (id));



  CREATE table Admin( id serial Unique, 

  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  password VARCHAR(200), 
  email  VARCHAR(200) NOT NULL,
  Is_authenticated VARCHAR(100) NOT NULL , 
  status  BOOLEAN,
  isConfirmed BOOLEAN,
  PRIMARY KEY ( id,email ) );
