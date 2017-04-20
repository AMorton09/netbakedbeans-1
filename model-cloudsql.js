// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

  //options.socketPath = config.get('INSTANCE_CONNECTION_NAME');

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
          //logs error in console for debugging
          console.log(error);
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

function read(customer_id, callback) {
  const connection = getConnectionGCloudSql();
  connection.query(
    'SELECT * FROM `users` WHERE `customer_id` = ?',
    customer_id,
    (error, results) => {
      if (error) {
        callback(error);
        return;
      }
      if (!results.length) {
        callback({
          code: 404,
          message: 'Not found'
        });
        return;
      }
      callback(null, results[0]);
    }
  );
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
  read: read,
  update: update,
  delete: _delete
};
