const app = require("../app");
const mongoose = require("mongoose");
const request = require("supertest");

// beforeEach((done) => {
//   mongoose.connect(
//     "mongodb+srv://sdileepkumarreddy:Qwerty123@cluster0.j477k.mongodb.net/pp-test-1",
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => done()
//   );
// });

beforeAll(done => {
    done()
  })

afterAll((done) => {
    try {
        mongoose.connection.close()
        done()
    } catch (error) {
      console.log(`
        You did something wrong dummy!
        ${error}
      `);
      throw error;
    }
});

describe("Test /api/users", () => {
  let token = "";
  let userId = "";
  test("Login user to get token", async () => {
    const loginResponse = await request(app).post("/api/users/login").send({
      email: "sirasani.d@northeastern.edu",
      password: "Qwerty123",
    });
    // console.log(loginResponse.body);
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
    // console.log(newUser.body);
    expect(newUser.body).toHaveProperty("response");
    expect(newUser.body.response.user.lastname).toBe("xyz");
    expect(newUser.statusCode).toBe(201);
    userId = newUser.body.response.user._id;
  });
  test("Get User", async () => {
    const response = await request(app)
      .get("/api/users/" + userId)
      .set("Authorization", token);
    // console.log(response.body);
    expect(response.body.user.email).toBe("test@test.com");
    expect(response.statusCode).toBe(200);
  });
  test("Delete User", async () => {
    const response = await request(app)
      .delete("/api/users/" + userId)
      .set("Authorization", token);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
  });
});

describe("Test /api/locations", () => {
  let token = "";
  test("Login user to get token", async () => {
    const loginResponse = await request(app).post("/api/users/login").send({
      email: "sirasani.d@northeastern.edu",
      password: "Qwerty123",
    });
    //console.log(loginResponse.body);
    expect(loginResponse.statusCode).toBe(200);
    token = loginResponse.body.token;
  });
  test("Get Locations", async () => {
    const response = await request(app).get("/api/locations/");
    //console.log(response.body);
    expect(response.statusCode).toBe(200);
  });
  test("Create new Location", async () => {
    const newLocation = await request(app)
      .post("/api/locations")
      .set("Authorization", token)
      .send({
        name: "Sample Address" + Date.now(),
        address: "Fenway Park, Jersey Street, Boston, MA, USA" + Date.now(),
      });
    //console.log(newLocation.body);
    expect(newLocation.statusCode).toBe(200);
  });
});

describe("Test /api/bookings", () => {
  let token = "";
  test("Login user to get token", async () => {
    const loginResponse = await request(app).post("/api/users/login").send({
      email: "sirasani.d@northeastern.edu",
      password: "Qwerty123",
    });
    //console.log(loginResponse.body);
    expect(loginResponse.statusCode).toBe(200);
    token = loginResponse.body.token;
  });

  test("Create new Booking", async () => {
    const newBooking = await request(app)
      .post("/api/bookings")
      .set("Authorization", token)
      .send({
        car: "6084ac883ab0ad2dd41419d2",
        destination: "6084f4534e7aa96024005908",
        location: "6084f4534e7aa96024005908",
        pickupTime: "2021-05-07T00:15",
        returnTime: "2021-05-21T04:15",
        user: "6084f4514e7aa96024005907",
      });
    //console.log(newBooking.body);
    expect(newBooking.statusCode).toBe(201);
  });

  test("Get Bookings", async () => {
    const response = await request(app)
      .get("/api/bookings/customers/all")
      .set("Authorization", token);
    //console.log(response.body);
    expect(response.statusCode).toBe(200);
  });
});

describe("Test /api/cars", () => {
  let token = "";
  test("Login user to get token", async () => {
    const loginResponse = await request(app).post("/api/users/login").send({
      email: "sirasani.d@northeastern.edu",
      password: "Qwerty123",
    });
    //console.log(loginResponse.body);
    expect(loginResponse.statusCode).toBe(200);
    token = loginResponse.body.token;
  });
  test("Get Cars", async () => {
    const response = await request(app).get("/api/cars/");
    //console.log(response.body);
    expect(response.statusCode).toBe(200);
  });
});
