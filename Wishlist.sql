USE sakila;

CREATE TABLE wish_list (
 
 wish_list_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
 film_id varchar(50),
 title varchar(50),
 description varchar(256),
 rental_rate varchar(50),
 category varchar(50),
  PRIMARY KEY  (wish_list_id)
);
