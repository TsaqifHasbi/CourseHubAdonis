import { BaseModel, column, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Registration from './registration'
import Material from './material'
import Instructor from './instructor'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama_kursus: string

  @column()
  public durasi: string

  @column()
  public instruktur_id: number

  @column()
  public biaya: number

  @hasMany(() => Registration)
  public registrations: HasMany<typeof Registration>

  @hasMany(() => Material)
  public materials: HasMany<typeof Material>

  @belongsTo(() => Instructor)
  public instructor: BelongsTo<typeof Instructor>
}
