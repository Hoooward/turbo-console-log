import { TextEditor } from 'vscode';

import { GeneralDebugMessage } from '@/debug-message/GeneralDebugMessage';
import { GeneralLanguageProcessor } from '@/debug-message/LanguageProcessor';

export const instanceDebugMessage = (editor: TextEditor) => {
  if (!editor) {
    throw new Error('No editor available');
  }
  const isUnityCSharpFile = () => {
    if (editor?.document.languageId === 'csharp') {
      const filePath = editor.document.uri.fsPath;
      const isInUnityDirectory = filePath.includes('Assets') || filePath.includes('Packages');

      if (isInUnityDirectory) {
        const text = editor.document.getText();
        return text.includes('using UnityEngine') || text.includes('using UnityEditor');
      }
    }
    return false;
  };

  let languageId;
  if (isUnityCSharpFile()) {
    languageId = 'csharpUnity';
  } else {
    languageId = editor?.document.languageId || 'javascript';
  }

  return {
    debugMessage: new GeneralDebugMessage(new GeneralLanguageProcessor(languageId)),
  };
};
