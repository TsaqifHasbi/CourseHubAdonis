import { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import Instructor from '#models/instructor'
import Registration from '#models/registration'

export default class AdminController {
  async dashboard({ view }: HttpContext) {
    const coursesCount = await Course.query().count('* as count')
    const instructorsCount = await Instructor.query().count('* as count')
    const registrationsCount = await Registration.query().count('* as count')

    const latestCourses = await Course.query()
      .preload('instructor')
      .orderBy('created_at', 'desc')
      .limit(5)

    const latestRegistrations = await Registration.query()
      .preload('course')
      .preload('student')
      .orderBy('created_at', 'desc')
      .limit(5)

    return view.render('pages/admin/dashboard', {
      stats: {
        courses: coursesCount[0].$extras.count,
        instructors: instructorsCount[0].$extras.count,
        registrations: registrationsCount[0].$extras.count,
      },
      latestCourses,
      latestRegistrations,
    })
  }
}
