import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import Registration from 'App/Models/Registration'
import Material from 'App/Models/Material'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CoursesController {
  public async index({ view }: HttpContextContract) {
    const courses = await Course.query().preload('instructor').preload('materials')
    return view.render('admin.courses.index', { courses })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('admin.courses.create')
  }

  public async store({ request, response }: HttpContextContract) {
    const courseSchema = schema.create({
      nama_kursus: schema.string({ trim: true }, [rules.required()]),
      durasi: schema.string({ trim: true }, [rules.required()]),
      instruktur_id: schema.number([rules.required()]),
      biaya: schema.number([rules.required()]),
    })

    const payload = await request.validate({ schema: courseSchema })
    await Course.create(payload)
    return response.redirect().toRoute('courses.index')
  }

  public async show({ params, view }: HttpContextContract) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('instructor')
      .preload('materials')
      .firstOrFail()
    const registrationsCount = await Registration.query()
      .where('kursus_id', params.id)
      .count('* as total')
    return view.render('admin.courses.show', {
      course,
      registrationsCount: registrationsCount[0].total,
    })
  }

  public async edit({ params, view }: HttpContextContract) {
    const course = await Course.findOrFail(params.id)
    return view.render('admin.courses.edit', { course })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const course = await Course.findOrFail(params.id)
    const courseSchema = schema.create({
      nama_kursus: schema.string({ trim: true }, [rules.required()]),
      durasi: schema.string({ trim: true }, [rules.required()]),
      instruktur_id: schema.number([rules.required()]),
      biaya: schema.number([rules.required()]),
    })

    const payload = await request.validate({ schema: courseSchema })
    course.merge(payload)
    await course.save()
    return response.redirect().toRoute('courses.index')
  }

  public async destroy({ params, response }: HttpContextContract) {
    const course = await Course.findOrFail(params.id)
    await course.delete()
    return response.redirect().toRoute('courses.index')
  }

  public async uploadMaterial({ params, request, response }: HttpContextContract) {
    const materialSchema = schema.create({
      judul: schema.string({ trim: true }, [rules.required()]),
      deskripsi: schema.string({ trim: true }, [rules.required()]),
      file: schema.file({ size: '2mb', extnames: ['pdf', 'doc', 'docx'] }),
    })

    const payload = await request.validate({ schema: materialSchema })
    const material = new Material()
    material.judul = payload.judul
    material.deskripsi = payload.deskripsi
    material.kursus_id = params.id

    if (payload.file) {
      const fileName = `${new Date().getTime()}.${payload.file.extname}`
      await payload.file.move('uploads', {
        name: fileName,
        overwrite: true,
      })
      material.file_path = `uploads/${fileName}`
    }

    await material.save()
    return response.redirect().toRoute('courses.show', { id: params.id })
  }
}
