import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Registration from 'App/Models/Registration'
import Course from 'App/Models/Course'
import Student from 'App/Models/Student'

export default class RegistrationsController {
  public async index({ view }: HttpContextContract) {
    const registrations = await Registration.query().preload('course').preload('student')
    return view.render('admin.registrations.index', { registrations })
  }

  public async create({ view }: HttpContextContract) {
    const courses = await Course.all()
    const students = await Student.all()
    return view.render('admin.registrations.create', { courses, students })
  }

  public async store({ request, response }: HttpContextContract) {
    const courseId = request.input('course_id')
    const studentId = request.input('student_id')

    const existingRegistration = await Registration.query()
      .where('course_id', courseId)
      .where('student_id', studentId)
      .first()

    if (existingRegistration) {
      return response.badRequest('Student is already registered for this course.')
    }

    const registration = new Registration()
    registration.courseId = courseId
    registration.studentId = studentId
    registration.status = request.input('status')
    await registration.save()

    return response.redirect().toRoute('registrations.index')
  }

  public async edit({ params, view }: HttpContextContract) {
    const registration = await Registration.query()
      .where('id', params.id)
      .preload('course')
      .preload('student')
      .firstOrFail()

    const courses = await Course.all()
    const students = await Student.all()
    return view.render('admin.registrations.edit', { registration, courses, students })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const registration = await Registration.findOrFail(params.id)
    registration.status = request.input('status')
    await registration.save()

    return response.redirect().toRoute('registrations.index')
  }

  public async destroy({ params, response }: HttpContextContract) {
    const registration = await Registration.findOrFail(params.id)
    await registration.delete()

    return response.redirect().toRoute('registrations.index')
  }
}
