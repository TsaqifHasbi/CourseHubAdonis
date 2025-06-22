import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import Registration from 'App/Models/Registration'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    const courses = await Course.query().preload('instructor')
    const registrationsCount = await Registration.query().count('* as total')

    return view.render('admin.dashboard', {
      courses,
      registrationsCount: registrationsCount[0].total,
    })
  }
}
