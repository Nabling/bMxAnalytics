require("file-loader?name=index.html!./index.html");
import moment from "moment";

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
const dateFormat = "Y-MM-DD HH:mm:ss";
let showpadRequestor;
// Define our Web Data Connector
(function() {
  var myConnector = tableau.makeConnector();
  // const showpadRequestor = new ShowpadRequestor();
  myConnector.init = function(initCallback) {
    console.log("Initializing Web Data Connector. Phase is " + tableau.phase);

    // STEP 1 - WDC IS LOADED
    if (!ShowpadAuthentication.hasTokens()) {
      console.log("We do not have ShowpadAuthentication tokens available");
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
        tableau.abortForAuth("Missing ShowpadAuthentication!");
      }

      // Early return here to avoid changing any other state
      return;
    }

    console.log("Access token found!");
    toggleUIState("content");

    // STEP 6 - TOKEN STORED IN TABLEAU PASSWORD
    console.log("Setting tableau.password to access_token and refresh tokens");
    tableau.password = JSON.stringify(ShowpadAuthentication.getTokens());

    const s = new ShowpadWebApi();
    s.accessToken = ShowpadAuthentication.getAccessToken();

    showpadRequestor = new ShowpadRequestor(
      s,
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
      columns: eventsSchema
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
    console.log("getData called for table " + table.tableInfo.id);
    var tableFunctions = {
      topArtists: showpadRequestor.getMyTopArtists.bind(showpadRequestor),
      topTracks: showpadRequestor.getMyTopTracks.bind(showpadRequestor),
      artists: showpadRequestor.getMySavedArtists.bind(showpadRequestor),
      albums: showpadRequestor.getMySavedAlbums.bind(showpadRequestor),
      tracks: showpadRequestor.getMySavedTracks.bind(showpadRequestor)
    };

    if (!tableFunctions.hasOwnProperty(table.tableInfo.id)) {
      tableau.abortWithError("Unknown table ID: " + table.tableInfo.id);
      return;
    }

    tableFunctions[table.tableInfo.id]().then(
      function(rows) {
        table.appendRows(rows);
        doneCallback();
      },
      function(error) {
        console.log("Error occured waiting for promises. Aborting");
        tableau.abortWithError(error.toString());
        doneCallback();
      }
    );
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
