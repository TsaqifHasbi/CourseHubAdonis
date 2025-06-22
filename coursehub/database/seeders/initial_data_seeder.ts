import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'
import Instructor from 'App/Models/Instructor'
import User from 'App/Models/User'

export default class InitialDataSeeder extends BaseSeeder {
  public async run() {
    // Create instructors
    const instructor1 = await Instructor.create({
      nama: 'John Doe',
      email: 'john.doe@example.com',
    })

    const instructor2 = await Instructor.create({
      nama: 'Jane Smith',
      email: 'jane.smith@example.com',
    })

    // Create courses
    await Course.createMany([
      {
        nama_kursus: 'Introduction to Programming',
        durasi: '3 months',
        instruktur_id: instructor1.id,
        biaya: 500000,
      },
      {
        nama_kursus: 'Web Development',
        durasi: '4 months',
        instruktur_id: instructor2.id,
        biaya: 700000,
      },
      {
        nama_kursus: 'Data Science',
        durasi: '5 months',
        instruktur_id: instructor1.id,
        biaya: 800000,
      },
      {
        nama_kursus: 'Machine Learning',
        durasi: '6 months',
        instruktur_id: instructor2.id,
        biaya: 900000,
      },
    ])

    // Create admin user
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin',
    })

    // Create regular user
    await User.create({
      username: 'student',
      email: 'student@example.com',
      password: 'studentpassword',
      role: 'user',
    })
  }
}
