
'use strict';

const extend = require('lodash').assign;
const mysql = require('mysql');
const config = require('./config');

function getConnectionGCloudSql() {
  const options = {
    host: '35.185.43.206',
    user: 'root',
    password: 'qsDFwGKfDEJ4Pkhz',
    database: 'sakila'
  };


  return mysql.createConnection(options);
}

function getCart(limit, token, callback) {
  token = token ? parseInt(token, 10) : 0;
  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `cartItems` LIMIT ? OFFSET ?',
    [limit, token],
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
      const hasMore = results.length === limit ? token + results.length : false;
      callback(null, results, hasMore);
    }
  );
  connection.end();
}

function listUsers(limit, token, callback) {
  token = token ? parseInt(token, 10) : 0;
  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `users` LIMIT ? OFFSET ?',
    [limit, token],
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
      const hasMore = results.length === limit ? token + results.length : false;
      callback(null, results, hasMore);
    }
  );
  connection.end();
}



// [START list]
function list(limit, token, callback) {
  token = token ? parseInt(token, 10) : 0;
  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `film` LIMIT ? OFFSET ?',
    [limit, token],
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
      const hasMore = results.length === limit ? token + results.length : false;
      callback(null, results, hasMore);
    }
  );
  connection.end();
}
// [END list]


function search(searchTerm, callback) {

  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `film` WHERE `'+searchTerm.category+'` LIKE "%'+searchTerm.search+'%";',

    (error, results) => {
      if (error) {

        callback(error);
        return;
      }

      callback(null, results);
    }
  );
  connection.end();
}

function getMovie(film_id, callback) {

  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `film` WHERE `film_id` = ?',
    film_id.film_id,
    (error, results) => {
      if (error) {

        callback(error);
        return;
      }

      callback(null, results);
    }
  );
  connection.end();
}


function getUser(user_id, callback) {

  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `users` WHERE `customer_id` = ?',
    user_id.customer_id,
    (error, results) => {
      if (error) {

        callback(error);
        return;
      }

      callback(null, results);
    }
  );
  connection.end();
}



function updateMovie(movieEdit, callback) {

  const gcloudSqlConnection = getConnectionGCloudSql();

  gcloudSqlConnection.query(
        'UPDATE `film` SET title = "'+movieEdit.title+'", description = "'+movieEdit.description+'", release_year = '+movieEdit.release_year+', rating = "'+movieEdit.rating+'" WHERE film_id = '+movieEdit.film_id+'',
    movieEdit,
    (error, results) => {
     if (error) {

        callback(error);
        return;
      }

      callback(null, results);
    }
  );
  gcloudSqlConnection.end();
}

// [START create]
function registerUser(registerFormData, callback) {
  const gcloudSqlConnection = getConnectionGCloudSql();

    gcloudSqlConnection.query(
      'INSERT INTO `users` SET ?',
      registerFormData,
      (error, response) => {
        //sends error to app.js to display 500 error
        if (error) {
          callback(error);

          return;
        }
        console.log('it worked!');
        console.log(response);
        //from gcloud it is the customer id that is assigned by the server
        read(response.insertcustomer_id, callback);
      }
    );


  gcloudSqlConnection.end();
}


function addMovie(movieData, callback) {
  const gcloudSqlConnection = getConnectionGCloudSql();

    gcloudSqlConnection.query(
      'INSERT INTO `film` (title, description, release_year, language_id, original_language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features ) VALUES ("'+movieData.title+'","'+movieData.description+'","'+movieData.release_year+'",'+1+','+1+','+3+','+movieData.rental_rate+','+movieData.length+','+29.95+',"'+movieData.rating+'", "Trailers")',

(error, response) => {
        //sends error to app.js to display 500 error
        if (error) {
          callback(error);

          return;
        }
        console.log('it worked!');
        console.log(response);
        //from gcloud it is the customer id that is assigned by the server


}
);


  gcloudSqlConnection.end();
}


function loginAuth(loginFormData, callback) {
  const connection = getConnectionGCloudSql();
  var email = loginFormData.email;
  var password = loginFormData.password;
  connection.query(
    'SELECT * FROM `users` WHERE `email` = ? and `password` = ?',
    [email , password],
    (error, results) => {

      if (error) {
        callback(error);
        return;
      }
      if (!results.length) {
        callback({
         error
        });
        return;
      }
      callback(null, results[0]);
    }
  );
  connection.end();
}

function read (id, cb) {
  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `users` WHERE `customer_id` = ?', id, (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      if (!results.length) {
        cb({
          code: 404,
          message: 'Not found'
        });
        return;
      }
      cb(null, results[0]);
    });
  connection.end();
}

// [START update]
function updateUser(userData, callback) {
  const connection = getConnectionGCloudSql();
  console.log("i ran so far");
  connection.query(

    'UPDATE `users` SET fname ="'+userData.fname+'", lname = "'+userData.lname+'", addr = "'+userData.addr+'", email = "'+userData.email+'", password = "'+userData.password+'", ccnum = "'+userData.ccnum+'", expdate = "'+userData.expdate+'" WHERE `customer_id` = '+userData.customer_id+';',

    userData,
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
      callback(null,results);
    }
  );
  connection.end();
}
// [END update]

function deleteUser(customer_id, callback) {
  const connection = getConnectionGCloudSql();
  connection.query(
    'DELETE FROM `users` WHERE `customer_id` ='+customer_id.customer_id+';',
    customer_id,
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
    callback(results);
  }
  );
  connection.end();
}

function deleteMovie(film_id, callback) {
  const connection = getConnectionGCloudSql();
  connection.query(
    'DELETE FROM `film` WHERE `film_id` ='+film_id.film_id+';',
    film_id,
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
    callback(results);
  }

  );
  connection.end();
}

function addToCart(rentalFormDataSQL, callback) {
  const gcloudSqlConnection = getConnectionGCloudSql();

    gcloudSqlConnection.query(
      'INSERT INTO `cartItems` SET ?',
      rentalFormDataSQL,
      (error, response) => {
        //sends error to app.js to display 500 error
        if (error) {
          callback(error);

          return;
        }
        console.log('it worked!');
        console.log(response);

      }
    );

  gcloudSqlConnection.end();
}

function removeFromCart(cartID, callback) {
  const gcloudSqlConnection = getConnectionGCloudSql();

    gcloudSqlConnection.query(
      'DELETE FROM `cartItems` WHERE `cart_id` = '+cartID.cart_id+';',

      (error, response) => {
        //sends error to app.js to display 500 error
        if (error) {
          console.log("error");
          callback(error);

          return;
        }
        console.log('it worked! RAN STATEMENT');
        console.log(response);
        gcloudSqlConnection.end();
              }
            );


        }

module.exports = {
  list: list,
  registerUser: registerUser,
  loginAuth: loginAuth,
  getUser: getUser,
  getMovie: getMovie,
  read: read,
  addToCart: addToCart,
  getCart: getCart,
  removeFromCart: removeFromCart,
  listUsers: listUsers,
  addMovie: addMovie,
  deleteMovie: deleteMovie,
  updateMovie: updateMovie,
  deleteUser: deleteUser,
  search: search,
  updateUser: updateUser,
};
