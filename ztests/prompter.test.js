import pluralize from "pluralize";
import prompts from "prompts";
import "../bin/utils/js_utils.js";
import {
  MigrationActions,
  PATHS,
  SQLColumnConstraints,
  SQLColumnTypes,
  SQLForeignKeyActions,
  SQLReferences,
} from "../bin/constants.js";
import { getSchema } from "../bin/utils/schema_utils.js";
import { getTableNameFromModel } from "../bin/utils/model_utils.js";
import { MigrationBuilder } from "../bin/builders/MigrationBuilder.js";
import { readdirSync } from "../bin/utils/file_utils.js";

const PromptGlobals = {
  RESTART: "APPLICATION_RESTART",
  EXIT: "APPLICATION_EXIT",
};

const Generators = {
  MODEL: "MODEL",
  CONTROLLER: "CONTROLLER",
  VIEWS: "VIEWS",
  SCAFFOLD: "SCAFFOLD",
  MIGRATION: "MIGRATION",
};

const ColumnAction = {
  ADD: "ADD",
  DONE: "DONE",
};

const BooleanAnswers = {
  YES: true,
  NO: false,
};

const word = /\W/gi;

const generator = await selectGenerator();

switch (generator) {
  case Generators.MODEL:
    {
      const model = await enterModelName();
      const columns = await addColumns();
      const migration = new MigrationBuilder()
        .withAction(MigrationActions.CREATE)
        .withColumns(columns);
      console.log(`Selected generator: ${generator}, selected model: ${model}`);
      console.log(columns);
      columns.forEach(
        ({
          name,
          type,
          constraint,
          defaultVal,
          referenceTable,
          referenceColumn,
        }) => {
          console.log(`Selected column: ${name}, ${type}, ${constraint}`);
          defaultVal && console.log(`With default value: ${defaultVal}`);
          referenceTable &&
            referenceColumn &&
            console.log(
              `Foreign key REFERENCES ${referenceTable}(${referenceColumn})`
            );
        }
      );
    }
    break;
  case Generators.CONTROLLER:
    {
      let confirmRouterOverwrite;
      const model = await enterModelName();
      const existingRouters = readdirSync(PATHS.root, PATHS.routers).map(
        (file) => file.name.split(".").first()
      );
      const routerName = getTableNameFromModel(model);
      if (existingRouters.includes(routerName)) {
        confirmRouterOverwrite = await askYesOrNo(
          `Router '${routerName}' already exists. Overwrite?`
        );
        console.log(`You answered: ${confirmRouterOverwrite}`);
      }
      if (confirmRouterOverwrite) {
        console.log(`Creating router ${routerName}`);
      }
    }
    break;
  case Generators.VIEWS:
    {
      const model = await enterModelName();
      const viewFolderName = getTableNameFromModel(model);
    }
    break;
  case Generators.SCAFFOLD:
    {
    }
    break;
  case Generators.MIGRATION:
    {
      const migrationAction = await selectMigrationAction();
      let migrationSubAction,
        migrationActionTable,
        migrationActionTableColumns,
        addedColumns = [];
      if (
        migrationAction.isOneOf(MigrationActions.ALTER, MigrationActions.DROP)
      ) {
        migrationActionTable = await selectTable(migrationAction);
      }
      if (migrationAction === MigrationActions.ALTER) {
        migrationSubAction = await selectMigrationSubAction();
      }
      if (migrationSubAction === MigrationActions.subActions.DROP) {
        migrationActionTableColumns = await selectColumns(migrationActionTable);
      } else if (migrationSubAction === MigrationActions.subActions.ADD) {
        addedColumns = await addColumns();
      }
      console.log(`Selected action: ${migrationAction}`);
      migrationActionTable &&
        console.log(`Selected table: ${migrationActionTable}`);
      migrationSubAction &&
        console.log(`Selected subAction: ${migrationSubAction}`);
      migrationActionTableColumns &&
        console.log(
          `Selected columns: ${migrationActionTableColumns.join(", ")}`
        );
      addedColumns.length &&
        console.log(
          `Added columns: ${addedColumns
            .map(
              (column) => `${column.name} ${column.type} ${column.constraint}`
            )
            .join(", ")}`
        );
    }
    break;
  case PromptGlobals.RESTART:
    break;
  case PromptGlobals.EXIT:
    break;
  default:
    break;
}

async function addColumns() {
  const columns = [];
  while ((await enterColumnAction()) === ColumnAction.ADD) {
    columns.push(await addColumn());
    console.log(
      "Current columns:",
      `[${columns.map((column) => column.name).join(", ")}]`
    );
  }
  return columns;
}

async function selectGenerator() {
  const { generator } = await prompts({
    type: "select",
    name: "generator",
    message: "What would you like to generate?",
    choices: [
      { title: "Generate model", value: Generators.MODEL },
      { title: "Generate controller", value: Generators.CONTROLLER },
      { title: "Generate views", value: Generators.VIEWS },
      { title: "Generate scaffold", value: Generators.SCAFFOLD },
      { title: "Generate migration", value: Generators.MIGRATION },
      { title: "Restart Application", value: PromptGlobals.RESTART },
      { title: "Exit", value: PromptGlobals.EXIT },
    ],
    initial: 0,
  });

  return generator;
}

async function askYesOrNo(message) {
  const { answer } = await prompts({
    type: "select",
    name: "answer",
    message,
    choices: [
      { title: "Yes", value: BooleanAnswers.YES },
      { title: "No", value: BooleanAnswers.NO },
      { title: "Restart Application", value: PromptGlobals.RESTART },
      { title: "Exit", value: PromptGlobals.EXIT },
    ],
    initial: 0,
  });
  return answer;
}

async function selectMigrationAction() {
  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "What action would you like to take for migration?",
    choices: [
      { title: "Create Table", value: MigrationActions.CREATE },
      { title: "Alter Table", value: MigrationActions.ALTER },
      { title: "Drop Table", value: MigrationActions.DROP },
      { title: "Restart Application", value: PromptGlobals.RESTART },
      { title: "Exit", value: PromptGlobals.EXIT },
    ],
    initial: 0,
  });

  return action;
}

async function selectMigrationSubAction() {
  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "What action would you like to take for migration?",
    choices: [
      { title: "Add Column", value: MigrationActions.subActions.ADD },
      { title: "Drop Column", value: MigrationActions.subActions.DROP },
      { title: "Restart Application", value: PromptGlobals.RESTART },
      { title: "Exit", value: PromptGlobals.EXIT },
    ],
    initial: 0,
  });

  return action;
}

async function enterModelName() {
  const { model } = await prompts({
    type: "text",
    name: "model",
    message: "Enter model name",
    validate: (value) =>
      pluralize.isPlural(value) || value.match(word)?.length > 0
        ? `Invalid model name`
        : true,
  });

  return model.capitalize();
}

async function enterColumnAction() {
  const { columnAction } = await prompts({
    type: "select",
    name: "columnAction",
    message: "Select an option",
    choices: [
      { title: "Add column", value: ColumnAction.ADD },
      { title: "Done", value: ColumnAction.DONE },
    ],
  });
  return columnAction;
}

async function selectColumns(table) {
  const { columns } = await prompts({
    type: "multiselect",
    name: "columns",
    message: "Select column(s):",
    choices: getSchema().tables[table].map((value) => ({
      title: value.name,
      value: value.name,
    })),
  });

  return columns;
}

async function selectTable(action) {
  const { selectedTable } = await prompts({
    type: "select",
    name: "selectedTable",
    message: `Which table would you like to ${action.toLowerCase()}?`,
    choices: getSchema()
      .tables.keys()
      .map((value) => ({ title: value, value })),
    initial: 0,
  });
  return selectedTable;
}

async function addColumn() {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Enter column name",
    validate: (value) => (value.length < 1 ? `Invalid column name` : true),
  });

  const { type } = await prompts({
    type: "select",
    name: "type",
    message: "Enter column type",
    choices: SQLColumnTypes.values()
      .distinct()
      .map((value) => ({ title: value, value })),
    initial: 0,
  });

  const { constraint } = await prompts({
    type: "select",
    name: "constraint",
    message: "Enter constraint",
    choices: SQLColumnConstraints.values()
      .distinct()
      .map((value, index) => ({ title: value, value, order: index }))
      .add({ title: "FOREIGN KEY", value: SQLReferences, order: 999 })
      .add({ title: "NONE", value: "NONE", order: -1 })
      .sort((a, b) => a.order - b.order),
    initial: 0,
  });

  if (constraint === SQLColumnConstraints.DEFAULT) {
    const { defaultVal } = await prompts({
      type: "text",
      name: "defaultVal",
      message: "Enter default value",
      validate: (value) => (value.length < 1 ? `Invalid default value` : true),
    });

    return new MigrationBuilder.Column(
      MigrationActions.subActions.ADD,
      name,
      type,
      new MigrationBuilder.Constraint(constraint, defaultVal)
    ); // { name, type, constraint, defaultVal };
  } else if (constraint === SQLReferences) {
    const { referenceTable } = await prompts({
      type: "select",
      name: "referenceTable",
      message: "Enter reference table for foreign key",
      choices: getSchema()
        .tables.keys()
        .map((value) => ({ title: value, value })),
      initial: 0,
    });
    const { referenceColumn } = await prompts({
      type: "select",
      name: "referenceColumn",
      message: "Enter reference column for foreign key",
      choices: getSchema().tables[referenceTable].map((value) => ({
        title: value.name,
        value: value.name,
      })),
      initial: 0,
    });

    const { onDelete } = await prompts({
      type: "select",
      name: "onDelete",
      message: "Select ON DELETE action",
      choices: SQLForeignKeyActions.values()
        .distinct()
        .map((value) => ({
          title: value,
          value,
        })),
      initial: 0,
    });

    const { onUpdate } = await prompts({
      type: "select",
      name: "onUpdate",
      message: "Select ON UPDATE action",
      choices: SQLForeignKeyActions.values()
        .distinct()
        .map((value) => ({
          title: value,
          value,
        })),
      initial: 0,
    });

    return new MigrationBuilder.ForeignKey(
      referenceTable,
      referenceColumn,
      onDelete,
      onUpdate
    );

    // return {
    //   name,
    //   type,
    //   constraint,
    //   referenceTable,
    //   referenceColumn,
    //   onDelete,
    //   onUpdate,
    // };
  }
  return new MigrationBuilder.Column(
    MigrationActions.subActions.ADD,
    name,
    type,
    new MigrationBuilder.Constraint(constraint)
  );
  return { name, type, constraint };
}
