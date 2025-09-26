// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

let active = true;

let testDecoration: vscode.TextEditorDecorationType;
let descDecoration: vscode.TextEditorDecorationType;

const testRegex = /^(?!\s*\/\/).*?test(\.beforeEach|\.beforeAll|\(\'.*\')/gm;
const descRegex = /^(?!\s*\/\/).*?test\.describe\(\'.*\'/gm;

function updateDecorationType() {
  if (testDecoration) {
    testDecoration.dispose();
  }
  if (descDecoration) {
    descDecoration.dispose();
  }

  const color = vscode.workspace
    .getConfiguration("reintest")
    .get<string>("testHighlightColor", "rgba(100,150,240,0.15)");
  const descColor = vscode.workspace
    .getConfiguration("reintest")
    .get<string>("descHighlightColor", "rgba(226, 100, 240, 0.1)");

  testDecoration = vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: color,
    borderRadius: "2px",
  });

  descDecoration = vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: descColor,
    borderRadius: "2px",
  });
}

function updateDecorations(editor: vscode.TextEditor) {
  if (!active || !editor) {
    if (testDecoration) {
      editor.setDecorations(testDecoration, []);
    }
    if (descDecoration) {
      editor.setDecorations(descDecoration, []);
    }
    return;
  }

  if (!editor.document.fileName.endsWith(".spec.ts")) {
    if (testDecoration) {
      editor.setDecorations(testDecoration, []);
    }
    if (descDecoration) {
      editor.setDecorations(descDecoration, []);
    }
    return;
  }

  // Ensure decorations are initialized
  if (!testDecoration || !descDecoration) {
    updateDecorationType();
  }

  testRegex.lastIndex = 0;
  descRegex.lastIndex = 0;
  const text = editor.document.getText();
  const decorations: vscode.DecorationOptions[] = [];
  const descDecorations: vscode.DecorationOptions[] = [];
  let match: RegExpExecArray | null;

  while ((match = testRegex.exec(text))) {
    const startPos = editor.document.positionAt(match.index);
    const endPos = editor.document.positionAt(
      match.index + match[0].length - 1
    );
    decorations.push({ range: new vscode.Range(startPos, endPos) });
  }

  while ((match = descRegex.exec(text))) {
    const startPos = editor.document.positionAt(match.index);
    const endPos = editor.document.positionAt(
      match.index + match[0].length - 1
    );
    descDecorations.push({ range: new vscode.Range(startPos, endPos) });
  }

  editor.setDecorations(testDecoration, decorations);
  editor.setDecorations(descDecoration, descDecorations);
}

function triggerUpdateAllVisibleEditors() {
  vscode.window.visibleTextEditors.forEach(updateDecorations);
}

export function activate(context: vscode.ExtensionContext) {
  updateDecorationType();

  // event hooks
  // update types from config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("reintest")) {
        updateDecorationType();
        triggerUpdateAllVisibleEditors();
      }
    })
  );

  // event hooks
  // active editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        updateDecorations(editor);
      }
    }),

    vscode.workspace.onDidChangeTextDocument((e) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && e.document === editor.document) {
        updateDecorations(editor);
      }
    }),

    // Handle when text documents are opened
    vscode.workspace.onDidOpenTextDocument((document) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        updateDecorations(editor);
      }
    }),

    vscode.commands.registerCommand("reintest.toggleTestHighlight", () => {
      active = !active;
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        if (active) {
          updateDecorations(editor);
        } else {
          editor.setDecorations(testDecoration, []);
          editor.setDecorations(descDecoration, []);
        }
      }
      vscode.window.showInformationMessage(
        `Reintest test highlighting is now ${active ? "enabled" : "disabled"}.`
      );
    })
  );

  // Force update all visible editors immediately after activation
  // This handles the case where files are already open when extension loads
  vscode.window.visibleTextEditors.forEach(editor => {
    updateDecorations(editor);
  });
}

export function deactivate() {
  if (testDecoration) {
    testDecoration.dispose();
  }
}
