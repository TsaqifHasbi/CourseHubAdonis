import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, computed } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Registration from './registration.js'

export default class Student extends BaseModel {
  static table = 'participants'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @column()
  declare email: string

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  get name() {
    return this.nama
  }

  set name(value: string) {
    this.nama = value
  }

  @hasMany(() => Registration, {
    foreignKey: 'participant_id',
  })
  declare registrations: HasMany<typeof Registration>
}
