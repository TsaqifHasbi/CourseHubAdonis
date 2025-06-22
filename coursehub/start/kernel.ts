import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import { HttpException } from '@adonisjs/core/build/standalone'
import { MiddlewareContract } from '@ioc:Adonis/Core/Middleware'

export default class Kernel {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // Register middleware here
    await next()
  }

  public async handleException(exception: Exception, { response }: HttpContextContract) {
    if (exception instanceof HttpException) {
      return response.status(exception.status).send(exception.message)
    }

    return response.status(500).send('Internal Server Error')
  }
}
