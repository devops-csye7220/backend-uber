import http from 'k6/http';
  import {check, group, sleep, fail} from 'k6';

  export let options = {
   stages: [
     { target: 70, duration: '30s' },
   ],
    thresholds: {
      'http_req_duration': ['p(95)<500', 'p(99)<1500'],
      'http_req_duration{name:PublicAPI}': ['avg<400'],
      'http_req_duration{name:Create}': ['avg<600', 'max<1000'],
    },
  };

  function randomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[Math.random() * charset.length | 0];
    return res;
  }

  const EMAIL = `sirasani.d@northeastern.edu`;  // Set your own email or `${randomString(10)}@example.com`;
  const PASSWORD = 'Qwerty123';
//   const BASE_URL = 'http://localhost:3001/api';
  const BASE_URL = "http://a98ef851b96484aa696919c89c13425c-1666064303.us-east-1.elb.amazonaws.com/api"

  export function setup() {
    // register a new user and authenticate via a Bearer token.
    let res = http.post(`${BASE_URL}/users/`, {
        email: "test1@test.com",
        firstname: "Lorem ipsum",
        lastname: "xyz",
        password: "Qwerty123",
        usertype: "customer",
    });

    check(res, { 'created user': (r) => r.status === 201 });

    let loginRes = http.post(`${BASE_URL}/users/login/`, {
      email: EMAIL,
      password: PASSWORD
    });

    let authToken = loginRes.json('token');
    console.log(authToken);
    check(authToken, { 'logged in successfully': () => authToken !== '', });

    return authToken;
  }


  export default (authToken) => {
    console.log(authToken);
    const requestConfigWithTag = tag => ({
      headers: {
        Authorization: `${authToken}`
      },
      tags: Object.assign({}, {
        name: 'PrivateAPI'
      }, tag)
    });

    group('Fetch Locations', () => {
      // call some public endpoints in a batch
      let LocationsResponses = http.batch([
        ['GET', `${BASE_URL}/locations/`, null, null]
      ]);
    //   if (check(LocationsResponses, { 'fetched locations!': (r) => r.status === 200 })) {
    //     console.log(LocationsResponses.body)
    // } else {
    //   console.log(`Unable to fetch locations ${res.status} ${res.body}`);
    //   return
      //const name = Object.values(responses).map(res => res.json('name'));

    });

    group('Create a Booking', () => {
        const payload = {
            car: "6084ad1b3ab0ad2dd41419d4",
            destination: "6084abbb3ab0ad2dd41419d1",
            location: "6084abbb3ab0ad2dd41419d1",
            pickupTime: "2022-05-07T00:15",
            returnTime: "2022-05-21T04:15",
            user: "60856cbe3ab0ad2dd41419df",
        };
        
        const res = http.post(`${BASE_URL}/bookings`, payload, requestConfigWithTag({ name: 'Create' }));

        if (check(res, { 'Booking created correctly': (r) => r.status === 201 })) {
            console.log(res.body)
        } else {
          console.log(`Unable to create a booking ${res.status} ${res.body}`);
          return
        }
      });
    
    sleep(1);
  }