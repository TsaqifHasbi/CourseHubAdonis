import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nama_course').notNullable()
      table.string('durasi').notNullable()
      table
        .integer('instructor_id')
        .unsigned()
        .references('id')
        .inTable('instructors')
        .onDelete('CASCADE')
      table.decimal('biaya', 12, 2).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
