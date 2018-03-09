export const joinsEventsChannels = {
  alias: "Events and Channels",
  tables: [
    {
      id: "channels",
      alias: "channels"
    },
    {
      id: "events",
      alias: "events"
    }
  ],
  joins: [
    {
      left: {
        tableAlias: "channels",
        columnId: "channelId"
      },
      right: {
        tableAlias: "events",
        columnId: "channelId"
      },
      joinType: "inner"
    }
  ]
};

export const joinsEventsDivisions = {
  alias: "Events and Divisions",
  tables: [
    {
      id: "divisions",
      alias: "divisions"
    },
    {
      id: "events",
      alias: "events"
    }
  ],
  joins: [
    {
      left: {
        tableAlias: "divisions",
        columnId: "divisionId"
      },
      right: {
        tableAlias: "events",
        columnId: "divisionId"
      },
      joinType: "inner"
    }
  ]
};
