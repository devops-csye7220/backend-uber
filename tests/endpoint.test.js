const app = require("../app");
const mongoose = require("mongoose");
const request = require("supertest");

beforeEach((done) => {
  mongoose.connect(
    "mongodb+srv://sdileepkumarreddy:Qwerty123@cluster0.j477k.mongodb.net/pp-test",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

describe("Test /api/users", () => {
    let token = "";
    let userId = "";
    test("Login user to get token", async () => {
        const loginResponse = await request(app).post("/api/users/login").send({
          email: "sirasani.d@northeastern.edu",
          password: "Qwerty123"
        });
        console.log(loginResponse.body);
        expect(loginResponse.statusCode).toBe(200);
        token = loginResponse.body.token;
    });
  test("Create new user and Delete User", async () => {
    const newUser = await request(app).post("/api/users").send({
      email: "test@test.com",
      firstname: "Lorem ipsum",
      lastname: "xyz",
      password: "Qwerty123",
      usertype: "customer",
    });
    console.log(newUser.body);
    expect(newUser.body).toHaveProperty("response");
    expect(newUser.body.response.user.lastname).toBe("xyz");
    expect(newUser.statusCode).toBe(201);
    userId = newUser.body.response.user._id;
  });
  test("Get User", async () => {
    const response = await request(app).get("/api/users/"+userId).set('Authorization', token);
    console.log(response.body);
    expect(response.body.user.email).toBe("test@test.com");
    expect(response.statusCode).toBe(200);
  });
  test("Delete User", async () => {
    const response = await request(app).delete("/api/users/"+userId).set('Authorization', token);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
});
});

describe("Test /api/users", () => {
    let token = "";
    let userId = "";
    test("Login user to get token", async () => {
        const loginResponse = await request(app).post("/api/users/login").send({
          email: "sirasani.d@northeastern.edu",
          password: "Qwerty123"
        });
        console.log(loginResponse.body);
        expect(loginResponse.statusCode).toBe(200);
        token = loginResponse.body.token;
    });
});