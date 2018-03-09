const schema = [
  {
    id: "userId",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "firstName",
    alias: "First name",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "lastName",
    alias: "Last name",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "emailAddress",
    alias: "Email",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "deletedAt",
    alias: "Deleted at",
    dataType: tableau.dataTypeEnum.datetime
  }
];

export default schema;
