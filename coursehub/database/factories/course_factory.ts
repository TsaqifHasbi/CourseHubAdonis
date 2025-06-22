import { Factory } from '@adonisjs/lucid/build/src/Factory'
import { Course } from 'App/Models/Course'

export default Factory.define(Course, ({ faker }) => {
  return {
    nama_kursus: faker.lorem.words(3),
    durasi: faker.random.number({ min: 1, max: 12 }) + ' months',
    instruktur_id: faker.random.number({ min: 1, max: 10 }), // Assuming there are 10 instructors
    biaya: faker.random.number({ min: 100000, max: 1000000 }),
  }
}).build()
