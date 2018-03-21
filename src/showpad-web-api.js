class ShowpadWebApi {
  constructor(showpadAccount = "biomerieux") {
    this.showpadAccount = showpadAccount;
    // this.baseUri = `https://${showpadAccount}.showpad.biz/api/v3`;
    this.baseUri = "/proxy";
    this.token = null;
    // this.promiseImplementation = null;
  }

  buildUrl(endpoint) {
    return this.baseUri + endpoint;
  }

  set accessToken(token) {
    this.token = token;
  }

  get accessToken() {
    return this.token;
  }
}

export default ShowpadWebApi;
