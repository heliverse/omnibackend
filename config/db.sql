create db omifi
 CREATE table users( id serial Unique, 
  balance INTEGER  NOT NULL, 
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  password VARCHAR(200), 
  email  VARCHAR(200) NOT NULL,     
  PRIMARY KEY ( id,email ) );
                 


CREATE TABLE transactions (id serial NOT NULL,
amount INTEGER  NOT NULL, 
user_id int NOT NULL, 
status  VARCHAR(100) NOT NULL,
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_id PRIMARY KEY (id), 
CONSTRAINT FK_user_id FOREIGN KEY (user_id)
REFERENCES users (id));