require("file-loader?name=index.html!./index.html");
import moment from "moment";
import axios from "axios";

import assetsSchema from "./schema/assets";
import channelsSchema from "./schema/channels";
import divisionsSchema from "./schema/divisions";
import eventsSchema from "./schema/events";
import userUsergroupsSchema from "./schema/user-usergroups";
import usergroupsSchema from "./schema/usergroups";
import usersSchema from "./schema/users";
import ShowpadRequestor from "./showpad-requestor";
import ShowpadAuthentication from "./showpad-authentication";
import { joinsEventsChannels, joinsEventsDivisions } from "./schema/joins";
import { dateFormat, startDateTime } from "./settings";

let showpadRequestor;

const showpadAuthentication = new ShowpadAuthentication();

(function() {
  var myConnector = tableau.makeConnector();
  // const showpadRequestor = new ShowpadRequestor();
  myConnector.init = function(initCallback) {
    console.log("Initializing Web Data Connector. Phase is " + tableau.phase);

    // STEP 1 - WDC IS LOADED
    if (!showpadAuthentication.hasTokens()) {
      console.log("We do not have showpadAuthentication tokens available");
      if (tableau.phase != tableau.phaseEnum.gatherDataPhase) {
        toggleUIState("signIn");
        var redirectToSignIn = function() {
          // STEP 2 - REDIRECT TO LOGIN PAGE
          console.log("Redirecting to login page");
          window.location.href = "/login";
        };
        $("#signIn").click(redirectToSignIn);
        redirectToSignIn();
      } else {
        tableau.abortForAuth("Missing showpadAuthentication!");
      }

      // Early return here to avoid changing any other state
      return;
    }

    console.log("Access token found!");
    toggleUIState("content");

    // STEP 6 - TOKEN STORED IN TABLEAU PASSWORD
    console.log("Setting tableau.password to access_token and refresh tokens");
    tableau.password = JSON.stringify(showpadAuthentication.getTokens());
    console.log(
      "showpadAuthentication.getTokens()",
      showpadAuthentication.getTokens()
    );
    // const showpadApi = new ShowpadWebApi("biomerieux");
    const accessToken = showpadAuthentication.getTokens().access_token;

    showpadRequestor = new ShowpadRequestor(
      accessToken,
      tableau.connectionData,
      tableau.reportProgress
    );

    console.log("Calling initCallback");
    initCallback();

    if (tableau.phase === tableau.phaseEnum.authPhase) {
      // Immediately submit if we are running in the auth phase
      tableau.submit();
    }
  };

  myConnector.getSchema = function(schemaCallback) {
    const assetsTable = {
      id: "assets",
      alias: "assets",
      columns: assetsSchema
    };

    const channelsTable = {
      id: "channels",
      alias: "channels",
      columns: channelsSchema
    };

    const divisionsTable = {
      id: "divisions",
      alias: "divisions",
      columns: divisionsSchema
    };

    const eventsTable = {
      id: "events",
      alias: "events",
      columns: eventsSchema,
      incrementColumnId: "startTime"
    };

    const userUsergroupsTable = {
      id: "userUsergroups",
      alias: "userUsergroups",
      columns: userUsergroupsSchema
    };

    const usergroupsTable = {
      id: "usergroups",
      alias: "usergroups",
      columns: usergroupsSchema
    };

    const usersTable = {
      id: "users",
      alias: "users",
      columns: usersSchema
    };

    schemaCallback([
      assetsTable,
      channelsTable,
      divisionsTable,
      eventsTable,
      userUsergroupsTable,
      usergroupsTable,
      usersTable
    ]);
  };

  myConnector.getData = function(table, doneCallback) {
    if (table.tableInfo.hasOwnProperty("incrementColumnId")) {
      console.log("table.tableInfo", table.tableInfo);
      const date = new Date(table.incrementValue || startDateTime);
      showpadRequestor.lastEvent = date;
      showpadRequestor.reset();
    }

    const tableFunctions = {
      assets: showpadRequestor.fetchAssets.bind(showpadRequestor),
      channels: showpadRequestor.fetchChannels.bind(showpadRequestor),
      divisions: showpadRequestor.fetchDivisions.bind(showpadRequestor),
      events: showpadRequestor.fetchEvents.bind(showpadRequestor),
      userUsergroups: showpadRequestor.fetchUserUserGroups.bind(
        showpadRequestor
      ),
      usergroups: showpadRequestor.fetchUserGroups.bind(showpadRequestor),
      users: showpadRequestor.fetchUsers.bind(showpadRequestor)
    };
    if (!tableFunctions.hasOwnProperty(table.tableInfo.id)) {
      tableau.abortWithError("Unknown table ID: " + table.tableInfo.id);
      return;
    }

    // extract the datetime field from the schema to convert the date time to
    // supported format by Tableau
    const dateTimeFields = table.tableInfo.columns.reduce((fields, field) => {
      if (field.dataType === "datetime") {
        fields.push(field.id);
      }
      return fields;
    }, []);

    // console.log("columns", table.tableInfo.columns);

    let tableData = [];
    tableFunctions[table.tableInfo.id]().then(data => {
      // data = data.slice(-100);
      console.log("data", data);
      data.forEach((item, index) => {
        dateTimeFields.forEach(dateTimeField => {
          item[dateTimeField] = item[dateTimeField]
            ? moment(item[dateTimeField]).format(dateFormat)
            : "";
        });
        tableData.push(item);
      });
      table.appendRows(tableData);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);

  //-------------------------------Connector UI---------------------------//

  document.addEventListener("DOMContentLoaded", function(e) {
    const submitButton = document.querySelector("#getdata");
    submitButton.removeAttribute("disabled");
    submitButton.addEventListener("click", () => {
      // tableau.connectionName = "Showpad static online test";
      // tableau.submit();
      setupConnector();
    });
    // setupConnector();
  });

  // $(document).ready(function() {
  //   $("#getdata").click(function() {
  //     // This event fires when a button is clicked
  //     setupConnector();
  //   });
  // });

  function setupConnector() {
    tableau.connectionName = "Showpad Connector";

    // tableau.connectionName = "Showpad Connector";
    // tableau.connectionData = document.querySelector(
    // 'input[name="term"]:checked'
    // ).value;
    tableau.authType = tableau.authTypeEnum.custom;
    tableau.submit();
  }

  function toggleUIState(contentToShow) {
    const allIds = ["#spinner", "#content", "#signIn"];
    allIds.forEach(id => {
      document.querySelector(id).style.display = "none";
    });
    document.querySelector(`#${contentToShow}`).style.display = "inline-block";
    // $("#" + contentToShow).css("display", "inline-block");
  }
})();
