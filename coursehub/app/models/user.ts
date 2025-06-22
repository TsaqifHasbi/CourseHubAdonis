import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Registration from './registration'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @hasMany(() => Registration)
  public registrations: HasMany<typeof Registration>

  public async savePassword(password: string) {
    this.password = await Hash.make(password)
  }

  public async verifyPassword(password: string) {
    return await Hash.verify(this.password, password)
  }
}
