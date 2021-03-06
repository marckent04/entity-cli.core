const fs = require("fs");
const path = require("path");
const findLastIndex = require("lodash.findlastindex");
const chalk = require("chalk");
const { getEntitiesLocation, getFileExtension } = require("./configFile");
const { linter } = require("./linter");
const { camelCase } = require("./common");

class BaseEntityManager {
  static async directory() {
    return await getEntitiesLocation();
  }

  static get fileExtension() {
    return getFileExtension();
  }

  static async init(name) {
    return path.join(
      await this.directory(),
      `${name}.entity.${this.fileExtension}`,
    );
  }

  static template(name) {
    return Reflect.get(
      this,
      `template${camelCase(this.fileExtension)}`,
    )(camelCase(name));
  }

  static async create(name) {
    const file = path.join(
      await this.directory(),
      `${name}.entity.${this.fileExtension}`,
    );

    try {
      fs.writeFileSync(file, this.init(name));
    } catch (error) {
      if (error.errno === -2) {
        throw chalk.red("folder not found");
      }
      throw error;
    }
  }

  static update(entityPath, content) {
    fs.writeFileSync(entityPath, linter(content));
  }

  static async createPath(entityName) {
    return path.join(
      await this.directory(),
      `${entityName}.entity.${this.fileExtension}`,
    );
  }

  static async getEntityContent(entityName) {
    const filePath = await this.createPath(entityName);
    return fs.readFileSync(filePath,  'utf8');
  }

  static async append(nameOrContent, newContent, endTag) {
    const regex = new RegExp(endTag);
    let content = nameOrContent;
    let file = null;

    if (Array.isArray(newContent)) {
      newContent = newContent.join("\n");
    }

    if (!Array.isArray(nameOrContent)) {
      file = await this.createPath(nameOrContent);
      content = fs.readFileSync(file).toString().split("\n");
    }
    const lastIndex = findLastIndex(content, (line) => regex.test(line));
    content.splice(lastIndex, 0, newContent);
    if (file) fs.writeFileSync(file, linter(content));
    else return content;
  }
}

module.exports = BaseEntityManager;
