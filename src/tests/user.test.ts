import request from 'supertest';
import app from '../app';
// import { mocked } from 'ts-jest/utils';
// import {
//   loginController,
//   signupController,
// } from '../controllers/user.controller';
// import { findUser, createUser } from '../services/user.service';

// jest.mock('../services/user.service');
// const mockedFindUser = mocked(findUser, true);
// const mockedCreateUser = mocked(createUser, true);


describe('user routes', () => {
  // test('should signup a user with email firstname, lastname and password', async () => {
  //   let response = await request(app).post('/api/user/signup').send({
  //     email: 'test2@test.com',
  //     first_name: 'test',
  //     last_name: 'test',
  //     password: '1234567',})
  //   expect(response.body).toMatchObject({ success: true, "data": {}, "message": "Account successfully created" });
  // });

  test('should login a user with email and password', async () => {
    let response = await request(app).post('/api/user/login').send({
      email: 'gozione3@gmail.com',
      password: 'chigozie',
    });
    expect(response.body).toMatchObject({
      success: true,
      data: {},
      message: 'Login successful',
    });
  });

  // test('should send money to another user should return error for invalid balance', async () => {
  //   let response = await request(app)
  //     .post('/api/user/fund/send')
  //     .set(
  //       'Bearer',
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNoYXJsZXNAZ21haWwuY29tIiwiaWF0IjoxNjMyODI5NjA3LCJleHAiOjE2MzI4NjU2MDd9.ps6_NDKop_zB98Jxuc7UgHJQpoQwMAFiKEHmZgkGDEE',
  //     )
  //     .send({
  //       amount: 20000,
  //       reciever: 'gozione3@gmail.com',
  //     })
  //     console.log(response.body);
      
  //   // expect(response.body).toMatchObject({
  //   //   "data": "transaction success",
  //   //   "message": {
  //   //     "success": true,
  //   //     "message": "Credit successful"
  //   //   }
  //   // })
  // });
});
