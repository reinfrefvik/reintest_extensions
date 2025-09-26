import * as vscode from "vscode";

export class TestHighlightProvider {
  private active = true;
  private testDecoration!: vscode.TextEditorDecorationType;
  private descDecoration!: vscode.TextEditorDecorationType;

  private readonly testRegex = /^(?!\s*\/\/).*?test(\.beforeEach|\.beforeAll|\([\'"`].*[\'"`])/gm;
  private readonly descRegex = /^(?!\s*\/\/).*?test\.describe\([\'"`].*[\'"`]/gm;
// 
  constructor() {
    this.updateDecorationType();
  }

  private updateDecorationType() {
    if (this.testDecoration) {
      this.testDecoration.dispose();
    }
    if (this.descDecoration) {
      this.descDecoration.dispose();
    }

    const color = vscode.workspace
      .getConfiguration("reintest")
      .get<string>("testHighlightColor", "rgba(123, 169, 255, 0.18)");
    const descColor = vscode.workspace
      .getConfiguration("reintest")
      .get<string>("descHighlightColor", "rgba(226, 100, 240, 0.1)");

    this.testDecoration = vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      backgroundColor: color,
      borderRadius: "2px",
    });

    this.descDecoration = vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      backgroundColor: descColor,
      borderRadius: "2px",
    });
  }

  updateDecorations(editor: vscode.TextEditor) {
    if (!this.active || !editor) {
      if (this.testDecoration) {
        editor.setDecorations(this.testDecoration, []);
      }
      if (this.descDecoration) {
        editor.setDecorations(this.descDecoration, []);
      }
      return;
    }

    if (!editor.document.fileName.endsWith(".spec.ts")) {
      if (this.testDecoration) {
        editor.setDecorations(this.testDecoration, []);
      }
      if (this.descDecoration) {
        editor.setDecorations(this.descDecoration, []);
      }
      return;
    }

    // Ensure decorations are initialized
    if (!this.testDecoration || !this.descDecoration) {
      this.updateDecorationType();
    }

    this.testRegex.lastIndex = 0;
    this.descRegex.lastIndex = 0;
    const text = editor.document.getText();
    const decorations: vscode.DecorationOptions[] = [];
    const descDecorations: vscode.DecorationOptions[] = [];
    let match: RegExpExecArray | null;

    while ((match = this.testRegex.exec(text))) {
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(
        match.index + match[0].length - 1
      );
      decorations.push({ range: new vscode.Range(startPos, endPos) });
    }

    while ((match = this.descRegex.exec(text))) {
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(
        match.index + match[0].length - 1
      );
      descDecorations.push({ range: new vscode.Range(startPos, endPos) });
    }

    editor.setDecorations(this.testDecoration, decorations);
    editor.setDecorations(this.descDecoration, descDecorations);
  }

  triggerUpdateAllVisibleEditors() {
    vscode.window.visibleTextEditors.forEach(editor => this.updateDecorations(editor));
  }

  onConfigurationChange() {
    this.updateDecorationType();
    this.triggerUpdateAllVisibleEditors();
  }

  toggle(): boolean {
    this.active = !this.active;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      if (this.active) {
        this.updateDecorations(editor);
      } else {
        editor.setDecorations(this.testDecoration, []);
        editor.setDecorations(this.descDecoration, []);
      }
    }
    return this.active;
  }

  dispose() {
    if (this.testDecoration) {
      this.testDecoration.dispose();
    }
    if (this.descDecoration) {
      this.descDecoration.dispose();
    }
  }
}