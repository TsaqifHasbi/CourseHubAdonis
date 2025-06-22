import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'AuthController.showLandingPage').as('landing')

Route.group(() => {
  Route.get('/courses', 'CoursesController.index').as('courses.index')
  Route.get('/courses/:id', 'CoursesController.show').as('courses.show')
  Route.post('/courses/:id/register', 'RegistrationsController.store').as('registrations.store')
}).middleware('auth')

Route.group(() => {
  Route.get('/admin/dashboard', 'DashboardController.index').as('admin.dashboard')

  Route.resource('admin/courses', 'CoursesController').middleware({
    '*': 'admin',
  })

  Route.resource('admin/instructors', 'InstructorsController').middleware({
    '*': 'admin',
  })

  Route.resource('admin/registrations', 'RegistrationsController').middleware({
    '*': 'admin',
  })

  Route.post('/admin/courses/:id/materials', 'MaterialsController.store')
    .middleware('admin')
    .as('materials.store')
}).middleware('auth')
