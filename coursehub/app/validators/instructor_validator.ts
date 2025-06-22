import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class InstructorValidator {
  public schema = schema.create({
    nama: schema.string({ trim: true }, [rules.required(), rules.maxLength(255)]),
    email: schema.string({ trim: true }, [rules.required(), rules.email(), rules.maxLength(255)]),
  })

  public messages = {
    'nama.required': 'Nama instruktur harus diisi.',
    'nama.maxLength': 'Nama instruktur tidak boleh lebih dari 255 karakter.',
    'email.required': 'Email instruktur harus diisi.',
    'email.email': 'Format email instruktur tidak valid.',
    'email.maxLength': 'Email instruktur tidak boleh lebih dari 255 karakter.',
  }
}
