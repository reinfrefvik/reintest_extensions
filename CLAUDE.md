# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Visual Studio Code extension called "reintest" that highlights test blocks in TypeScript spec files. The extension provides visual highlighting for test functions and describe blocks in `.spec.ts` files using configurable background colors.

## Claude Role
In this project your role as the AI assistant is to assist the user in developing a Visual Studio Code Extension. The user is inexperienced with developing extensions for visual studio code, but is experienced with programming with typescript and node applications.

## Development Commands

- **Build/Compile**: `npm run compile` - Compiles TypeScript to JavaScript in the `out/` directory
- **Watch Mode**: `npm run watch` - Continuously compiles TypeScript on file changes
- **Lint**: `npm run lint` - Runs ESLint on the `src/` directory
- **Test**: `npm run test` - Runs the test suite using VS Code's test framework
- **Package for Publishing**: `npm run vscode:prepublish` - Prepares extension for VS Code marketplace

## Architecture

### Core Components

- **Main Extension File**: `src/extension.ts` - Contains all extension logic
- **Test Suite**: `src/test/extension.test.ts` - Basic test setup using Mocha
- **Configuration**: Uses VS Code's configuration API with two settings:
  - `reintest.testHighlightColor` - Color for test block highlighting
  - `reintest.descHighlightColor` - Color for describe block highlighting

### Extension Structure

The extension operates through:
1. **Text Decoration API** - Creates visual highlights using `vscode.TextEditorDecorationType`
2. **Regex Matching** - Two core patterns:
   - `testRegex`: Matches `test()`, `test.beforeEach()`, `test.beforeAll()` calls
   - `descRegex`: Matches `test.describe()` calls
3. **Event Handlers** - Responds to active editor changes, document changes, and configuration updates
4. **Command Registration** - Provides `reintest.toggleTestHighlight` command

### File Targeting

The extension only activates on files ending with `.spec.ts`. All highlighting is applied to the full line containing matching test patterns.

## Key Technical Details

- Built with TypeScript targeting ES2022
- Uses VS Code Engine version ^1.101.0
- Compiled output goes to `out/` directory
- Test configuration uses `@vscode/test-cli` framework
- ESLint configuration in `eslint.config.mjs`

## Bug Note

There's a configuration mismatch in `src/extension.ts:92` - the code listens for `playwrightHighlighter.highlightColor` changes instead of the correct `reintest` configuration keys.