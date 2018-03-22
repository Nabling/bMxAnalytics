import axios from "axios";
// Helper object which abstracts away most of the authentication related connector functionality
class ShowpadAuthentication {
  // Obtains parameters from the hash of the URL
  _getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // Checks whether or not we have saved authentication tokens available
  hasTokens() {
    console.log("Checking if we have auth tokens");
    var result = this.getTokens();
    return !!result.access_token && !!result.refresh_token;
  }

  // Gets the access_token and refresh_token from either tableau.password or query hash
  getTokens() {
    var result = {};

    // We've saved off the access & refresh token to tableau.password
    if (tableau.password) {
      console.log("Grabbing authentication from tableau.password");
      result = JSON.parse(tableau.password);
    } else {
      console.log("Grabbing authentication from query hash");
      result = this._getHashParams();
    }

    return result;
  }

  // Gets just the access token needed for making requests
  getAccessToken() {
    return this.getTokens().access_token + "123";
  }

  getRefreshToken() {
    return this.getTokens().refresh_token;
  }

  // Note: Refresh tokens are valid forever, just need to get a new access token.
  // Refresh tokens can me manually revoked but won"t expire
  // refreshToken(doneHandler) {
  //   console.log("Requesting refreshToken");
  //   return $.ajax({
  //     url: "/refresh_token",
  //     data: {
  //       refresh_token: refresh_token
  //     }
  //   }).done(function(data) {
  //     doneHandler(data.access_token);
  //   });
  // }

  refreshToken() {
    console.log("Requesting refreshToken");
    return axios({
      url: "/refresh_token",
      params: {
        refresh_token: this.getRefreshToken()
      }
    }).then(response => {
      console.log("response", response);
      return response.data.access_token;
    });
  }
}

export default ShowpadAuthentication;
