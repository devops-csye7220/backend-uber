import { sleep } from 'k6'
import http from 'k6/http'

// See https://k6.io/docs/using-k6/options
export const options = {
  stages: [
    { duration: '30s', target: 20 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 2%
    http_req_duration: ['p(95)<2000'], // 95% requests should be below 2s
  },
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
      },
    },
  },
}

export default function main() {
    var url = 'http://localhost:3001/api/users/login';
    var payload = JSON.stringify({
      email: 'sirasani.d@northeastern.edu',
      password: 'Qwerty123',
    });
  
    var params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
   let loginResponse = http.post(url, payload, params);
   let token = loginResponse.json('token');
   var bookingParams = {
    headers: {
        Authorization: token,
      'Content-Type': 'application/json',
    },
  };
    let response = http.get('http://localhost:3000/api/bookings/customers/all',bookingParams);
  sleep(1)
}