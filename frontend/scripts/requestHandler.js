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
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  webRequest(apiName, 'POST', myHeaders, JSON.stringify(fields), callback);
}

function putRequest (apiName, fields, callback) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  webRequest(apiName, 'PUT', myHeaders, JSON.stringify(fields), callback);
}

function patchRequest (apiName, fields, callback) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  webRequest(apiName, 'PATCH', myHeaders, JSON.stringify(fields), callback);
}

function getRequest (apiName, callback) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  webRequest(apiName, 'GET', myHeaders, undefined, callback);
}

function deleteRequest (apiName, callback) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  webRequest(apiName, 'DELETE', myHeaders, undefined, callback);
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