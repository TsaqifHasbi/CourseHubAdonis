import { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import Instructor from '#models/instructor'

export default class AdminCoursesController {
  async index({ view }: HttpContext) {
    const courses = await Course.query()
      .preload('instructor')
      .preload('registrations')
      .orderBy('id', 'asc')

    return view.render('pages/admin/courses/index', { courses })
  }

  async create({ view }: HttpContext) {
    const instructors = await Instructor.all()
    return view.render('pages/admin/courses/create', { instructors })
  }

  async store({ request, response, session }: HttpContext) {
    const formData = request.only(['namaCourse', 'durasi', 'instructorId', 'biaya'])

    try {
      // Map form field names to model properties
      await Course.create({
        nama_kursus: formData.namaCourse,
        durasi: Number(formData.durasi),
        instruktur_id: Number(formData.instructorId),
        biaya: Number(formData.biaya),
      })

      session.flash('success', 'Course created successfully')
      return response.redirect().toRoute('admin.courses.index')
    } catch (error) {
      console.error('Error creating course:', error)
      session.flash('error', 'Failed to create course')
      return response.redirect().back()
    }
  }

  async edit({ params, view }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    const instructors = await Instructor.all()

    return view.render('pages/admin/courses/edit', {
      course,
      instructors,
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    console.log('Update method called with params:', params)
    console.log('Request method:', request.method())
    console.log('Request URL:', request.url())
    console.log('Request body:', request.body())

    try {
      const course = await Course.findOrFail(params.id)
      console.log('Course found:', course)

      const formData = request.only(['namaCourse', 'durasi', 'instructorId', 'biaya'])
      console.log('Form data:', formData)

      // Map form field names to model properties
      course.merge({
        nama_kursus: formData.namaCourse,
        durasi: Number(formData.durasi),
        instruktur_id: Number(formData.instructorId),
        biaya: Number(formData.biaya),
      })

      console.log('Saving course with:', {
        id: course.id,
        nama_kursus: course.nama_kursus,
        durasi: course.durasi,
        instruktur_id: course.instruktur_id,
        biaya: course.biaya,
      })

      await course.save()

      session.flash('success', 'Course updated successfully')
      return response.redirect().toRoute('admin.courses.index')
    } catch (error) {
      console.error('Error updating course:', error)
      session.flash('error', 'Failed to update course')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    console.log('Delete course method called with params:', params)

    try {
      const course = await Course.findOrFail(params.id)
      console.log('Course to delete:', course)

      // Check if course has associated registrations
      await course.load('registrations')
      if (course.registrations && course.registrations.length > 0) {
        console.log('Cannot delete course with active registrations:', course.registrations.length)
        session.flash(
          'error',
          `Cannot delete course: "${course.nama_kursus}" has ${course.registrations.length} active student registration(s)`
        )
        return response.redirect().back()
      }

      // Check if course has associated materials
      await course.load('materials')
      if (course.materials && course.materials.length > 0) {
        console.log('Cannot delete course with associated materials:', course.materials.length)
        session.flash(
          'error',
          `Cannot delete course: "${course.nama_kursus}" has ${course.materials.length} associated material(s). Please delete all materials first.`
        )
        return response.redirect().back()
      }

      // If no registrations and no materials, proceed with deletion
      await course.delete()
      console.log('Course deleted successfully')
      session.flash('success', 'Course deleted successfully')
    } catch (error) {
      console.error('Error deleting course:', error)
      session.flash('error', 'Failed to delete course')
    }

    return response.redirect().toRoute('admin.courses.index')
  }
}
