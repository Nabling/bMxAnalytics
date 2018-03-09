class ShowpadWebApi {
  constructor() {
    this.baseUri = "https://api.spotify.com/v1";
    this.token = null;
    this.promiseImplementation = null;
  }

  set accessToken(token) {
    this.token = token;
  }

  get accessToken() {
    return this.token;
  }
}
