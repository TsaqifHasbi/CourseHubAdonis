import Factory from '@ioc:Adonis/Lucid/Factory'
import Instructor from 'App/Models/Instructor'

export const InstructorFactory = Factory.define(Instructor, ({ faker }) => {
  return {
    nama: faker.name.findName(),
    email: faker.internet.email(),
  }
}).build()
