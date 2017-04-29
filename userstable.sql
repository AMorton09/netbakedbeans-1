USE sakila;

CREATE TABLE users (
 customer_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
 fname varchar(50),
 lname varchar(50),
 addr varchar(50),
 email varchar(50),
 password varchar(50),
 ccnum varchar(50),
 expdate varchar(50),
 ccv varchar(50),
 admin int,
 rentedmovies int NOT NULL DEFAULT 0,
 PRIMARY KEY  (customer_id)
);