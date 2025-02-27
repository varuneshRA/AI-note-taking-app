import { chatSession } from '@/configs/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { 
  AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, 
  Highlighter, Italic, List, Sparkles, Strikethrough, TextQuote, Underline, Save, 
  Ellipsis
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function EditorExtension({ editor }) {
  const [loading, setLoading] = useState(false);

  const SearchAI = useAction(api.myActions.search);
  const { fileId } = useParams();
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const onAiClick = async () => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );

    if (!selectedText.trim()) {
      toast("Select any text from the editor");
      return;
    }

    setLoading(true);
    toast("AI is generating your answer...");
    console.log("Selected text:", selectedText,fileId);

    try {
      const result = await SearchAI({ query: selectedText, fileId: fileId });
      const unformattedAns = JSON.parse(result);
      let AllunformattedAns = '';
      
      unformattedAns.forEach(item => {
        AllunformattedAns += item.pageContent;
      });

      console.log('unformattedAns',AllunformattedAns)

      const PROMPT = `For question: ${selectedText} and with the given content as answer, 
        please give an appropriate answer in HTML format (don’t print the question, 
        give only the answer with explanation). The from the content : ${AllunformattedAns}`;

      const AiModelResult = await chatSession.sendMessage(PROMPT);
      const FinalAns = AiModelResult.response.text().replace(/```html|```/g, '');

      console.log('FinalAns',FinalAns)
      
      editor.commands.setContent(editor.getHTML() + `<p><strong>Answer: </strong>${FinalAns}</p>`);
      
      saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress
      });
    } catch (error) {
      toast("Failed to generate AI response.");
      console.error(error);
    }
    
    setLoading(false);
  };

  const onSaveClick = () => {
    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress
    });
    toast("Notes saved successfully!");
  };

  return editor && (
    <div className="p-5">
      <div className="control-group">
        <div className="button-group flex gap-3">
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 />
          </button>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <Underline />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List />
          </button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <TextQuote />
          </button>
          <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
            <Highlighter />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight />
          </button>
          
          <button
            onClick={onAiClick}
            className="text-amber-700 hover:text-amber-500"
            title="AI help"
            disabled={loading}
          >
            {loading ? <span className="animate-spin"><Ellipsis /></span> : <Sparkles />}
          </button>

          <button onClick={onSaveClick} className="text-amber-700 hover:text-amber-500" title="Save">
            <Save />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorExtension;
