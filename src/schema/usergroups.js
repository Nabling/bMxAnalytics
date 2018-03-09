const schema = [
  {
    id: "usergroupId",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "name",
    alias: "Name",
    dataType: tableau.dataTypeEnum.string
  },

  {
    id: "deletedAt",
    alias: "Deleted at",
    dataType: tableau.dataTypeEnum.datetime
  }
];

export default schema;
