import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Courses extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nama_kursus').notNullable()
      table.integer('durasi').notNullable()
      table
        .integer('instruktur_id')
        .unsigned()
        .references('id')
        .inTable('instructors')
        .onDelete('CASCADE')
      table.decimal('biaya', 10, 2).notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
