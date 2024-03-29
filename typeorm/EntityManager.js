const BaseEntityManager = require("../BaseEntity");
const { linter } = require("../linter");
const { camelCase } = require("../common");

class TypeOrmManager extends BaseEntityManager {
  static init(name) {
    return linter(this.template(name));
  }

  static templateTs(name) {
    const tableName = name.endsWith("s") ? name : name + "s";
    return `
    //  Generated by entity-cli

    import {Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity } from "typeorm"
    
    @Entity({ name: '${camelCase(tableName)}' })
    export class ${camelCase(name)} extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date
    }
    `;
  }

  static async append(nameOrContent, newContent) {
    return await super.append(nameOrContent, newContent, "}");
  }
}

module.exports = TypeOrmManager;
