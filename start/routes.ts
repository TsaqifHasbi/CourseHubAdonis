/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { HttpContext } from '@adonisjs/core/http'

// Public routes
router
  .get('/', async (ctx) => {
    const { default: HomeController } = await import('#controllers/home_controller')
    return new HomeController().index(ctx)
  })
  .as('home')

router
  .get('/courses', async (ctx) => {
    const { default: HomeController } = await import('#controllers/home_controller')
    return new HomeController().allCourses(ctx)
  })
  .as('courses.index')

router
  .get('/courses/:id', async (ctx) => {
    const { default: HomeController } = await import('#controllers/home_controller')
    return new HomeController().showCourse(ctx)
  })
  .as('courses.show')

// Auth routes
router
  .get('/login', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().showLogin(ctx)
  })
  .as('login')
  .use([middleware.guest()])

router
  .post('/login', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().login(ctx)
  })
  .use([middleware.guest()])

router
  .get('/register', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().showRegister(ctx)
  })
  .as('register')
  .use([middleware.guest()])

router
  .post('/register', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().register(ctx)
  })
  .use([middleware.guest()])

router
  .post('/logout', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().logout(ctx)
  })
  .as('logout')
  .use([middleware.auth()])

// User registration routes
router
  .get('/registrations', async (ctx) => {
    const { default: RegistrationsController } = await import(
      '#controllers/registrations_controller'
    )
    return new RegistrationsController().index(ctx)
  })
  .as('registrations.index')
  .use([middleware.auth()])

router
  .post('/courses/:course_id/register', async (ctx) => {
    const { default: RegistrationsController } = await import(
      '#controllers/registrations_controller'
    )
    return new RegistrationsController().register(ctx)
  })
  .as('courses.register')
  .use([middleware.auth()])

router
  .delete('/registrations/:id', async (ctx) => {
    const { default: RegistrationsController } = await import(
      '#controllers/registrations_controller'
    )
    return new RegistrationsController().cancel(ctx)
  })
  .as('registrations.cancel')
  .use([middleware.auth()])

// Admin routes
const adminRouter = router
  .group(() => {
    // Dashboard
    router
      .get('/dashboard', async (ctx) => {
        const { default: AdminController } = await import('#controllers/admin/admin_controller')
        return new AdminController().dashboard(ctx)
      })
      .as('admin.dashboard')

    // Courses
    router
      .get('/courses', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().index(ctx)
      })
      .as('admin.courses.index')

    router
      .get('/courses/create', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().create(ctx)
      })
      .as('admin.courses.create')

    router
      .post('/courses', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().store(ctx)
      })
      .as('admin.courses.store')

    router
      .get('/courses/:id/edit', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().edit(ctx)
      })
      .as('admin.courses.edit')

    router
      .put('/courses/:id', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().update(ctx)
      })
      .as('admin.courses.update')

    // Add POST route for course update (browser compatibility)
    router
      .post('/courses/:id/update', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().update(ctx)
      })
      .as('admin.courses.update.post')

    router
      .delete('/courses/:id', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().destroy(ctx)
      })
      .as('admin.courses.destroy')

    // Add POST route for course deletion (for browser compatibility)
    router
      .post('/courses/:id/delete', async (ctx) => {
        const { default: CoursesController } = await import('#controllers/admin/courses_controller')
        return new CoursesController().destroy(ctx)
      })
      .as('admin.courses.delete')

    // Course Materials
    router
      .get('/courses/:course_id/materials', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().index(ctx)
      })
      .as('admin.courses.materials.index')

    router
      .get('/courses/:course_id/materials/create', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().create(ctx)
      })
      .as('admin.courses.materials.create')

    router
      .post('/courses/:course_id/materials', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().store(ctx)
      })
      .as('admin.courses.materials.store')

    router
      .get('/materials/:id/edit', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().edit(ctx)
      })
      .as('admin.materials.edit')

    router
      .put('/materials/:id', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().update(ctx)
      })
      .as('admin.materials.update')

    // Additional POST route for material updates for better form compatibility
    router
      .post('/materials/:id/update', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().update(ctx)
      })
      .as('admin.materials.update.post')

    router
      .delete('/materials/:id', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().destroy(ctx)
      })
      .as('admin.materials.destroy')

    // Add POST route for material deletion (browser compatibility)
    router
      .post('/materials/:id/delete', async (ctx) => {
        const { default: MaterialsController } = await import(
          '#controllers/admin/materials_controller'
        )
        return new MaterialsController().destroy(ctx)
      })
      .as('admin.materials.delete')

    // Instructors
    router
      .get('/instructors', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().index(ctx)
      })
      .as('admin.instructors.index')

    router
      .get('/instructors/create', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().create(ctx)
      })
      .as('admin.instructors.create')

    router
      .post('/instructors', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().store(ctx)
      })
      .as('admin.instructors.store')

    router
      .get('/instructors/:id/edit', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().edit(ctx)
      })
      .as('admin.instructors.edit')

    router
      .put('/instructors/:id', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().update(ctx)
      })
      .as('admin.instructors.update')

    // Additional POST route for instructor updates for better form compatibility
    router
      .post('/instructors/:id/update', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().update(ctx)
      })
      .as('admin.instructors.update.post')

    router
      .delete('/instructors/:id', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().destroy(ctx)
      })
      .as('admin.instructors.destroy')

    // Additional POST route for instructor deletion for better form compatibility
    router
      .post('/instructors/:id/delete', async (ctx) => {
        const { default: InstructorsController } = await import(
          '#controllers/admin/instructors_controller'
        )
        return new InstructorsController().destroy(ctx)
      })
      .as('admin.instructors.destroy.post')

    // Registrations
    router
      .get('/registrations', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().index(ctx)
      })
      .as('admin.registrations.index')

    router
      .get('/registrations/create', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().create(ctx)
      })
      .as('admin.registrations.create')

    router
      .post('/registrations', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().store(ctx)
      })
      .as('admin.registrations.store')

    router
      .get('/registrations/:id/edit', async (ctx) => {
        try {
          const { default: RegistrationsController } = await import(
            '#controllers/admin/registrations_controller'
          )
          return new RegistrationsController().edit(ctx)
        } catch (error) {
          console.error('Error in registration edit route:', error)
          return ctx.response
            .redirect()
            .withQs({ error: 'Registration not found' })
            .toRoute('admin.registrations.index')
        }
      })
      .as('admin.registrations.edit')

    router
      .put('/registrations/:id', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().update(ctx)
      })
      .as('admin.registrations.update')

    // Additional POST route for registration updates for better form compatibility
    router
      .post('/registrations/:id/update', async (ctx) => {
        try {
          const { default: RegistrationsController } = await import(
            '#controllers/admin/registrations_controller'
          )
          return new RegistrationsController().update(ctx)
        } catch (error) {
          console.error('Error in registration update route:', error)
          return ctx.response
            .redirect()
            .withQs({ error: 'Failed to update registration' })
            .toRoute('admin.registrations.index')
        }
      })
      .as('admin.registrations.update.post')

    router
      .delete('/registrations/:id', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().destroy(ctx)
      })
      .as('admin.registrations.destroy')

    // Add POST route for registration deletion (browser compatibility)
    router
      .post('/registrations/:id/delete', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().destroy(ctx)
      })
      .as('admin.registrations.delete')

    // Registration approval routes
    router
      .post('/registrations/:id/approve', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().approve(ctx)
      })
      .as('admin.registrations.approve')

    router
      .post('/registrations/:id/reject', async (ctx) => {
        const { default: RegistrationsController } = await import(
          '#controllers/admin/registrations_controller'
        )
        return new RegistrationsController().reject(ctx)
      })
      .as('admin.registrations.reject')
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])
