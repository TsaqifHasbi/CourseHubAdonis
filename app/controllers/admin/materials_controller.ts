import { HttpContext } from '@adonisjs/core/http'
import Material from '#models/material'
import Course from '#models/course'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

export default class MaterialsController {
  async index({ params, view }: HttpContext) {
    const courseId = params.course_id
    const course = await Course.findOrFail(courseId)
    const materials = await Material.query()
      .where('course_id', courseId)
      .orderBy('created_at', 'desc')

    return view.render('pages/admin/materials/index', { course, materials })
  }

  async create({ params, view }: HttpContext) {
    const courseId = params.course_id
    const course = await Course.findOrFail(courseId)

    return view.render('pages/admin/materials/create', { course })
  }

  async store({ params, request, response, session }: HttpContext) {
    try {
      const courseId = params.course_id
      console.log('Course ID:', courseId)
      const data = request.only(['judul', 'deskripsi'])
      console.log('Form data:', data)
      const file = request.file('file')
      console.log('File object:', file ? 'File uploaded' : 'No file uploaded')

      let filePath = null

      if (file) {
        // Create uploads directory if it doesn't exist
        const uploadsPath = join(app.makePath('public'), 'uploads', 'materials')
        await fs.mkdir(uploadsPath, { recursive: true })

        const fileName = `${randomUUID()}.${file.extname}`
        await file.move(uploadsPath, {
          name: fileName,
        })

        filePath = `uploads/materials/${fileName}`
      }

      console.log('Creating material with:', {
        courseId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        filePath,
      })

      // Create material record in the database with explicit column names
      const materialData = {
        course_id: Number.parseInt(courseId, 10),
        judul: data.judul,
        deskripsi: data.deskripsi || null,
        file_path: filePath,
      }

      console.log('Creating material with values:', materialData)

      // Create the material with the direct field mapping
      await Material.create(materialData)

      session.flash('success', 'Material created successfully')
      return response.redirect().toRoute('admin.courses.materials.index', { course_id: courseId })
    } catch (error) {
      console.error('Material creation error:', error)

      // Get detailed error information
      let errorMessage = 'Failed to create material. '

      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)

        // Add specific handling for database or SQL errors
        if (
          error.message.includes('database') ||
          error.message.includes('query') ||
          error.message.includes('SQL')
        ) {
          errorMessage += 'Database error: ' + error.message
        } else {
          errorMessage += error.message
        }
      }

      session.flash('error', errorMessage)
      return response.redirect().back()
    }
  }

  async edit({ params, view }: HttpContext) {
    const material = await Material.findOrFail(params.id)
    const course = await Course.findOrFail(material.courseId)

    return view.render('pages/admin/materials/edit', { course, material })
  }

  async update({ params, request, response, session }: HttpContext) {
    console.log('Update method called with params:', params)
    console.log('Request method:', request.method())
    console.log('Request URL:', request.url())

    try {
      // Find the material to update
      const material = await Material.findOrFail(params.id)
      console.log('Material found:', material)

      // Get the form data
      const data = request.only(['judul', 'deskripsi'])
      console.log('Form data:', data)

      // Get the uploaded file
      const file = request.file('file')
      if (file) {
        // Force validation if not already validated
        if (!file.validated) {
          console.log('Validating file...')
          await file.validate()
        }

        console.log('File details:', {
          clientName: file.clientName,
          size: file.size,
          type: file.type,
          extname: file.extname,
          isValid: file.isValid,
          state: file.state,
          hasErrors: file.errors ? true : false,
          errors: file.errors ? JSON.stringify(file.errors) : 'No errors',
        })
      } else {
        console.log('No file uploaded')
      }

      // Create a data object for the update
      const updateData = {
        judul: data.judul || material.judul,
        deskripsi: data.deskripsi || material.deskripsi,
        // Keep existing filePath by default
        filePath: material.filePath,
      }

      // Handle file update if a new file was uploaded
      if (file && (file.isValid || file.validated)) {
        console.log('Processing file upload:', file.clientName, file.size, file.extname)

        // Delete old file if exists
        if (material.filePath) {
          const oldFilePath = join(app.makePath('public'), material.filePath)
          console.log('Deleting old file:', oldFilePath)
          try {
            await fs.unlink(oldFilePath)
          } catch (err) {
            console.log('Error deleting old file (may not exist):', err.message)
            // Ignore errors if file doesn't exist
          }
        }

        // Create uploads directory if it doesn't exist
        const uploadsPath = join(app.makePath('public'), 'uploads', 'materials')
        console.log('Uploads path:', uploadsPath)
        await fs.mkdir(uploadsPath, { recursive: true })

        // Generate unique filename
        const fileName = `${randomUUID()}.${file.extname}`
        console.log('New filename:', fileName)

        // Move the uploaded file
        await file.move(uploadsPath, {
          name: fileName,
        })

        // Update the file path
        updateData.filePath = `uploads/materials/${fileName}`
        console.log('New file path:', updateData.filePath)
      } else if (file && !file.isValid) {
        // Log file validation errors if any
        console.error('File validation errors:', file.errors)
      }

      console.log('Updating material with:', {
        id: material.id,
        ...updateData,
      })

      // Use direct column names for the database
      await material.merge({
        judul: updateData.judul,
        deskripsi: updateData.deskripsi,
        // Use the correct database column name
        filePath: updateData.filePath,
      })

      // Save the changes
      await material.save()

      session.flash('success', 'Material updated successfully')
      return response
        .redirect()
        .toRoute('admin.courses.materials.index', { course_id: material.courseId })
    } catch (error) {
      console.error('Material update error:', error)

      // Get detailed error information
      let errorMessage = 'Failed to update material. '

      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
        errorMessage += error.message
      }

      session.flash('error', errorMessage)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    const material = await Material.findOrFail(params.id)
    const courseId = material.courseId

    try {
      // Delete file if exists
      if (material.filePath) {
        const filePath = join(app.makePath('public'), material.filePath)
        try {
          await fs.unlink(filePath)
        } catch (err) {
          // Ignore errors if file doesn't exist
        }
      }

      await material.delete()
      session.flash('success', 'Material deleted successfully')
    } catch (error) {
      session.flash('error', 'Failed to delete material')
    }

    return response.redirect().toRoute('admin.courses.materials.index', { course_id: courseId })
  }
}
