import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import Instructor from 'App/Models/Instructor'
import Registration from 'App/Models/Registration'

export default class AdminController {
  public async dashboard({ view }: HttpContextContract) {
    const totalCourses = await Course.count()
    const totalInstructors = await Instructor.count()
    const totalRegistrations = await Registration.count()

    return view.render('admin.dashboard', {
      totalCourses,
      totalInstructors,
      totalRegistrations,
    })
  }

  public async listCourses({ view }: HttpContextContract) {
    const courses = await Course.query().preload('instructor')
    return view.render('admin.courses.index', { courses })
  }

  public async createCourse({ view }: HttpContextContract) {
    const instructors = await Instructor.all()
    return view.render('admin.courses.create', { instructors })
  }

  public async storeCourse({ request, response }: HttpContextContract) {
    const courseData = request.only(['nama_kursus', 'durasi', 'instructor_id', 'biaya'])
    await Course.create(courseData)
    return response.redirect().toRoute('admin.courses.index')
  }

  public async editCourse({ params, view }: HttpContextContract) {
    const course = await Course.findOrFail(params.id)
    const instructors = await Instructor.all()
    return view.render('admin.courses.edit', { course, instructors })
  }

  public async updateCourse({ params, request, response }: HttpContextContract) {
    const course = await Course.findOrFail(params.id)
    course.merge(request.only(['nama_kursus', 'durasi', 'instructor_id', 'biaya']))
    await course.save()
    return response.redirect().toRoute('admin.courses.index')
  }

  public async deleteCourse({ params, response }: HttpContextContract) {
    const course = await Course.findOrFail(params.id)
    await course.delete()
    return response.redirect().toRoute('admin.courses.index')
  }

  public async listInstructors({ view }: HttpContextContract) {
    const instructors = await Instructor.all()
    return view.render('admin.instructors.index', { instructors })
  }

  public async createInstructor({ view }: HttpContextContract) {
    return view.render('admin.instructors.create')
  }

  public async storeInstructor({ request, response }: HttpContextContract) {
    const instructorData = request.only(['nama', 'email'])
    await Instructor.create(instructorData)
    return response.redirect().toRoute('admin.instructors.index')
  }

  public async editInstructor({ params, view }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    return view.render('admin.instructors.edit', { instructor })
  }

  public async updateInstructor({ params, request, response }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    instructor.merge(request.only(['nama', 'email']))
    await instructor.save()
    return response.redirect().toRoute('admin.instructors.index')
  }

  public async deleteInstructor({ params, response }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    await instructor.delete()
    return response.redirect().toRoute('admin.instructors.index')
  }

  public async listRegistrations({ view }: HttpContextContract) {
    const registrations = await Registration.query().preload('course').preload('student')
    return view.render('admin.registrations.index', { registrations })
  }

  public async createRegistration({ view }: HttpContextContract) {
    const courses = await Course.all()
    const students = await Student.all()
    return view.render('admin.registrations.create', { courses, students })
  }

  public async storeRegistration({ request, response }: HttpContextContract) {
    const registrationData = request.only(['course_id', 'student_id', 'status'])
    await Registration.create(registrationData)
    return response.redirect().toRoute('admin.registrations.index')
  }

  public async editRegistration({ params, view }: HttpContextContract) {
    const registration = await Registration.findOrFail(params.id)
    const courses = await Course.all()
    const students = await Student.all()
    return view.render('admin.registrations.edit', { registration, courses, students })
  }

  public async updateRegistration({ params, request, response }: HttpContextContract) {
    const registration = await Registration.findOrFail(params.id)
    registration.merge(request.only(['course_id', 'student_id', 'status']))
    await registration.save()
    return response.redirect().toRoute('admin.registrations.index')
  }

  public async deleteRegistration({ params, response }: HttpContextContract) {
    const registration = await Registration.findOrFail(params.id)
    await registration.delete()
    return response.redirect().toRoute('admin.registrations.index')
  }
}
