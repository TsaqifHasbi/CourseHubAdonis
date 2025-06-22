import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Instructor from 'App/Models/instructor'

export default class InstructorsController {
  public async index({ view }: HttpContextContract) {
    const instructors = await Instructor.all()
    return view.render('admin.instructors.index', { instructors })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('admin.instructors.create')
  }

  public async store({ request, response }: HttpContextContract) {
    const instructorData = request.only(['nama', 'email'])
    await Instructor.create(instructorData)
    return response.redirect().toRoute('instructors.index')
  }

  public async show({ params, view }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    return view.render('admin.instructors.show', { instructor })
  }

  public async edit({ params, view }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    return view.render('admin.instructors.edit', { instructor })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    instructor.merge(request.only(['nama', 'email']))
    await instructor.save()
    return response.redirect().toRoute('instructors.index')
  }

  public async destroy({ params, response }: HttpContextContract) {
    const instructor = await Instructor.findOrFail(params.id)
    await instructor.delete()
    return response.redirect().toRoute('instructors.index')
  }
}
