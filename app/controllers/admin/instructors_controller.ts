import { HttpContext } from '@adonisjs/core/http'
import Instructor from '#models/instructor'

export default class AdminInstructorsController {
  async index({ view }: HttpContext) {
    const instructors = await Instructor.query().orderBy('id', 'asc')
    return view.render('pages/admin/instructors/index', { instructors })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/instructors/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nama', 'email'])

    try {
      await Instructor.create(data)
      session.flash('success', 'Instructor created successfully')
      return response.redirect().toRoute('admin.instructors.index')
    } catch (error) {
      console.error('Error creating instructor:', error)
      session.flash('error', 'Failed to create instructor')
      return response.redirect().back()
    }
  }

  async edit({ params, view }: HttpContext) {
    const instructor = await Instructor.findOrFail(params.id)
    return view.render('pages/admin/instructors/edit', { instructor })
  }

  async update({ params, request, response, session }: HttpContext) {
    console.log('Update method called with params:', params)
    console.log('Request method:', request.method())
    console.log('Request URL:', request.url())
    console.log('Request body:', request.body())

    try {
      const instructor = await Instructor.findOrFail(params.id)
      console.log('Instructor found:', instructor)

      const data = request.only(['nama', 'email'])
      console.log('Form data:', data)

      instructor.merge({
        nama: data.nama,
        email: data.email,
      })

      console.log('Saving instructor with:', {
        id: instructor.id,
        nama: instructor.nama,
        email: instructor.email,
      })

      await instructor.save()

      session.flash('success', 'Instructor updated successfully')
      return response.redirect().toRoute('admin.instructors.index')
    } catch (error) {
      console.error('Error updating instructor:', error)
      session.flash('error', 'Failed to update instructor')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    console.log('Delete instructor method called with params:', params)

    try {
      const instructor = await Instructor.findOrFail(params.id)
      console.log('Instructor to delete:', instructor)

      // Check if instructor has associated courses
      const courseCount = await instructor.related('courses').query().count('* as total')
      const total = Number(courseCount[0].$extras.total)

      if (total > 0) {
        console.log('Cannot delete instructor with associated courses:', total)
        session.flash(
          'error',
          `Cannot delete instructor: ${instructor.nama} is assigned to ${total} course(s)`
        )
        return response.redirect().back()
      }

      await instructor.delete()
      console.log('Instructor deleted successfully')

      session.flash('success', 'Instructor deleted successfully')
      return response.redirect().toRoute('admin.instructors.index')
    } catch (error) {
      console.error('Error deleting instructor:', error)
      session.flash('error', 'Failed to delete instructor')
      return response.redirect().back()
    }
  }
}
