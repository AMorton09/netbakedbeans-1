
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
// [END create]

function loginAuth(loginFormData, callback) {
  const connection = getConnectionGCloudSql();
  var email = loginFormData.email;
  var password = loginFormData.password;
  connection.query(
    'SELECT * FROM `users` WHERE `email` = ? and password = ?',
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
      callback(null, results);
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
function update(customer_id, data, callback) {
  const connection = getConnectionGCloudSql();
  connection.query(
    'UPDATE `users` SET ? WHERE `customer_id` = ?',
    [data, customer_id],
    error => {
      if (error) {
        callback(error);
        return;
      }
      read(customer_id, callback);
    }
  );
  connection.end();
}
// [END update]

function _delete(customer_id, callback) {
  const connection = getConnectionGCloudSql();
  connection.query(
    'DELETE FROM `users` WHERE `customer_id` = ?',
    customer_id,
    callback
  );
  connection.end();
}

module.exports = {
  list: list,
  registerUser: registerUser,
  loginAuth: loginAuth,
  update: update,
  delete: _delete,
  read: read,
};
