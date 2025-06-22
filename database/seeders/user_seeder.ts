import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  async run() {
    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await hash.make('password123'),
      role: 'admin',
    })

    // Create a regular user
    await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: await hash.make('password123'),
      role: 'user',
    })
  }
}
