export default class ShowpadRequestor {
  constructor(showpadApi, timeRange, reportProgress) {
    this.s = showpadApi;
    this.timeRange = timeRange;
    this.reportProgress = reportProgress || (() => {});
    this.defaultPageSize = 50;
    this.maxResults = 1000;
    this.retryCount = 3;
  }
}
