import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Instructors extends BaseSchema {
  protected tableName = 'instructors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nama').notNullable()
      table.string('email').notNullable().unique()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
