import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Create an admin user
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    })

    // Create a default user
    await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
      role: 'user',
    })
  }
}
