// src/testdata/login.data.ts
export const loginData = {
  registeredUser: {
    username: process.env.TEST_USERNAME ?? '',
    password: process.env.TEST_PASSWORD ?? '',
  },
  invalidCredentials: {
    username: 'invalid@example.com',
    password: 'wrongpassword',
  },
  unregisteredUser: {
    username: 'notregistered@example.com',
    password: 'somepassword',
  },
};
