import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Registrations extends BaseSchema {
  protected tableName = 'registrations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('kursus_id').unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table
        .integer('peserta_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
      table.string('status').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
