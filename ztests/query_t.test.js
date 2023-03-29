function parseQuery(query) {
  const result = {};

  const actionMatch = query.match(/^\s*(SELECT|INSERT|UPDATE|DELETE)\s/i);
  if (!actionMatch) {
    throw new Error("Invalid query: action not found");
  }
  result.action = actionMatch[1].toUpperCase();

  const tableMatch = query.match(/FROM\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error("Invalid query: table not found");
  }
  result.table = tableMatch[1];

  const columnsMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
  if (columnsMatch) {
    if (columnsMatch[1] === "*") {
      result.columns = "*";
    } else {
      result.columns = columnsMatch[1].split(/,\s*/);
    }
  }

  const whereMatch = query.match(/WHERE\s+(.*)$/i);
  if (whereMatch) {
    const whereClause = whereMatch[1].replace(/\$(\w+)/g, "'$1'");

    const andConditions = whereClause.split(/\s+AND\s+/i).map((condition) => {
      const [column, value] = condition.split(/\s*=\s*/);
      if (value.startsWith(">=")) {
        return { [column]: `>= '${value.substr(2)}'` };
      } else if (value.startsWith("<=")) {
        return { [column]: `<= '${value.substr(2)}'` };
      } else if (value.startsWith(">")) {
        return { [column]: `> '${value.substr(1)}'` };
      } else if (value.startsWith("<")) {
        return { [column]: `< '${value.substr(1)}'` };
      } else if (value.startsWith("!=")) {
        return { [column]: `!= '${value.substr(2)}'` };
      } else if (value.includes(",")) {
        return { [column]: `IN (${value})` };
      } else {
        return { [column]: value };
      }
    });

    const orConditions = whereClause.split(/\s+OR\s+/i).map((condition) => {
      const [column, value] = condition.split(/\s*=\s*/);
      if (value.startsWith(">=")) {
        return { [column]: `>= '${value.substr(2)}'` };
      } else if (value.startsWith("<=")) {
        return { [column]: `<= '${value.substr(2)}'` };
      } else if (value.startsWith(">")) {
        return { [column]: `> '${value.substr(1)}'` };
      } else if (value.startsWith("<")) {
        return { [column]: `< '${value.substr(1)}'` };
      } else if (value.startsWith("!=")) {
        return { [column]: `!= '${value.substr(2)}'` };
      } else if (value.includes(",")) {
        return { [column]: `IN (${value})` };
      } else {
        return { [column]: value };
      }
    });

    if (andConditions.length === 1) {
      result.where = andConditions[0];
    } else if (orConditions.length === 1) {
      result.where = orConditions[0];
    } else {
      result.where = {
        AND: andConditions.reduce((acc, condition) => {
          return { ...acc, ...condition };
        }, {}),
        OR: orConditions.reduce((acc, condition) => {
          return { ...acc, ...condition };
        }, {}),
      };
    }
  }

  const orderMatch = query.match(/ORDER BY\s+(.*)$/i);
  if (orderMatch) {
    const orderColumns = orderMatch[1].split(/,\s*/).map((column) => {
      const [name, direction] = column.split(/\s+/);
      return { column: name, direction: direction.toUpperCase() };
    });
    result.orderBy = orderColumns;
  }

  const limitMatch = query.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    result.limit = parseInt(limitMatch[1]);
  }

  return result;
}

console.log(
  parseQuery(
    "SELECT * FROM animals WHERE id=$id AND name=$name ORDER BY id ASC, name DESC LIMIT 25;"
  )
);
console.log(
  parseQuery(
    "INSERT INTO animals (name, legs, created_at, updated_at) VALUES ($name, $legs, DATETIME('NOW'), DATETIME('NOW')) RETURNING *;"
  )
);
console.log(
  parseQuery(
    "UPDATE animals SET name=$name, updated_at=DATETIME('NOW')  WHERE id=$id RETURNING *;"
  )
);
console.log(parseQuery("DELETE FROM animals WHERE id=$id RETURNING *;"));
