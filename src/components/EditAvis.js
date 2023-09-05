'use client'

import { useTransition } from 'react'
import dynamic from 'next/dynamic'
import CKEditor from '@/components/CustomCKEditor'
import { save } from '../actions'
import './EditAvis.scss'
import { useSnackbar } from './Snackbar/useSnackbar.js'

// const CKEditor = dynamic(() => import('@/components/CustomCKEditor'), { ssr: false })

export default function EditAvis({ avis }) {
  const [isPending, startTransition] = useTransition()
  const [openSnackbar, closeSnackbar] = useSnackbar()

  // async function onSave(message) {
  //   console.log('I AM SAVE!!! %o', message)
  //   startTransition(async function () {
  //     const result = await save(avis.id, message)
  //     console.log('result: %o', result)
  //   })
  // }

  async function onSave(message) {
    console.log('I AM SAVE!!! %o', message)
    const result = await save(avis.id, message)
    console.log('result: %o', result)

    if (result.success) {
      openSnackbar('Message sauvegardé.')
    } else {
      openSnackbar(result.message, { autoHide: false })
    }
  }

  return (
    <CKEditor
      data={avis.message}
      onSave={onSave}
    />
  )
}