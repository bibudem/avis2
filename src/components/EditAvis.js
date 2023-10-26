'use client'

import { useTransition } from 'react'
import dynamic from 'next/dynamic'
import CKEditor from '@/components/CustomCKEditor'
import { useSnackbar } from '@/components/Snackbar/useSnackbar'
import { save } from '@/actions'
import noop from '@/utils/noop'
import './EditAvis.scss'

// const CKEditor = dynamic(() => import('@/components/CustomCKEditor'), { ssr: false })

export default function EditAvis({ avis, onStateChange = noop, onFocus = noop, onBlur = noop, ...props }) {
  const [isPending, startTransition] = useTransition()
  const [openSnackbar, closeSnackbar] = useSnackbar()

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
      onStateChange={onStateChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    />
  )
}