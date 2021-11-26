console.log('load session')
// Checks if the user is loggedin, and if they are, replace the login and signup links, with profile and logout links
getRequest("session", (responseAsObj) => { // Get the current session information from the API for the current browser session
  responseAsObj.json().then(response => { // parse the response into JSON
    /*
      response: {
        session: 'SESSION ID',
        email: 'email address' // or null (if the user is not logged in)
    */
    console.log(response)
    if (document.getElementById('loggedInState') !== null // Just checking if the element `<div id="loggedInState"></div>` exists on the page
      && response.email !== null) { // Checking if the email passed from the server is not null - ie: logged in
      let newHTMLForLogout = `<a href="profile.html" class="w3-bar-item w3-button w3-hide-small w3-hover-white">Profile</a>`;
      newHTMLForLogout += `<a href="javascript:logout();" class="w3-bar-item w3-button w3-hide-small w3-hover-white">Logout</a>`;
      document.getElementById('loggedInState').innerHTML = newHTMLForLogout;
    }
  });
})

function logout() {
  getRequest("logout", () => {
    window.location.reload(true);
  })
}