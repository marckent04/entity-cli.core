const {
  addRelationQuestions: addRelationsConstructor,
  addPropertyQuestions: addPropertyConstructor,
} = require("../../cli/questions");
const { typeORM } = require("../../destructuringBreakpoints");

const {
  addQuestions,
  entityCreationQuestions,
} = require("../../cli/questions");

const typeChoices = ["string", "number", "boolean", "Date", "text"];

const relationsChoices = [
  { value: "oto", name: "One-to-one" },
  { value: "otm", name: "One-to-many" },
  { value: "mto", name: "Many-to-one" },
  { value: "mtm", name: "Many-to-many" },
];

const addRelationQuestions = addRelationsConstructor(relationsChoices);
const addPropertyQuestions = addPropertyConstructor(typeORM, typeChoices);

module.exports = {
  addQuestions,
  entityCreationQuestions,
  addRelationQuestions,
  addPropertyQuestions,
};
