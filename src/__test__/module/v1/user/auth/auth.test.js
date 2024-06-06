import app from "~/index";
import request from 'supertest';
import path from "path";
import BaseModel from "~/models/BaseModel";
import { LocalStorage } from "node-localstorage";


var localStorage = new LocalStorage(path.join(process.cwd(), 'src/__test__/localStorage')),
   apiHeader = JSON.parse(localStorage.getItem('apiHeader')),
   authUserData = JSON.parse(localStorage.getItem('authUserData')),
   userSignupDetails = authUserData.userSignupDetails,
   baseModelObj = new BaseModel();


describe('Auth test cases', () => {

   /*********************************************************************/

   // Test cases for user/v1/signup api
   test('test endpoint user/v1/signup when any header missing or entered wrong', async () => {
      const response = await request(app).post('/user/v1/signup').set({}),
      resBody = response.body;
      expect(resBody.code).toBe(100);
   });

   test('test endpoint user/v1/signup when enter invalid email', async () => {
      let data = { ...userSignupDetails };
      data.email = 'invalid@email';
      const response = await request(app).post('/user/v1/signup').set(apiHeader).send(data),
      resBody = response.body;
      expect(resBody).toHaveProperty('message');
   });

   test('test endpoint user/v1/signup enter all correct field for success response', async () => {
      var userData = { ...userSignupDetails };

      const response = await request(app).post('/user/v1/signup')
         .set(apiHeader)
         .send(userData),
         resBody = response.body;
      expect(resBody.code).toBe(200);
      expect(resBody).toHaveProperty('data');
      expect(resBody.data).toHaveProperty('token');
   });

   test('test endpoint user/v1/signup when email alredy used', async () => {
      let data = { ...userSignupDetails };
      const response = await request(app).post('/user/v1/signup').set(apiHeader).send(data),
      resBody = response.body;
      expect(resBody.code).toBe(112);
   });

   // Test cases for user/v1/login API
   test('test endpoint user/v1/login when any header missing or entered wrong', async () => {
      const response = await request(app).post('/user/v1/login').set({});
      expect(response.body.code).toBe(100);
   });

   test('test endpoint user/v1/login when entered invalid credentials', async () => {
      let sendData = { email: 'username@gmail.com', password: '@123'};
      const response = await request(app).post('/user/v1/login').set(apiHeader).send(sendData);
      expect(response.body.code).toBe(111);
   });

   test('test endpoint user/v1/login enter correct credential for test success response', async () => {
      let sendData = {
         email: userSignupDetails.email,
         password: userSignupDetails.password
      };
      const response = await request(app).post('/user/v1/login').set(apiHeader).send(sendData),
         resBody = response.body;
      expect(resBody.code).toBe(200);
      expect(resBody).toHaveProperty('data');
      expect(resBody.data).toHaveProperty('token');

      // updating api header with access-token
      apiHeader['access-token'] = resBody.data.token;
      localStorage.setItem("apiHeader", JSON.stringify(apiHeader));
   });

});