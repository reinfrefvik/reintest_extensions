# reintest README

## Features
Highlights the top line of every describe and test block in test files.

## Usage

### Automatic Highlighting
The extension automatically activates when you open `.spec.ts` files and highlights:
- **Test blocks**: Lines containing `test()`, `test.beforeEach()`, or `test.beforeAll()` calls
- **Describe blocks**: Lines containing `test.describe()` calls

### Toggle Highlighting
Toggle highlighting with the toggle command: "Toggle Highlight Tests in Spec Files" in the Command Pallette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on Mac)

### Customizing Colors
You can customize the highlight colors through VS Code settings under 'reintest':

## Extension Settings
This extension contributes the following settings:

`reintest.testHighlightColor`: Color for test blocks.
`reintest.descHighlightColor`: Color for describe blocks

## Development

To run this extension in development mode:

1. Open this project in VS Code
2. Press `F5` or run "Run Extension" from the Run and Debug panel
3. This will open a new Extension Development Host window
4. In the Extension Development Host, open a **different project** that contains `.spec.ts` files (not this extension project)
5. The extension will automatically highlight test blocks in any `.spec.ts` files in the opened project

### Development Commands

- `npm run compile` - Build the extension
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run test` - Run tests
- `npm run lint` - Run linting

**Important**: Always test the extension on a separate project with TypeScript test files, not on this extension's source code.

## Installing Locally

To install this extension for use across all your projects without publishing to the marketplace:

1. **Install vsce** (VS Code Extension manager):
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Package the extension**:
   ```bash
   npm run vscode:prepublish
   vsce package
   ```
   This creates a `.vsix` file (e.g., `reintest-0.0.3.vsix`)

3. **Install the packaged extension**:
   - **Via VS Code**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type "Extensions: Install from VSIX", and select your `.vsix` file
   - **Via Command Line**: `code --install-extension reintest-0.x.x.vsix`

4. **Restart VS Code** and the extension will be available in all your projects

To update the extension later, repeat steps 2-4 with the new version.

## Known Issues
Can conflict with other visual extensions.

### 0.1.0
Early test release

### 0.2.0
Version with both test highlighter and block highlighter