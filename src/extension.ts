import * as vscode from "vscode";
import { TestHighlightProvider } from "./providers/testHighlightProvider";
import { BlockHighlightProvider } from "./providers/blockHighlightProvider";

let testHighlightProvider: TestHighlightProvider;
let blockHighlightProvider: BlockHighlightProvider;

export function activate(context: vscode.ExtensionContext) {
  testHighlightProvider = new TestHighlightProvider();
  blockHighlightProvider = new BlockHighlightProvider();

  // event hooks
  // update types from config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("reintest")) {
        testHighlightProvider.onConfigurationChange();
        blockHighlightProvider.onConfigurationChange();
      }
    })
  );

  // event hooks
  // active editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        testHighlightProvider.updateDecorations(editor);
        blockHighlightProvider.updateDecorations(editor);
      }
    }),

    vscode.workspace.onDidChangeTextDocument((e) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && e.document === editor.document) {
        testHighlightProvider.updateDecorations(editor);
        blockHighlightProvider.updateDecorations(editor);
      }
    }),

    // Handle when text documents are opened
    vscode.workspace.onDidOpenTextDocument((document) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        testHighlightProvider.updateDecorations(editor);
        blockHighlightProvider.updateDecorations(editor);
      }
    }),

    vscode.commands.registerCommand("reintest.toggleTestHighlight", () => {
      const active = testHighlightProvider.toggle();
      vscode.window.showInformationMessage(
        `Reintest test highlighting is now ${active ? "enabled" : "disabled"}.`
      );
    })
  );

  // Force update all visible editors immediately after activation
  // This handles the case where files are already open when extension loads
  vscode.window.visibleTextEditors.forEach(editor => {
    testHighlightProvider.updateDecorations(editor);
    blockHighlightProvider.updateDecorations(editor);
  });
}

export function deactivate() {
  if (testHighlightProvider) {
    testHighlightProvider.dispose();
  }
  if (blockHighlightProvider) {
    blockHighlightProvider.dispose();
  }
}
