import { EditorContent, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import EditorExtension from './EditorExtension'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import BulletList from '@tiptap/extension-bullet-list'
import Blockquote from '@tiptap/extension-blockquote'
import TextAlign from '@tiptap/extension-text-align'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function TextEditor({ fileId }) {
  // Ensure fileId is valid before querying
  const notes = useQuery(api.notes.GetNotes, fileId ? { fileId } : null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start Taking Your notes here...',
      }),
      Underline,
      BulletList,
      Blockquote,
      Highlight.configure({ multicolor: true }), // Enable multicolor highlighting
      TextAlign.configure({ types: ['heading', 'paragraph'] }), // Enable text alignment
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5',
      },
    },
  })

  // Ensure notes exist before updating editor
  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes || '') // Avoid setting undefined content
    }
  }, [notes, editor])

  return (
    <div>
      <EditorExtension editor={editor} />
      <div className="overflow-scroll h-[80vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor
