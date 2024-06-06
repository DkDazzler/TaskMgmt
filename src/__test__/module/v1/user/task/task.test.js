import app from "~/index";
import request from 'supertest';
import path from "path";
import BaseModel from "~/models/BaseModel";
import { LocalStorage } from "node-localstorage";


var localStorage = new LocalStorage(path.join(process.cwd(), 'src/__test__/localStorage')),
   apiHeader = JSON.parse(localStorage.getItem('apiHeader')),
   encryptedId = JSON.parse(localStorage.getItem('encryptedId')),
   taskData = JSON.parse(localStorage.getItem('taskData')),
   task = taskData.task,
   taskUpdate = taskData.taskUpdate,
   baseModelObj = new BaseModel();


describe('Task test cases', () => {

   afterAll(async () => {
      await baseModelObj.truncateTables();
   });

   /*********************************************************************/

   // Test cases for user/v1/tasks api
   test('test endpoint POST user/v1/tasks when any header missing or entered wrong', async () => {
      const response = await request(app).post('/user/v1/tasks').set({}),
      resBody = response.body;
      expect(resBody.code).toBe(100);
   });

   test('test endpoint POST user/v1/tasks when access-token is missing or entered wrong', async () => {
      // Create a copy of apiHeader
      const modifiedApiHeader = { ...apiHeader };
  
      // Set invalid token in the copy
      modifiedApiHeader['access-token'] = 'invalid-token';
  
      // Make the request with the modified header
      const responseForInvalidToken = await request(app).post('/user/v1/tasks').set(modifiedApiHeader);
      const resBodyInvalidToken = responseForInvalidToken.body;
  
      // Expectation for invalid token
      expect(resBodyInvalidToken.code).toBe(104);
  
      // Make the request without the access-token (remove from the copy)
      delete modifiedApiHeader['access-token'];
      const response = await request(app).get('/user/v1/tasks').set(modifiedApiHeader);
      const resBody = response.body;
  
      // Expectation for missing or wrong access-token
      expect(resBody.code).toBe(103);
   });

   test('test endpoint POST user/v1/tasks enter all correct field for success response', async () => {
      var taskData = { ...task };

      const response = await request(app).post('/user/v1/tasks')
         .set(apiHeader)
         .send(taskData),
         resBody = response.body;
      expect(resBody.code).toBe(200);
   });
   
   // Test cases for GET user/v1/tasks api
   test('test endpoint GET user/v1/tasks when any header missing or entered wrong', async () => {
      const response = await request(app).get('/user/v1/tasks').set({});
      expect(response.body.code).toBe(100);
   });

   test('test endpoint GET user/v1/tasks when access-token is missing or entered wrong', async () => {
      // Create a copy of apiHeader
      const modifiedApiHeader = { ...apiHeader };
  
      // Set invalid token in the copy
      modifiedApiHeader['access-token'] = 'invalid-token';
  
      // Make the request with the modified header
      const responseForInvalidToken = await request(app).get('/user/v1/tasks').set(modifiedApiHeader);
      const resBodyInvalidToken = responseForInvalidToken.body;
  
      // Expectation for invalid token
      expect(resBodyInvalidToken.code).toBe(104);
  
      // Make the request without the access-token (remove from the copy)
      delete modifiedApiHeader['access-token'];
      const response = await request(app).get('/user/v1/tasks').set(modifiedApiHeader);
      const resBody = response.body;
  
      // Expectation for missing or wrong access-token
      expect(resBody.code).toBe(103);
   });

   test('test endpoint GET user/v1/tasks returns a successful response', async () => {
      
      const response = await request(app).get('/user/v1/tasks').set(apiHeader); 
      const resBody = response.body;
      expect(resBody.code).toBe(200); // Verify status code
  
      // Asserting properties of the data object
      expect(resBody.data).toHaveProperty("taskList");
      expect(Array.isArray(resBody.data.taskList)).toBe(true);
      expect(resBody.data).toHaveProperty("loadMore");
      expect(resBody.data).toHaveProperty("count");

      // Asserting properties of objects within the taskList array
      resBody.data.taskList.forEach(task => {
          expect(task).toHaveProperty("id");
          expect(task).toHaveProperty("title");
          expect(task).toHaveProperty("description");
          expect(task).toHaveProperty("status");
      });
      
   });

   // Test cases for GET user/v1/tasks/{id} api
   test('test endpoint GET user/v1/tasks/{id} when any header missing or entered wrong', async () => {
      const response = await request(app).get(`/user/v1/tasks/${encryptedId.id}`).set({});
      expect(response.body.code).toBe(100);
   });

   test('test endpoint GET user/v1/tasks/{id} when access-token is missing or entered wrong', async () => {
      // Create a copy of apiHeader
      const modifiedApiHeader = { ...apiHeader };
  
      // Set invalid token in the copy
      modifiedApiHeader['access-token'] = 'invalid-token';
  
      // Make the request with the modified header
      const responseForInvalidToken = await request(app).get(`/user/v1/tasks/${encryptedId.id}`).set(modifiedApiHeader);
      const resBodyInvalidToken = responseForInvalidToken.body;
  
      // Expectation for invalid token
      expect(resBodyInvalidToken.code).toBe(104);
  
      // Make the request without the access-token (remove from the copy)
      delete modifiedApiHeader['access-token'];
      const response = await request(app).get(`/user/v1/tasks/${encryptedId.id}`).set(modifiedApiHeader);
      const resBody = response.body;
  
      // Expectation for missing or wrong access-token
      expect(resBody.code).toBe(103);
   });

   test('test endpoint GET user/v1/tasks/{id}, for success response', async () => {
      const encryptedIds = JSON.parse(localStorage.getItem('encryptedId'));
      const response = await request(app)
          .get(`/user/v1/tasks/${encryptedIds.id}`)
          .set(apiHeader);
      
      // Assert response body structure
      expect(response.body).toHaveProperty('code', 200);
      expect(response.body).toHaveProperty('data');
  
      // Define expected keys for customsDetails object
      const expectedKeys = [
          'title',
          'description',
          'status',
          'createdAt',
          'updatedAt'
      ];
  
      // Assert that all expected keys are present in customsDetails
      expectedKeys.forEach(key => {
          expect(response.body.data).toHaveProperty(key);
      });
   });

   // Test cases for PUT user/v1/tasks/{id} api
   test('test endpoint PUT user/v1/tasks/{id} when any header missing or entered wrong', async () => {
      const response = await request(app).put(`/user/v1/tasks/${encryptedId.id}`).set({});
      expect(response.body.code).toBe(100);
   });

   test('test endpoint PUT user/v1/tasks/{id} when access-token is missing or entered wrong', async () => {
      // Create a copy of apiHeader
      const modifiedApiHeader = { ...apiHeader };
  
      // Set invalid token in the copy
      modifiedApiHeader['access-token'] = 'invalid-token';
  
      // Make the request with the modified header
      const responseForInvalidToken = await request(app).put(`/user/v1/tasks/${encryptedId.id}`).set(modifiedApiHeader);
      const resBodyInvalidToken = responseForInvalidToken.body;
  
      // Expectation for invalid token
      expect(resBodyInvalidToken.code).toBe(104);
  
      // Make the request without the access-token (remove from the copy)
      delete modifiedApiHeader['access-token'];
      const response = await request(app).put(`/user/v1/tasks/${encryptedId.id}`).set(modifiedApiHeader);
      const resBody = response.body;
  
      // Expectation for missing or wrong access-token
      expect(resBody.code).toBe(103);
   });

   test('test endpoint PUT user/v1/tasks/{id} when try to update with invalid id', async () => {
      var taskUpdateObj = { ...taskUpdate };
      const response = await request(app)
         .put(`/user/v1/tasks/invalidid`)
         .set(apiHeader)
         .send(taskUpdateObj);
      expect(response.body).toHaveProperty('code', 114);
   });

   test('test endpoint PUT user/v1/tasks/{id} for success response', async () => {
      var taskUpdateObj = { ...taskUpdate };
      const response = await request(app)
         .put(`/user/v1/tasks/${encryptedId.id}`)
         .set(apiHeader)
         .send(taskUpdateObj);
      expect(response.body).toHaveProperty('code', 200);
   });

   // Test cases for DELETE user/v1/tasks/{id} api
   test('test endpoint DELETE user/v1/tasks/{id} when any header missing or entered wrong', async () => {
      const response = await request(app).delete(`/user/v1/tasks/${encryptedId.id}`).set({});
      expect(response.body.code).toBe(100);
   });

   test('test endpoint DELETE user/v1/tasks/{id} when access-token is missing or entered wrong', async () => {
      // Create a copy of apiHeader
      const modifiedApiHeader = { ...apiHeader };
  
      // Set invalid token in the copy
      modifiedApiHeader['access-token'] = 'invalid-token';
  
      // Make the request with the modified header
      const responseForInvalidToken = await request(app).delete(`/user/v1/tasks/${encryptedId.id}`).set(modifiedApiHeader);
      const resBodyInvalidToken = responseForInvalidToken.body;
  
      // Expectation for invalid token
      expect(resBodyInvalidToken.code).toBe(104);
  
      // Make the request without the access-token (remove from the copy)
      delete modifiedApiHeader['access-token'];
      const response = await request(app).delete(`/user/v1/tasks/${encryptedId.id}`).set(modifiedApiHeader);
      const resBody = response.body;
  
      // Expectation for missing or wrong access-token
      expect(resBody.code).toBe(103);
   });

   test('test endpoint DELETE user/v1/tasks/{id} when try to delete with invalid id', async () => {
      const response = await request(app)
         .delete(`/user/v1/tasks/invalidid`)
         .set(apiHeader)
      expect(response.body).toHaveProperty('code', 114);
   });

   test('test endpoint DELETE user/v1/tasks/{id} for success response', async () => {
      const response = await request(app)
         .delete(`/user/v1/tasks/${encryptedId.id}`)
         .set(apiHeader)
      expect(response.body).toHaveProperty('code', 200);
   });


});