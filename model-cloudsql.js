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

function getConnection () {
  const options = {
    host: "35.185.43.206",
    user: "root",
    password: "qsDFwGKfDEJ4Pkhz",
    database: 'sakila'
    
  };

  //options.socketPath = config.get('INSTANCE_CONNECTION_NAME');

  return mysql.createConnection(options);
}

// [START list]
function list (limit, token, cb) {
  token = token ? parseInt(token, 10) : 0;
  const connection = getConnection();
  connection.query(
    'SELECT * FROM `users` LIMIT ? OFFSET ?', [limit, token],
    (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      const hasMore = results.length === limit ? token + results.length : false;
      cb(null, results, hasMore);
    }
  );
  connection.end();
}
// [END list]

// [START create]
function create (data, cb) {
  const connection = getConnection();
  connection.query('INSERT INTO users SET ?', data, (err, res) => {
    if (err) {
      cb(err);
      console.log(err);                  
      return;
    }
    read(res.insertcustomer_id, cb);
  });
  connection.end();
}
// [END create]

function read (customer_id, cb) {
  const connection = getConnection();
  connection.query(
    'SELECT * FROM `users` WHERE `customer_id` = ?', customer_id, (err, results) => {
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
function update (customer_id, data, cb) {
  const connection = getConnection();
  connection.query(
    'UPDATE `users` SET ? WHERE `customer_id` = ?', [data, customer_id], (err) => {
      if (err) {
        cb(err);
        return;
      }
      read(customer_id, cb);
    });
  connection.end();
}
// [END update]

function _delete (customer_id, cb) {
  const connection = getConnection();
  connection.query('DELETE FROM `users` WHERE `customer_id` = ?', customer_id, cb);
  connection.end();
}

module.exports = {
  
  list: list,
  create: create,
  read: read,
  update: update,
  delete: _delete
};




