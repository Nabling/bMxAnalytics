const schema = [
  {
    id: "assetId",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "divisionId",
    alias: "Division Id",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "displayName",
    alias: "Display name",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "status",
    alias: "Status",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "source",
    alias: "Source",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "description",
    alias: "Description",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "type",
    alias: "Type",
    dataType: tableau.dataTypeEnum.string
  },
  {
    id: "isSensitive",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "isShareable",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "isDownloadable",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "isDivisionShared",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "isAnnotatable",
    dataType: tableau.dataTypeEnum.bool
  },
  {
    id: "expiresAt",
    alias: "Expires At",
    dataType: tableau.dataTypeEnum.datetime
  },
  {
    id: "releasedAt",
    alias: "Released At",
    dataType: tableau.dataTypeEnum.datetime
  },
  {
    id: "deletedAt",
    alias: "deleted at",
    dataType: tableau.dataTypeEnum.datetime
  }
];

export default schema;
