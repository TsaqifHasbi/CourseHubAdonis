import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CourseValidator {
  public schema = schema.create({
    nama_kursus: schema.string({ trim: true }, [rules.required(), rules.maxLength(255)]),
    durasi: schema.string({ trim: true }, [rules.required(), rules.maxLength(100)]),
    instruktur_id: schema.number([
      rules.required(),
      rules.exists({ table: 'instructors', column: 'id' }),
    ]),
    biaya: schema.number([rules.required(), rules.unsigned()]),
  })

  public messages = {
    'nama_kursus.required': 'Nama kursus harus diisi.',
    'nama_kursus.maxLength': 'Nama kursus tidak boleh lebih dari 255 karakter.',
    'durasi.required': 'Durasi harus diisi.',
    'durasi.maxLength': 'Durasi tidak boleh lebih dari 100 karakter.',
    'instruktur_id.required': 'Instruktur harus dipilih.',
    'instruktur_id.exists': 'Instruktur yang dipilih tidak valid.',
    'biaya.required': 'Biaya harus diisi.',
    'biaya.unsigned': 'Biaya harus berupa angka positif.',
  }
}
