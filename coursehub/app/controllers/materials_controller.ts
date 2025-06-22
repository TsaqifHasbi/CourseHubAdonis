export default class MaterialsController {
  public async upload({ request, response, params }) {
    const courseId = params.id
    const materialData = request.only(['judul', 'deskripsi'])
    const file = request.file('file')

    if (!file) {
      return response.badRequest('File is required')
    }

    await file.move('uploads/materials', {
      name: `${new Date().getTime()}_${file.clientName}`,
      overwrite: true,
    })

    if (!file.moved()) {
      return response.badRequest(file.errors())
    }

    const material = await Material.create({
      ...materialData,
      kursus_id: courseId,
      file_path: file.filePath,
    })

    return response.created(material)
  }

  public async index({ params, response }) {
    const courseId = params.id
    const materials = await Material.query().where('kursus_id', courseId).fetch()

    return response.ok(materials)
  }

  public async show({ params, response }) {
    const material = await Material.find(params.id)

    if (!material) {
      return response.notFound('Material not found')
    }

    return response.ok(material)
  }

  public async update({ params, request, response }) {
    const material = await Material.find(params.id)

    if (!material) {
      return response.notFound('Material not found')
    }

    const updatedData = request.only(['judul', 'deskripsi'])
    material.merge(updatedData)
    await material.save()

    return response.ok(material)
  }

  public async delete({ params, response }) {
    const material = await Material.find(params.id)

    if (!material) {
      return response.notFound('Material not found')
    }

    await material.delete()
    return response.noContent()
  }
}
