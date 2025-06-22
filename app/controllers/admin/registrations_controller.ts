import { HttpContext } from '@adonisjs/core/http'
import Registration from '#models/registration'
import Course from '#models/course'
import Student from '#models/student'

export default class AdminRegistrationsController {
  async index({ view }: HttpContext) {
    const registrations = await Registration.query()
      .preload('course')
      .preload('student')
      .orderBy('id', 'asc')

    return view.render('pages/admin/registrations/index', { registrations })
  }

  async create({ view }: HttpContext) {
    const courses = await Course.all()
    const students = await Student.all()

    return view.render('pages/admin/registrations/create', { courses, students })
  }

  async store({ request, response, session }: HttpContext) {
    console.log('Store registration method called')
    console.log('Request method:', request.method())
    console.log('Request URL:', request.url())
    console.log('Request body:', request.body())

    const data = request.only(['courseId', 'studentId', 'status'])
    console.log('Form data:', data)

    try {
      // Check if the student is already registered for this course
      const existingRegistration = await Registration.query()
        .where('course_id', data.courseId)
        .where('student_id', data.studentId)
        .first()

      if (existingRegistration) {
        console.log('Duplicate registration found:', existingRegistration)
        session.flash('error', 'Student is already registered for this course')
        return response.redirect().back()
      }

      const registration = await Registration.create(data)
      console.log('Registration created successfully:', registration)

      session.flash('success', 'Registration created successfully')
      return response.redirect().toRoute('admin.registrations.index')
    } catch (error) {
      console.error('Error creating registration:', error)
      session.flash('error', 'Failed to create registration')
      return response.redirect().back()
    }
  }

  async edit({ params, view, session, response }: HttpContext) {
    console.log('Edit method called with params:', params)

    try {
      const registrationId = params.id
      const registration = await Registration.findOrFail(registrationId)
      await registration.load('course')
      await registration.load('student')

      console.log('Registration found:', registration)

      if (!registration) {
        session.flash('error', 'Registration not found')
        return response.redirect().toRoute('admin.registrations.index')
      }

      // Get current values
      const currentCourseId = registration.courseId
      const currentStudentId = registration.studentId
      const currentStatus = registration.status

      console.log(
        'Current values - courseId:',
        currentCourseId,
        'studentId:',
        currentStudentId,
        'status:',
        currentStatus
      )

      // Get course and student details for display
      const courseDetails = registration.course
        ? {
            id: registration.course.id,
            name: registration.course.nama_kursus,
          }
        : null

      const studentDetails = registration.student
        ? {
            id: registration.student.id,
            name: registration.student.name,
            email: registration.student.email,
          }
        : null

      // Make sure we don't lose the selected values
      const hiddenValues = {
        courseId: currentCourseId,
        studentId: currentStudentId,
      }

      // Prepare status options
      const statusOptions = [
        {
          value: 'pending',
          name: 'Pending',
          selected: currentStatus === 'pending' ? 'selected' : '',
        },
        {
          value: 'approved',
          name: 'Approved',
          selected: currentStatus === 'approved' ? 'selected' : '',
        },
        {
          value: 'rejected',
          name: 'Rejected',
          selected: currentStatus === 'rejected' ? 'selected' : '',
        },
      ]

      console.log('Course details:', courseDetails)
      console.log('Student details:', studentDetails)
      console.log('Current status:', currentStatus)

      return view.render('pages/admin/registrations/edit', {
        registrationId,
        courseDetails,
        studentDetails,
        statusOptions,
        hiddenValues,
        registrationDate: registration.createdAt
          ? registration.createdAt.toFormat('dd LLL yyyy')
          : '',
      })
    } catch (error) {
      console.error('Error in edit method:', error)
      session.flash('error', 'Failed to load registration')
      return response.redirect().toRoute('admin.registrations.index')
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    console.log('Update registration method called with params:', params)
    console.log('Request method:', request.method())
    console.log('Request URL:', request.url())
    console.log('Request body:', request.body())

    try {
      if (!params.id) {
        session.flash('error', 'Registration ID is missing')
        return response.redirect().toRoute('admin.registrations.index')
      }

      const registration = await Registration.findOrFail(params.id)
      console.log('Found registration:', registration)

      if (!registration) {
        session.flash('error', 'Registration not found')
        return response.redirect().toRoute('admin.registrations.index')
      }

      // Only get the status field from the form
      const data = request.only(['courseId', 'studentId', 'status'])
      console.log('Form data:', data)

      // Get the new status from the form
      const { status } = data

      console.log('Updating status to:', status)

      // Only update the status field
      registration.status = status
      console.log('Registration after status update:', registration)

      await registration.save()
      console.log('Registration status updated successfully')

      session.flash('success', 'Registration status updated successfully')
      return response.redirect().toRoute('admin.registrations.index')
    } catch (error) {
      console.error('Error updating registration:', error)
      session.flash('error', 'Failed to update registration status')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    console.log('Delete registration method called with params:', params)

    try {
      const registration = await Registration.findOrFail(params.id)
      console.log('Registration to delete:', registration)

      await registration.delete()
      console.log('Registration deleted successfully')
      session.flash('success', 'Registration deleted successfully')
    } catch (error) {
      console.error('Error deleting registration:', error)
      session.flash('error', 'Failed to delete registration')
    }

    return response.redirect().toRoute('admin.registrations.index')
  }

  async approve({ params, response, session }: HttpContext) {
    const registration = await Registration.findOrFail(params.id)

    try {
      registration.status = 'approved'
      await registration.save()

      session.flash('success', 'Registration approved successfully')
    } catch (error) {
      session.flash('error', 'Failed to approve registration')
    }

    return response.redirect().back()
  }

  async reject({ params, response, session }: HttpContext) {
    const registration = await Registration.findOrFail(params.id)

    try {
      registration.status = 'rejected'
      await registration.save()

      session.flash('success', 'Registration rejected successfully')
    } catch (error) {
      session.flash('error', 'Failed to reject registration')
    }

    return response.redirect().back()
  }
}
