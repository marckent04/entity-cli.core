const capitalize = require("lodash.capitalize");

const { addEntityImport, addOrmImport } = require("../../import");
const EntityManager = require("../EntityManager");
const { typeORM } = require("../../destructuringBreakpoints");
const { camelCase } = require("../../common");

class Maker {
  static async otmCommon(
    oneContent,
    manyContent,
    entityName,
    relationEntityName,
    oneRelativePath,
    manyRelativePath
  ) {
    entityName = camelCase(entityName);
    relationEntityName = camelCase(relationEntityName);

    const one = {
      typeOrmImport: ["OneToMany"],
      newContent: [
        `@OneToMany(type =>  ${relationEntityName},  ${relationEntityName.toLowerCase()} => ${relationEntityName.toLowerCase()}.${entityName.toLowerCase()})`,
        `${relationEntityName.toLowerCase()}s: ${relationEntityName}[];`,
      ],
    };


    const many = {
      typeOrmImport: ["ManyToOne"],
      newContent: [
        `\n\t@ManyToOne(type => ${entityName}, ${entityName.toLowerCase()} => ${entityName.toLowerCase()}.${relationEntityName.toLowerCase()}s)`,
        `\t${entityName.toLowerCase()}: ${entityName}`,
      ],
    };


    return {
      one: await this.common(
        oneContent,
        relationEntityName,
        one.typeOrmImport,
        one.newContent,
        oneRelativePath
      ),
      many: await this.common(
        manyContent,
        entityName,
        many.typeOrmImport,
        many.newContent,
        manyRelativePath
      ),
    };
  }

  static addTypeOrmImport = (entityContent, toImport) => {
    return addOrmImport("typeorm")(entityContent, toImport);
  };

  static async common(
    entityContent,
    relationEntity,
    typeOrmImport,
    newContent,
    entityToImportRelativePath
  ) {
    relationEntity = camelCase(relationEntity);

    const content = addEntityImport(
      this.addTypeOrmImport(entityContent, typeOrmImport),
      relationEntity,
      typeORM,
      entityToImportRelativePath
    );

    const result = await EntityManager.append(content, newContent);
    return result.join("\n");
  }

  static async oto(entityContent, relationEntity, entityToImportRelativePath) {
    
    relationEntity = camelCase(relationEntity)

    const newContent = [
      `\t@OneToOne(type => ${relationEntity})`,
      "\t@JoinColumn()",
      `\t${relationEntity.toLowerCase()}: ${relationEntity};`,
    ];

    return await this.common(
      entityContent,
      relationEntity,
      ["OneToOne", "JoinColumn"],
      newContent,
      entityToImportRelativePath
    );
  }

  static async otm(
    entityContent,
    relationContent,
    entity,
    relationEntity,
    oneRelativePath,
    manyRelativePath
  ) {
    return await this.otmCommon(
      entityContent,
      relationContent,
      entity,
      relationEntity,
      oneRelativePath,
      manyRelativePath
    );
  }

  static async mtm(entityContent, relationEntity, entityToImportRelativePath) {
    
    relationEntity = camelCase(relationEntity)

    const newContent = [
      `\t@ManyToMany(() => ${relationEntity})`,
      "\t@JoinTable()",
       `${relationEntity.toLowerCase()}s: ${relationEntity}[];`,
    ];
  
    return await this.common(
      entityContent,
      relationEntity,
      ["ManyToMany", "JoinTable"],
      newContent,
      entityToImportRelativePath
    );
  }
}

module.exports = Maker;
