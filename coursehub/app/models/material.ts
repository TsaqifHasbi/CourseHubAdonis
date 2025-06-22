export default class Material {
  public id: number
  public kursus_id: number
  public judul: string
  public deskripsi: string

  constructor(id: number, kursus_id: number, judul: string, deskripsi: string) {
    this.id = id
    this.kursus_id = kursus_id
    this.judul = judul
    this.deskripsi = deskripsi
  }

  // Define relationship to Course
  public static get course() {
    return this.belongsTo('App/Models/Course', 'kursus_id', 'id')
  }
}
