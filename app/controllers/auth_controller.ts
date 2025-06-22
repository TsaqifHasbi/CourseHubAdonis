import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { verifyBcryptPassword, getHashAlgorithm } from '../services/password_helper.js'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Check if user exists first
      const user = await User.findBy('email', email)
      if (!user) {
        console.error('User not found:', email)
        session.flash('errors', { form: 'Email not found' })
        return response.redirect().back()
      }

      // Validasi password
      if (!password || password.trim() === '') {
        console.error('Empty password provided')
        session.flash('errors', { form: 'Password cannot be empty' })
        return response.redirect().back()
      }

      try {
        let isPasswordValid = false
        const hashAlgorithm = getHashAlgorithm(user.password)

        if (hashAlgorithm === 'bcrypt') {
          // Menggunakan verifikasi bcrypt untuk password
          console.log('Verifying password using bcrypt')
          isPasswordValid = await verifyBcryptPassword(user.password, password)
        } else {
          // Menggunakan verifikasi scrypt standar AdonisJS
          console.log('Verifying password using scrypt')
          try {
            isPasswordValid = await hash.verify(user.password, password)
          } catch (error) {
            console.error('Hash verification error:', error.message)
            isPasswordValid = false
          }
        }

        if (!isPasswordValid) {
          console.error('Invalid password')
          session.flash('errors', { form: 'Password salah, silakan coba lagi' })
          return response.redirect().back()
        }

        // Password valid, lanjutkan proses login
        // Tidak perlu mengubah hash password yang sudah ada di database
      } catch (error) {
        console.error('Error in password verification:', error.message)
        session.flash('errors', { form: 'Authentication error' })
        return response.redirect().back()
      }

      // Login user
      await auth.use('web').login(user)
      const authenticatedUser = auth.use('web').user!

      if (authenticatedUser.role === 'admin') {
        return response.redirect().toRoute('admin.dashboard')
      }

      return response.redirect().toRoute('home')
    } catch (error) {
      console.error('Login error:', error.message)
      session.flash('errors', { form: 'Authentication error: ' + error.message })
      return response.redirect().back()
    }
  }

  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, response, auth, session }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password', 'passwordConfirmation'])

    // Log registration attempt for debugging
    console.log('Registration attempt with data:', {
      fullName: data.fullName,
      email: data.email,
      passwordLength: data.password?.length,
    })

    // Validation
    if (data.password !== data.passwordConfirmation) {
      console.log('Password mismatch')
      session.flash('errors', { password: 'Passwords do not match' })
      return response.redirect().back()
    }

    try {
      // Hash the password
      const hashedPassword = await hash.make(data.password)

      // Log the generated password hash for debugging
      console.log('Generated password hash:', hashedPassword.substring(0, 20) + '...')

      // Create user
      console.log('Attempting to create user with:', {
        name: data.fullName,
        email: data.email,
        role: 'user',
      })

      try {
        const user = await User.create({
          name: data.fullName,
          email: data.email,
          password: hashedPassword,
          role: 'user', // Default role for new users
        })

        console.log('User successfully created with ID:', user.id)

        // Log the user in
        await auth.use('web').login(user)
        console.log('User successfully logged in')

        return response.redirect().toRoute('home')
      } catch (createError) {
        console.error('User creation failed:', createError)
        throw createError // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('Registration failed with error:', error)

      // More detailed error handling
      if (error.code === 'ER_DUP_ENTRY') {
        session.flash('errors', { email: 'Email already exists' })
      } else if (error.message?.includes('validation')) {
        session.flash('errors', { form: 'Validation failed: Please check your input fields' })
      } else {
        // Keep the original data in flash for repopulating the form
        session.flash('fullName', data.fullName)
        session.flash('email', data.email)

        // Flash the specific error message
        session.flash('errors', {
          form: `Registration failed: ${error.message || 'Unknown error'}`,
        })

        console.error('Full error object:', JSON.stringify(error))
      }
      return response.redirect().back()
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('login')
  }
}
