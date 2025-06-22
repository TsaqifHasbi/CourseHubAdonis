import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Course from './course'
import Student from './student'

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public courseId: number

  @column()
  public studentId: number

  @column()
  public status: string

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @belongsTo(() => Student)
  public student: BelongsTo<typeof Student>
}
