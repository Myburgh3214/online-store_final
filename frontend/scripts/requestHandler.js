const API_BASE_URL = 'http://localhost/online-final';

function webRequest(apiName, method, headers, body, callback) {
  const requestOptions = {
    method: method,
    headers: headers,
    body: body,
    redirect: 'follow',
    credentials: "include"
  };

  //fetch(API_BASE_URL + '/api/index.php?_endpoint=' +apiName, requestOptions)
  //if (body !== undefined && body !== null)
  fetch(`${API_BASE_URL}/api/${apiName}`, requestOptions)///string interpelation
    .then(result => callback(result))
    .catch(error => console.log('error', error));
}

function postRequest (apiName, fields, callback) {
  /*
  fields = {
    fielda: 'asdf',
    field2: 'asdfasdf'
  }
  fields.fielda
  fields.field2
  fields['fielda']
  fields['field2']

  Object.keys(fields)
  ['fielda', 'field2'] => names 
  */
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  let urlencoded = new URLSearchParams();

  for (let field of Object.keys(fields)) {
    urlencoded.append(field, fields[field]);
  }
  //['fielda', 'field2']
  // 0
  //urlencoded.append('fielda', 'asdf');
  // 1
  //urlencoded.append('field2', 'asdfasdf');
  //urlencoded.append("email", document.getElementById('email').value);
  //urlencoded.append("psw", document.getElementById('psw').value);

  //fetch(API_BASE_URL + '/api/index.php?_endpoint=' +apiName, requestOptions)
  webRequest(apiName, 'POST', myHeaders, urlencoded, callback);
}

function getRequest (apiName, callback) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  webRequest(apiName, 'GET', myHeaders, undefined, callback);
}

/*postRequest('login', {
  username: 'bob',
  password: 'okay'
})*/
/*
was
  urlencoded.append("email", document.getElementById('email').value);
  urlencoded.append("psw", document.getElementById('psw').value);

to:

postRequest('login', {
  username: document.getElementById('email').value,
  pws: document.getElementById('psw').value
})
*/