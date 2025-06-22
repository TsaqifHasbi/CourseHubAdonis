import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Course from './course.js'
import Student from './student.js'

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare course_id: number

  @column()
  declare participant_id: number

  @column()
  declare status: string

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

  @computed()
  get studentId() {
    return this.participant_id
  }

  set studentId(value: number) {
    this.participant_id = value
  }

  @belongsTo(() => Course, {
    foreignKey: 'course_id',
  })
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => Student, {
    foreignKey: 'participant_id',
    localKey: 'id',
  })
  declare student: BelongsTo<typeof Student>
}
