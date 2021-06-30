const capitalize = require("lodash.capitalize");
const BaseEntityManager = require("../BaseEntity");
const { linter } = require("../linter");

class TypeOrmManager extends BaseEntityManager {
  static init(name) {
    return linter(this.template(name));
  }

  static template(name) {
    return `
    import {Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity } from "typeorm"
    
    @Entity()
    export class ${capitalize(name)} extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @CreateDateColumn()
    createDate: Date
    
    @UpdateDateColumn()
    updateDate: Date
    }
    `;
  }

  static async append(nameOrContent, newContent) {
    return await super.append(nameOrContent, newContent, "}");
  }
}

module.exports = TypeOrmManager;
