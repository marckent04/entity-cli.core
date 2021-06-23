const propertyMaker = require("./property");
const { camelCase } = require("../../common");

class Maker extends propertyMaker {
  static hasMany(entity) {
    const modelType = "[any]";
    return {
      entity: `
        ${camelCase(entity, false)}s: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: '${camelCase(entity)}',
          },
        ]`,
      model: `${camelCase(entity, false)}s: ${modelType}`,
    };
  }

  static hasOne(entity) {
    // const modelType = this.typeHandler("mongoose.Schema.Types.ObjectId");

    return {
      entity: `
        ${camelCase(entity, false)}: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: '${camelCase(entity)}',
        }
      `,
      model: `${camelCase(entity, false)}: any`,
    };
  }
}

module.exports = Maker;
