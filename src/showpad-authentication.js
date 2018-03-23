import axios from "axios";
// Helper object which abstracts away most of the authentication related connector functionality
class ShowpadAuthentication {
  // Checks whether or not we have saved authentication tokens available
  // hasTokens() {
  //   console.log("Checking if we have auth tokens");
  //   const tokens = this.getTokens();
  //   return !!tokens.access_token && !!tokens.refresh_token;
  // }

  hasTokens() {
    console.log("Checking if we have auth tokens");
    var result = this.getTokens();
    return !!result.access_token && !!result.refresh_token;
  }

  // Gets the access_token and refresh_token from either tableau.password or query hash
  getTokens() {
    let result = {};

    // We've saved off the access & refresh token to tableau.password
    if (tableau.password) {
      console.log("Grabbing authentication from tableau.password");
      result = JSON.parse(tableau.password);
    }

    return result;
  }

  // Gets just the access token needed for making requests
  getAccessToken() {
    return this.getTokens().access_token;
  }

  getRefreshToken() {
    return this.getTokens().refresh_token;
  }

  // Note: Refresh tokens are valid forever, just need to get a new access token.
  // Refresh tokens can me manually revoked but won"t expire

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
