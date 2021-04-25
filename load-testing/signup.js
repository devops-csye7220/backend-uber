import http from 'k6/http';

export default function () {
  var url = 'http://localhost:3001/api/users/';
  var payload = JSON.stringify({
    email: "test@test.com",
      firstname: "Lorem ipsum",
      lastname: "xyz",
      password: "Qwerty123",
      usertype: "customer",
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
