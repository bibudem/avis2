'use server'

import { revalidatePath } from 'next/cache'

import dbConnect from '@/lib/dbConnect'
import Avis from '@/models/Avis.js'

export async function create(data = { message: 'default message' }) {
  try {
    await dbConnect()

    await (new Avis()).save()
    // await Avis.create(avis)

    revalidatePath('/admin')

    return {
      success: true
    }

  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error.message
    }
  }
}

export async function getList() {
  try {
    await dbConnect()

    return await Avis.getList()
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export async function save(id, message) {
  try {
    await dbConnect()

    await Avis.findByIdAndUpdate(id, { message }, { upsert: true })

    revalidatePath('/admin')

    return {
      success: true
    }

  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

export async function setActive(id) {

  try {
    await dbConnect()

    const result = await Avis.setActive(id)

    revalidatePath('/admin')

    return result

  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error.message
    }
  }
}

export async function del(id) {
  try {
    await dbConnect()

    const result = await Avis.findByIdAndDelete(id)

    const ret = {
      success: !!result
    }

    if (!result) {
      ret.message = 'Cet avis n\'existe pas.'
    }

    revalidatePath('/admin')

    return ret

  } catch (error) {

    return {
      success: false,
      error
    }
  }
}