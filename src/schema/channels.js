const schema = [
  {
    id: "channelId",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "name",
    alias: "name",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "status",
    alias: "status",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "deletedAt",
    alias: "deleted at",
    dataType: tableau.dataTypeEnum.datetime
  }
];

export default schema;
