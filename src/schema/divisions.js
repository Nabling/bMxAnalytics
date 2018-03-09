const schema = [
  {
    id: "divisionId",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "divisionName",
    alias: "Division name",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "isGlobal",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "isPersonal",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "deletedAt",
    alias: "deleted at",
    dataType: tableau.dataTypeEnum.datetime
  }
];

export default schema;
