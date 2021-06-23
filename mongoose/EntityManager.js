const BaseEntityManager = require("../BaseEntity");
const { linter } = require("../linter");
const { camelCase } = require("../common");

const {
  InterfaceDeclaration,
  TypescriptParser,
  VariableDeclaration,
} = require("typescript-parser");

class MongooseManager extends BaseEntityManager {
  static init(name) {
    return linter(this.template(name));
  }

  static templateJs(name) {
    return `
      import * as mongoose from 'mongoose'
      
      export const ${name} = new mongoose.Schema({}, { timestamps: true })
    `;
  }

  static templateTs(name) {
    return `
      import * as mongoose from 'mongoose'
      
      export interface ${name}Interface extends mongoose.Document {}

      export const ${name} = new mongoose.Schema({}, { timestamps: true })
    `;
  }

  static async append(entityName, contentToAdd) {
    const parser = new TypescriptParser();

    const content = await this.getEntityContent(entityName);

    const parsed = await parser.parseSource(content);

    const entity = parsed.declarations.find(
      (declaration) =>
        declaration instanceof VariableDeclaration &&
        declaration.name == camelCase(entityName),
    );

    if (entity) {
      const entityContent = content.slice(entity.start, entity.end);

      const regex = new RegExp("}", "gi");
      const indices = [];
      let result;

      let sliceIndex = entityContent.lastIndexOf("}");

      if (entityContent.indexOf("timestamp")) {
        while ((result = regex.exec(entityContent))) {
          indices.push(result.index);
        }
        sliceIndex = indices[indices.length - 2];
      }

      const begin = entityContent.slice(0, sliceIndex);

      const end = entityContent.slice(sliceIndex);

      const newEntityContent = begin + contentToAdd.entity + end;

      const finalContent = content.replace(entityContent, newEntityContent);

      this.update(await this.createPath(entityName), finalContent);

      if (super.fileExtension == "ts") {
        this.appendInterface(entityName, contentToAdd.model);
      }
    } else {
      throw camelCase(entityName) + " Entity not found ";
    }
  }

  static async appendInterface(entityName, contentToAdd) {
    const parser = new TypescriptParser();

    const content = await this.getEntityContent(entityName);

    const parsed = await parser.parseSource(content);

    const entity = parsed.declarations.find(
      (declaration) =>
        declaration instanceof InterfaceDeclaration &&
        declaration.name == `${camelCase(entityName)}Interface`,
    );

    if (entity) {
      const entityContent = content.slice(entity.start, entity.end);

      const index = entityContent.indexOf("}");

      const begin = entityContent.slice(0, index);

      const end = entityContent.slice(index);

      const newEntityContent = begin + contentToAdd + end;

      const finalContent = content.replace(entityContent, newEntityContent);

      this.update(await this.createPath(entityName), finalContent);
    } else {
      throw `${camelCase(entityName)}Interface` + " not found";
    }
  }
}

module.exports = MongooseManager;
