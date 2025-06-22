import { HttpContext } from '@adonisjs/core/http'
import Registration from '#models/registration'
import Course from '#models/course'
import Student from '#models/student'
import User from '#models/user'

export default class RegistrationsController {
  // Show user's registrations
  async index({ view, auth }: HttpContext) {
    if (!auth.user) {
      return view.render('pages/auth/login')
    }

    // Get or create student record for this user
    let student = await Student.query().where('user_id', auth.user.id).first()

    if (!student) {
      student = await Student.create({
        nama: auth.user.fullName || 'Student',
        email: auth.user.email,
        user_id: auth.user.id,
      })
    }

    const registrations = await Registration.query()
      .where('participant_id', student.id)
      .preload('course', (query) => {
        query.preload('instructor')
      })
      .orderBy('created_at', 'desc')
    return view.render('pages/registrations/index', { registrations })
  }
  // Register for a course
  async register({ params, response, auth, session }: HttpContext) {
    const courseId = params.course_id

    if (!auth.user) {
      session.flash('error', 'Please login to register for a course')
      return response.redirect().toRoute('login')
    }

    try {
      // Get or create student record for this user
      let student = await Student.query().where('user_id', auth.user.id).first()

      if (!student) {
        student = await Student.create({
          nama: auth.user.fullName || 'Student',
          email: auth.user.email,
          user_id: auth.user.id,
        })
      }

      // Check if the student is already registered for this course
      const existingRegistration = await Registration.query()
        .where('course_id', courseId)
        .where('participant_id', student.id)
        .first()

      if (existingRegistration) {
        session.flash('error', 'You are already registered for this course')
        return response.redirect().back()
      }

      // Register the student
      try {
        // Log the data being sent to the database
        console.log('Creating registration with:', {
          course_id: courseId,
          participant_id: student.id,
          status: 'pending',
        })

        await Registration.create({
          course_id: courseId, // Use database column name
          participant_id: student.id, // Use database column name
          status: 'pending',
        })
      } catch (registrationError) {
        console.error('Failed to create registration record:', registrationError.message, registrationError.stack)
        throw new Error(`Failed to create registration: ${registrationError.message}`)
      }

      session.flash('success', 'Registration successful')
      return response.redirect().toRoute('registrations.index')
    } catch (error) {
      console.error('Registration failed with error:', error.message, error.stack)
      session.flash('error', `Registration failed: ${error.message}`)
      return response.redirect().back()
    }
  }

  // Cancel a registration
  async cancel({ params, response, auth, session }: HttpContext) {
    if (!auth.user) {
      return response.redirect().toRoute('login')
    }

    const registrationId = params.id

    try {
      // Get student record for this user
      const student = await Student.query().where('user_id', auth.user.id).firstOrFail()

      // Get registration and check if it belongs to this student
      const registration = await Registration.query()
        .where('id', registrationId)
        .where('participant_id', student.id)
        .firstOrFail()

      await registration.delete()

      session.flash('success', 'Registration cancelled successfully')
      return response.redirect().toRoute('registrations.index')
    } catch (error) {
      session.flash('error', 'Failed to cancel registration')
      return response.redirect().back()
    }
  }
}
