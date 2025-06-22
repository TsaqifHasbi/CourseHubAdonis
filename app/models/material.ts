import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Course from './course.js'

export default class Material extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare course_id: number

  @column()
  declare judul: string

  @column()
  declare deskripsi: string

  @column({ columnName: 'file_path' })
  declare filePath: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  get courseId() {
    return this.course_id
  }

  set courseId(value: number) {
    this.course_id = value
  }

  @belongsTo(() => Course, {
    foreignKey: 'course_id',
  })
  declare course: BelongsTo<typeof Course>
}
