import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Instructor from './instructor.js'
import Material from './material.js'
import Registration from './registration.js'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama_kursus: string

  @column()
  declare durasi: number

  @column()
  declare biaya: number

  @column()
  declare instruktur_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Instructor, {
    foreignKey: 'instruktur_id',
  })
  declare instructor: BelongsTo<typeof Instructor>

  @hasMany(() => Material, {
    foreignKey: 'course_id',
  })
  declare materials: HasMany<typeof Material>

  @hasMany(() => Registration, {
    foreignKey: 'course_id',
  })
  declare registrations: HasMany<typeof Registration>
}
