'use server'

import { revalidatePath } from 'next/cache'

import dbConnect from '@/lib/dbConnect'
import Avis from '@/models/Avis'
import { adminRoute } from '@/config/app'

export async function create(data = { message: 'default message' }) {
  try {
    await dbConnect()

    await (new Avis()).save()
    // await Avis.create(avis)

    revalidatePath(adminRoute)

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

export async function getCurrent() {
  try {
    await dbConnect()

    return await Avis.getCurrent()
  } catch (error) {
    return {
      success: false,
      error
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

    revalidatePath(adminRoute)

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

export async function toggleActive(id, active) {

  try {
    await dbConnect()

    const result = await Avis.toggleActive(id, active)

    revalidatePath(adminRoute)

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

    revalidatePath(adminRoute)

    return ret

  } catch (error) {

    return {
      success: false,
      error
    }
  }
}