import axios from "axios";
import moment from "moment";

export default class ShowpadRequestor {
  constructor(showpadApi, timeRange, reportProgress) {
    this.showpadApi = showpadApi;
    this.timeRange = timeRange;
    console.log("timeRange", timeRange);
    this.reportProgress = reportProgress || (() => {});
    this.endDate = moment().format("YYYY-MM-DD");
    console.log("this.endDate", this.endDate);
    // this.defaultPageSize = 50;
    // this.maxResults = 1000;
    // this.retryCount = 3;
  }

  fetch(endpoint, scrollId = "") {
    const AuthStr = "Bearer " + this.showpadApi.accessToken;
    let headers;
    if (scrollId === "") {
      headers = { Authorization: AuthStr };
    } else {
      headers = {
        headers: { Authorization: AuthStr, "X-Showpad-Scroll-Id": scrollId }
      };
    }
    console.log("Fetch headers", headers);

    return axios({
      method: "get",
      url: this.showpadApi.buildUrl(endpoint),
      headers
    });

    // const request = axios.get(this.showpadApi.buildUrl(endpoint), {
    //   headers
    // });
    // return request;
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
      "/exports/events.json?startedAt=2018-02-01&endedAt=2018-03-09&pageBased=true&limit=1000",
      ""
    );
  }

  // fetchEvents() {
  //   let data = [];
  //   // var allDataFetched = false;
  //
  //   const fetchNow = (scrollId = "") => {
  //     console.log("scrollId", scrollId);
  //     this.fetch(
  //       "/exports/events.json?startedAt=2018-03-01&endedAt=2018-03-09&pageBased=true&limit=1000",
  //       scrollId
  //     )
  //       .then(response => {
  //         console.log("then response", response);
  //         if (response.data.response.items.length > 0) {
  //           data.push(response.data.response.items);
  //           fetchNow(response.headers["x-showpad-scroll-id"]);
  //         } else {
  //           console.log("else data", data);
  //           // allDataFetched = true;
  //           return data;
  //         }
  //       })
  //       .catch(error => {
  //         console.log("catch error", error);
  //       });
  //   };
  //
  //   return fetchNow();
  // }

  fetchUserUserGroups() {
    return this.fetch("/exports/user-usergroups.json");
  }

  fetchUserGroups() {
    return this.fetch("/exports/usergroups.json");
  }
}
