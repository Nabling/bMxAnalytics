import axios from "axios";
import moment from "moment";
import rp from "request-promise";

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
    console.log("this is fetch");
    const AuthStr = "Bearer " + this.showpadApi.accessToken;
    let headers;
    if (scrollId === "") {
      headers = {
        Authorization: AuthStr,
        "X-Requested-With": "XMLHttpRequest"
      };
    } else {
      headers = {
        headers: { Authorization: AuthStr, "X-Showpad-Scroll-Id": scrollId }
      };
    }
    console.log("Fetch headers", headers);

    // return axios({
    //   method: "get",
    //   url: this.showpadApi.buildUrl(endpoint),
    //   headers
    // });

    const request = axios.get(this.showpadApi.buildUrl(endpoint), {
      headers
    });
    return request;
  }

  // fetch2(endpoint, scrollId = "") {
  //   console.log("this is fetch 2");
  //   const AuthStr = "Bearer " + this.showpadApi.accessToken;
  //
  //   const options = {
  //     uri: this.showpadApi.buildUrl(endpoint),
  //     headers: {
  //       "User-Agent": "Request-Promise",
  //       Authorization: AuthStr
  //     },
  //     resolveWithFullResponse: true,
  //     json: true // Automatically parses the JSON string in the response
  //   };
  //
  //   return rp(options);
  // }
  //
  // fetch3(endpoint, scrollId = "") {
  //   const AuthStr = "Bearer " + this.showpadApi.accessToken;
  //
  //   return $.ajax({
  //     url: this.showpadApi.buildUrl(endpoint),
  //     headers: {
  //       Authorization: AuthStr
  //     }
  //   }).done(function(data, status, xhr) {
  //     console.log("Sample of data:", xhr.getAllResponseHeaders());
  //     return data;
  //   });
  // }

  fetchUsers() {
    return this.fetch("/exports/users.json").then(response => {
      return response.data.response.items;
    });
  }

  fetchAssets() {
    return this.fetch("/exports/assets.json").then(response => {
      return response.data.response.items;
    });
  }

  fetchChannels() {
    return this.fetch("/exports/channels.json").then(response => {
      return response.data.response.items;
    });
  }

  fetchDivisions() {
    return this.fetch("/exports/divisions.json").then(response => {
      return response.data.response.items;
    });
  }

  // fetchEvents2() {
  //   return this.fetch(
  //     "/exports/events.json?startedAt=2018-02-01&endedAt=2018-03-09&pageBased=true&limit=1000",
  //     ""
  //   ).then(response => {
  //     return response.data.response.items;
  //   });
  // }

  fetchEvents() {
    return this.fetch(
      "/exports/events.json?startedAt=2018-03-01&endedAt=2018-03-09&pageBased=true&limit=1000",
      ""
    )
      .then(response => {
        return {
          data: response.data.response.items,
          headers: response.headers
        };
      })
      .then(({ data, headers }) => {
        console.log("then response", data.length);
        if (data.length > 0 && headers["X-Showpad-Scroll-Id"]) {
          return data.push(
            this.fetch(
              "/exports/events.json?startedAt=2018-03-01&endedAt=2018-03-09&pageBased=true&limit=1000",
              headers["X-Showpad-Scroll-Id"]
            )
          );
        } else {
          return data;
        }
      });
  }

  fetchUserUserGroups() {
    return this.fetch("/exports/user-usergroups.json").then(response => {
      return response.data.response.items;
    });
  }

  fetchUserGroups() {
    return this.fetch("/exports/usergroups.json").then(response => {
      return response.data.response.items;
    });
  }
}
