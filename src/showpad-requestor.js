import axios from "axios";

export default class ShowpadRequestor {
  constructor(showpadApi, timeRange, reportProgress) {
    this.showpadApi = showpadApi;
    this.timeRange = timeRange;
    this.reportProgress = reportProgress || (() => {});
    // this.defaultPageSize = 50;
    // this.maxResults = 1000;
    // this.retryCount = 3;
  }

  fetch(endpoint = "/exports/users.json") {
    const AuthStr = "Bearer " + this.showpadApi.accessToken;
    const request = axios.get(this.showpadApi.buildUrl(endpoint), {
      headers: { Authorization: AuthStr }
    });
    return request;
  }

  fetchUsers() {
    return this.fetch("/exports/users.json");
  }

  fetchAssets() {
    return this.fetch("/exports/assets.json");
  }

  fetchChannels() {
    return this.fetch("/exports/channels.json");
  }

  fetchDivisions() {
    return this.fetch("/exports/divisions.json");
  }

  fetchEvents() {
    return this.fetch(
      "/exports/events.json?startedAt=2018-02-01&endedAt=2018-03-09&pageBased=true&limit=1000"
    );
  }

  fetchUserUserGroups() {
    return this.fetch("/exports/user-usergroups.json");
  }

  fetchUserGroups() {
    return this.fetch("/exports/usergroups.json");
  }
}
