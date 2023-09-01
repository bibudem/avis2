'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from '@/lib/Editor/ckeditor'

export default function CustomCKEditor({ data, onSave = () => { } }) {
  return (

    <CKEditor
      editor={Editor}
      data={data}
      config={{
        // plugins: 
        toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'link', '|', 'save']
      }}
      onReady={editor => {
        editor.editing.view.document.on(
          'enter',
          (evt, data) => {
            editor.execute('shiftEnter')
            //Cancel existing event
            data.preventDefault()
            evt.stop()
          }, { priority: 'high' })

        // CKEditorInspector.attach(editor)

        editor.on('save', event => {
          const data = /^<p>(.+)<\/p>$/.exec(editor.getData())[1]
          onSave(data)
        })
      }}
    />
  )
}