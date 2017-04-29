

USE sakila;

CREATE TABLE cartItems (

 cart_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
 customer_id int,
 film_id varchar(50),
 title varchar(50),
 description varchar(255),
 rental_rate varchar(50),
 category varchar(50),
 PRIMARY KEY (cart_id)
);
