import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class MainSeeder extends BaseSeeder {
  async run() {
    await app.container.make(await import('#database/seeders/user_seeder'))
    await app.container.make(await import('#database/seeders/instructor_seeder'))
    await app.container.make(await import('#database/seeders/course_seeder'))
  }
}
