import axios from "axios";
import moment from "moment";
import querystring from "querystring";

class ShowpadRequestor {
  constructor(token, timeRange, reportProgress) {
    this.baseUri = "/proxy";
    this.token = token;
    this.timeRange = timeRange;
    console.log("timeRange", timeRange);
    this.reportProgress = reportProgress || (() => {});
    this.limit = 1000;
    this.startedAt = "2018-03-21";
    this.endedAt = moment().format("YYYY-MM-DD");
    this.pageBased = "true";
    this.nbEvents = 0;
  }

  fetch(endpoint, scrollId = "") {
    const Authorization = "Bearer " + this.token;
    console.log("Authorization", Authorization);
    const headers = {
      Authorization,
      Accept: "application/json"
    };

    if (scrollId !== "") {
      headers["X-Showpad-Scroll-Id"] = scrollId;
    }

    const request = axios
      .get(this.buildUrl(endpoint), {
        headers
      })
      .then(response => {
        return {
          data: response.data.response.items,
          count: response.data.response.count,
          headers: response.headers
        };
      });

    return request;
  }

  fetchEvents(scrollId = "") {
    console.log("lastEvent", this.lastEvent);

    const { startedAt, endedAt, pageBased, limit } = this;

    const url =
      "/exports/events.json?" +
      querystring.stringify({ startedAt, endedAt, pageBased, limit });

    return this.fetch(url, scrollId).then(({ data, count, headers }) => {
      this.nbEvents += data.length;
      this.reportProgress(
        "Fetching events : " + this.nbEvents + " of " + count
      );

      if (data.length > 0 && headers["x-showpad-scroll-id"]) {
        return this.fetchEvents(headers["x-showpad-scroll-id"]).then(
          newData => {
            return data.concat(newData);
          }
        );
      } else {
        return [];
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

  buildUrl(endpoint) {
    return this.baseUri + endpoint;
  }

  set lastEvent(date) {
    this.lastEvent = date;
  }
}

export default ShowpadRequestor;
