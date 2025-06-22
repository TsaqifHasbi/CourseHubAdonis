import { Application } from '@adonisjs/core/build/standalone'

const appConfig = {
  appName: 'CourseHub',
  appUrl: 'http://localhost:3333',
  appKey: process.env.APP_KEY || 'your-app-key',
  http: {
    middleware: ['global', 'auth'],
  },
  session: {
    driver: 'cookie',
    cookie: {
      name: 'session',
      httpOnly: true,
      sameSite: true,
      path: '/',
      maxAge: '2h',
    },
  },
  csrf: {
    enabled: true,
  },
  logging: {
    level: 'info',
  },
}

export default appConfig
