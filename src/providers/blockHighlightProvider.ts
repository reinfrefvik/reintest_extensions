import * as vscode from "vscode";

export class BlockHighlightProvider {
  private active = true;
  private blockDecoration!: vscode.TextEditorDecorationType;
  
  private readonly blockStartRegex = /\/\/\s*@block-start:(\w+)/g;
  private readonly blockEndRegex = /\/\/\s*@block-end:(\w+)/g;

  constructor() {
    this.updateDecorationType();
  }

  private updateDecorationType() {
    if (this.blockDecoration) {
      this.blockDecoration.dispose();
    }

    const color = vscode.workspace
      .getConfiguration("reintest")
      .get<string>("blockHighlightColor", "rgba(100, 240, 100, 0.05)");

    this.blockDecoration = vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      backgroundColor: color,
      borderRadius: "2px",
    });
  }

  updateDecorations(editor: vscode.TextEditor) {
    if (!this.active || !editor) {
      if (this.blockDecoration) {
        editor.setDecorations(this.blockDecoration, []);
      }
      return;
    }

    if(!this.blockDecoration) {
      this.updateDecorationType();
    }

    const text = editor.document.getText();
    const decorations: vscode.DecorationOptions[] = [];

    // Step 1: Find all start markers with their identifiers and line positions
    this.blockStartRegex.lastIndex = 0; // Reset regex state
    const startMarkers: Array<{identifier: string, line: number, position: number}> = [];
    let startMatch: RegExpExecArray | null;

    while ((startMatch = this.blockStartRegex.exec(text))) {
      const identifier = startMatch[1]; // The captured identifier
      const position = startMatch.index;
      const line = editor.document.positionAt(position).line;

      startMarkers.push({
        identifier,
        line,
        position
      });

      console.log(`Found start marker: ${identifier} at line ${line}`);
    }

    // Step 2: Find all end markers with their identifiers and line positions
    this.blockEndRegex.lastIndex = 0; // Reset regex state
    const endMarkers: Array<{identifier: string, line: number, position: number}> = [];
    let endMatch: RegExpExecArray | null;

    while ((endMatch = this.blockEndRegex.exec(text))) {
      const identifier = endMatch[1]; // The captured identifier
      const position = endMatch.index;
      const line = editor.document.positionAt(position).line;

      endMarkers.push({
        identifier,
        line,
        position
      });

      console.log(`Found end marker: ${identifier} at line ${line}`);
    }

    // Step 3: Match start markers with their corresponding end markers
    for (const startMarker of startMarkers) {
      // Find the first end marker with the same identifier that comes after this start marker
      const matchingEndMarker = endMarkers.find(endMarker =>
        endMarker.identifier === startMarker.identifier &&
        endMarker.position > startMarker.position
      );

      if (matchingEndMarker) {
        console.log(`Matched block: ${startMarker.identifier} from line ${startMarker.line} to ${matchingEndMarker.line}`);

        // Create decoration range from start line to end line
        const startPos = new vscode.Position(startMarker.line, 0);
        const endPos = new vscode.Position(matchingEndMarker.line, editor.document.lineAt(matchingEndMarker.line).text.length);
        const range = new vscode.Range(startPos, endPos);

        decorations.push({ range });
      } else {
        console.warn(`No matching end marker found for: ${startMarker.identifier} at line ${startMarker.line}`);
      }
    }

    editor.setDecorations(this.blockDecoration, decorations);
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
        editor.setDecorations(this.blockDecoration, []);
      }
    }
    return this.active;
  }

  dispose() {
    if (this.blockDecoration) {
      this.blockDecoration.dispose();
    }
  }
}