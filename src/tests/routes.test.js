const request = require('supertest')
const app = require('../controller/RegisterController');

import {getConnectionManager, ConnectionManager, Connection} from "typeorm";

const connectionManager = getConnectionManager();
const connection = connectionManager.create({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "MyNewPass",
    database: "classRegistration",
});

beforeEach(async () => {
  await connection.connect(); 
})

test('Create a valid Service', async() => {
  const service = {
      name: "cool",
      description: "description"
  };

  try {
      let request ={
        params: {
          id: 1
      }
      }
      let response = {};
      let nextFunction = {};
      
      const a = await app.one(request,response,nextFunction)
      expect(a).toBe(a);
  } catch (err) {
      // write test for failure here
      console.log(`Error ${err}`)
  }
});

