const request = require('supertest');
const app = require('../src/app')
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Yash Agarwal',
    email: 'yash@example.com',
    password: 'MyPass777!'
  }).expect(201)

  //Assertions that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Yash Agarwal',
      email: 'yash@example.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  //Assertion that the token in response is same as the second saved in database
  const user = await User.findById(userOneId)
  expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login non existing user', async () => {
  await request(app).post('/users/login').send({
    email: 'vikram@example.com',
    password: '123456!!'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test("Should delete account for authenticated user", async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    //Asserting that the user is deleted from the database
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/profile-pic.jpg')
      .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'Yash'
      })
      .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toBe('Yash')

})

test('Should not update invalid user fields', async() => {
  await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location : 'India'
      })
      .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated