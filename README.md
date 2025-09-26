# reintest README

## Features
Highlights the top line of every describe and test block in test files.

## Usage

### Automatic Highlighting
The extension automatically activates when you open `.spec.ts` files and highlights:
- **Test blocks**: Lines containing `test()`, `test.beforeEach()`, or `test.beforeAll()` calls
- **Describe blocks**: Lines containing `test.describe()` calls

### Toggle Highlighting
You can turn highlighting on/off using the toggle command:
1. Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on Mac)
2. Type "Toggle Highlight Tests in Spec Files" and press Enter
3. The extension will show a message indicating whether highlighting is now enabled or disabled

### Customizing Colors
You can customize the highlight colors through VS Code settings:
1. Go to File > Preferences > Settings (or `Ctrl+,` / `Cmd+,`)
2. Search for "reintest"
3. Adjust the colors for test and describe block highlighting

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

## Known Issues
Can conflict with other visual extensions.

### 0.0.1
Early test release

