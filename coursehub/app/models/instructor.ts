import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Registration from './registration'
import Course from './course'

export default class Instructor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public email: string

  @hasMany(() => Course)
  public courses: HasMany<typeof Course>

  @hasMany(() => Registration)
  public registrations: HasMany<typeof Registration>
}
