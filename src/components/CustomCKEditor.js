'use client'

import { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from '@/lib/Editor/ckeditor'
import noop from '@/utils/noop'

export default function CustomCKEditor({ data, onSave = noop, onStateChange = noop, onFocus = noop, onBlur = noop }) {
  const [state, setState] = useState('initial')

  useEffect(() => {
    onStateChange(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            let initialData = editor.getData()

            // Prevent paragraph breaking into two
            editor.editing.view.document.on(
                'enter',
                (evt, data) => {
                  editor.execute('shiftEnter')
                  //Cancel existing event
                  data.preventDefault()
                  evt.stop()
                }, { priority: 'high' })

            // Add keyboard shortcut for non break space
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

            editor.ui.focusTracker.on('change:isFocused', (event, propName, isFocused) => {
              // console.log(`${propName} has changed from ${oldValue} to ${newValue}`)
              if (isFocused) {
                onFocus()
              } else {
                onBlur()
              }
            })

            // CKEditorInspector.attach(editor)

            editor.on('save', event => {
              const data = editor.getData()
              const html = /^<p>(.+)<\/p>$/.exec(data)[1]
              onSave(html)
              initialData = data
              setState('initial')
            })
          }}
      />
  )
}
