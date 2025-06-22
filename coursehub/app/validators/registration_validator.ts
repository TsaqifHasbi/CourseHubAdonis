import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RegistrationValidator {
  public schema = schema.create({
    kursus_id: schema.number([rules.exists({ table: 'courses', column: 'id' })]),
    peserta_id: schema.number([
      rules.exists({ table: 'students', column: 'id' }),
      rules.unique({
        table: 'registrations',
        column: 'peserta_id',
        where: { kursus_id: this.kursus_id },
      }),
    ]),
    status: schema.enum(['pending', 'confirmed', 'cancelled']),
  })

  public messages = {
    'kursus_id.exists': 'Kursus yang dipilih tidak valid.',
    'peserta_id.exists': 'Peserta yang dipilih tidak valid.',
    'peserta_id.unique': 'Peserta sudah terdaftar di kursus ini.',
    'status.enum': 'Status harus salah satu dari: pending, confirmed, atau cancelled.',
  }
}
