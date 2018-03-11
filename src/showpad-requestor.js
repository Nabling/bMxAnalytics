import axios from "axios";
import moment from "moment";
import querystring from "querystring";

class ShowpadRequestor {
  constructor(showpadApi, timeRange, reportProgress) {
    this.showpadApi = showpadApi;
    this.timeRange = timeRange;
    console.log("timeRange", timeRange);
    this.reportProgress = reportProgress || (() => {});
    console.log("this.endDate", this.endDate);
    this.limit = 1000;
    this.startedAt = "2018-03-09";
    this.endedAt = moment().format("YYYY-MM-DD");
    this.pageBased = "true";
  }

  fetch(endpoint, scrollId = "") {
    console.log("this is fetch of ", endpoint);
    const Authorization = "Bearer " + this.showpadApi.accessToken;
    const headers = {
      Authorization,
      Accept: "application/json"
    };

    if (scrollId !== "") {
      headers["X-Showpad-Scroll-Id"] = scrollId;
    }

    const request = axios
      .get(this.showpadApi.buildUrl(endpoint), {
        headers
      })
      .then(response => {
        console.log("response", response);
        return {
          data: response.data.response.items,
          count: response.data.response.count,
          headers: response.headers
        };
      });

    return request;
  }

  fetchEvents() {
    const q = `/exports/events.json?startedAt=2018-03-09&endedAt=${
      this.endDate
    }&pageBased=true&limit=1000`;
    const { startedAt, endedAt, pageBased, limit } = this;
    const url =
      "/exports/events.json?" +
      querystring.stringify({ startedAt, endedAt, pageBased, limit });

    return this.fetch(url).then(({ data, count, headers }) => {
      this.reportProgress(
        "Received data for Events. Retrieved " + data.length + " of " + count
      );

      console.log("response headers", headers);

      if (data.length > 0 && headers["X-Showpad-Scroll-Id"]) {
        return data.push(this.fetch(url, headers["X-Showpad-Scroll-Id"]));
      } else {
        return data;
      }
    });
  }

  fetchUsers() {
    return this.fetch("/exports/users.json").then(({ data }) => {
      return data;
    });
  }

  fetchAssets() {
    return this.fetch("/exports/assets.json").then(({ data }) => {
      return data;
    });
  }

  fetchChannels() {
    return this.fetch("/exports/channels.json").then(({ data }) => {
      return data;
    });
  }

  fetchDivisions() {
    return this.fetch("/exports/divisions.json").then(({ data }) => {
      return data;
    });
  }

  fetchUserUserGroups() {
    return this.fetch("/exports/user-usergroups.json").then(({ data }) => {
      return data;
    });
  }

  fetchUserGroups() {
    return this.fetch("/exports/usergroups.json").then(({ data }) => {
      return data;
    });
  }
}

export default ShowpadRequestor;
