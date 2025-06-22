import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { AuthService } from 'App/Services/AuthService'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.minLength(6)]),
    })

    const payload = await request.validate({ schema: userSchema })

    const user = await User.create(payload)
    return response.created(user)
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      const token = await auth.use('api').attempt(email, password)
      return response.ok({ token })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.ok({ message: 'Logged out successfully' })
  }
}
