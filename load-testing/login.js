import http from 'k6/http';

export default function () {
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

  http.post(url, payload, params);
}
