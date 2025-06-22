import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Materials extends BaseSchema {
  protected tableName = 'materials'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('kursus_id').unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table.string('judul').notNullable()
      table.text('deskripsi').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
