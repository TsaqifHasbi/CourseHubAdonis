import { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class HomeController {
  async index({ view, auth }: HttpContext) {
    // Get 4 featured courses
    const featuredCourses = await Course.query()
      .preload('instructor')
      .orderBy('created_at', 'desc')
      .limit(4)

    return view.render('pages/home', {
      featuredCourses,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
    })
  }

  async allCourses({ view, auth }: HttpContext) {
    const courses = await Course.query().preload('instructor').orderBy('created_at', 'desc')

    return view.render('pages/courses/index', {
      courses,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
    })
  }

  async showCourse({ params, view, auth }: HttpContext) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('instructor')
      .preload('materials')
      .firstOrFail()

    const registrationsCount = await course.related('registrations').query().count('* as count')
    const count = registrationsCount[0].$extras.count

    // Tambahan: cek status registrasi user
    let isRegistered = false
    let userRegistration = null
    if (auth.isAuthenticated && auth.user) {
      const Student = (await import('#models/student')).default
      const Registration = (await import('#models/registration')).default
      const student = await Student.query().where('user_id', auth.user.id).first()
      if (student) {
        const registration = await Registration.query()
          .where('course_id', course.id)
          .where('participant_id', student.id)
          .first()
        if (registration) {
          isRegistered = true
          userRegistration = registration
        }
      }
    }

    return view.render('pages/courses/show', {
      course,
      registrationsCount: count,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      isRegistered,
      userRegistration,
    })
  }
}
