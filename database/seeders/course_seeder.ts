import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Course from '#models/course'

export default class CourseSeeder extends BaseSeeder {
  async run() {
    await Course.createMany([
      {
        namaCourse: 'Introduction to Web Development',
        durasi: '8 weeks',
        instructorId: 1,
        biaya: 500000,
      },
      {
        namaCourse: 'Advanced JavaScript',
        durasi: '10 weeks',
        instructorId: 2,
        biaya: 750000,
      },
      {
        namaCourse: 'Database Design',
        durasi: '6 weeks',
        instructorId: 3,
        biaya: 450000,
      },
      {
        namaCourse: 'Mobile App Development',
        durasi: '12 weeks',
        instructorId: 1,
        biaya: 850000,
      },
    ])
  }
}
