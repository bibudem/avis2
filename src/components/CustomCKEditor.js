'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from '@/lib/Editor/ckeditor'
import { useEffect, useState } from 'react'

function noop() { }

export default function CustomCKEditor({ data, onSave = noop, onStateChange = noop, onFocus = noop, onBlur = noop }) {
  const [state, setState] = useState('initial')

  useEffect(() => {
    onStateChange(state)
  }, [state])

  return (

    <CKEditor
      editor={Editor}
      data={data}
      config={{
        // plugins: 
        toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'link', '|', 'save']
      }}
      onReady={editor => {
        const initialData = editor.getData()

        // Prevent paragraph breaking into two
        editor.editing.view.document.on(
          'enter',
          (evt, data) => {
            editor.execute('shiftEnter')
            //Cancel existing event
            data.preventDefault()
            evt.stop()
          }, { priority: 'high' })

        editor.keystrokes.set('Ctrl+Shift+space', (key, stop) => {
          editor.execute('input', { text: '\u00a0' })
          stop()
        })

        editor.editing.model.document.on('change:data', () => {
          const hasChanged = editor.getData() !== initialData
          setState(hasChanged ? 'changed' : 'initial')
        })

        editor.editing.view.document.on(
          'paste',
          (eventInfo, data) => {
            console.log('[paste] eventInfo: %o, data: %o', eventInfo, data)
          }
        )

        editor.editing.view.document.on('blur', onBlur)
        editor.editing.view.document.on('focus', onFocus)

        // CKEditorInspector.attach(editor)

        editor.on('save', event => {
          const data = /^<p>(.+)<\/p>$/.exec(editor.getData())[1]
          onSave(data)
          setState('initial')
        })
      }}
    />
  )
}