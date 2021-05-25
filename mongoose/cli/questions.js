const { mongoose } = require("../../destructuringBreakpoints");
const { entityCreationQuestions } = require("../../cli/questions");
const { getModuleMode } = require("../../configFile");
const { getRelationModules } = require("../../features/module-mode");
const { existingEntities } = require("../../index");

const storage = require("node-persist");
const {
  addPropertyQuestions: addPropertyConstructor,
  addQuestions,
} = require("../../cli/questions");

const typeChoices = [
  "String",
  "Number",
  "Boolean",
  "Date",
  "ObjectId",
  "Buffer",
];

const addPropertyQuestions = addPropertyConstructor(mongoose, typeChoices);

const addRelationQuestions = (entity) => {
  const moduleQuestion = {
    type: "autocomplete",
    name: "module",
    message: "Choose a module",
    source: function (_, input) {
      const regex = new RegExp(input, "gi");
      return getRelationModules(entity).filter((module) => module.match(regex));
    },
    validate: async ({ value }) => {
      await storage.setItem("targetModule", value);
      return true;
    },
  };
  const questions = [
    {
      type: "autocomplete",
      name: "entity",
      message: "Choose the entity",
      source: async (previous, _) => {
        const { module } = previous;
        const entities = await existingEntities(entity, module);
        return entities;
      },
    },
    {
      type: "list",
      name: "relation",
      message: "Relationship",
      choices: ["hasMany", "hasOne"],
    },
    {
      type: "confirm",
      name: "add",
      message: "Add new property",
      default: false,
    },
  ];

  if (getModuleMode()) {
    questions.unshift(moduleQuestion);
  }

  return questions;
};

module.exports = {
  entityCreationQuestions,
  addPropertyQuestions,
  addQuestions,
  addRelationQuestions,
};
