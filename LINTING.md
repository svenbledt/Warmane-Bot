# ESLint Setup for Warmane-Bot

ESLint has been configured for this project with the following features:

## Configuration
- Uses ESLint recommended rules
- Targets Node.js and ES2021 environments
- Enforces consistent code style:
  - 4-space indentation
  - Unix line endings
  - Single quotes for strings
  - Mandatory semicolons
  - No unused variables (warning)
  - No undefined variables (error)
  - Requires const/let instead of var
  - Prefers const where possible

## Usage
- Run `npm run lint` to check for linting issues
- Run `npm run lint:fix` to automatically fix linting issues where possible

## Ignored Files
The following paths are ignored by ESLint:
- node_modules/
- dist/
- coverage/