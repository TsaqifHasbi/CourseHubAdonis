import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class Admin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // Check if the user is authenticated
    await auth.check()

    // Get the authenticated user
    const user = auth.user

    // Check if the user has admin privileges
    if (user && user.role === 'admin') {
      await next() // Proceed to the next middleware or route handler
    } else {
      return response.forbidden('You do not have permission to access this resource.')
    }
  }
}
