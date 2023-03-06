import "pluralizer";

export const getTableNameFromModel = (model) => model.toLowerCase().pluralize();