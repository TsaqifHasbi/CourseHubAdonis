import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Instructor from '#models/instructor'

export default class InstructorSeeder extends BaseSeeder {
  async run() {
    await Instructor.createMany([
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
      {
        name: 'Michael Johnson',
        email: 'michael.johnson@example.com',
      },
    ])
  }
}
