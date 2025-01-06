# Challenger.io

Remix-flat-route is being used in this project since we don't like much the default route system of remixjs. See docs.

-   📖 [Remix flat route] (https://github.com/kiliman/remix-flat-routes)

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

# Code Style Guides

## TypeScript

1. (**Formatting and Linting**) Always format your code with Prettier and ensure no Eslint issues before commiting. You can run `pnpm check` to check for formatting and linting issues.

2. (**Function declarations**) Prefer top-level function declarations using the `function` keyword instead of using arrow function declarations.

    ```typescript
    // ✅ Correct
    function sum(a: number, b: number): number {
    	return a + b;
    }

    // ❌ Incorrect
    const sum = (a: number, b: number): number => {
    	return a + b;
    };
    ```

    Arrow functions declared inside functions are okay

    ```typescript
    export default function Button() {
    	const handleClick = () => {
    		// ✅ OK!
    		console.log("clicked!");
    	};
    }
    ```

3. No one-line `if`, `for` or `while` statements, blocks must always be enclosed with braces, even if the block contains only a single line.

    ```typescript
    // ✅ Correct
    if (a > b) {
    	return a;
    }

    // ❌ Incorrect
    if (a > b) return a;

    // ❌ Incorrect
    if (a > b) return a;
    ```

4. (**Naming Convention**)

    - Prefer **camelCase** in code, unless interfacing with external APIs (which might require you to use snake_case).
    - Prefer **kebab-case** for file names, unless it is a name for a React hook (like `useMatchesData.ts`).
    - Prefer **kebab-case** for CSS class names.

    - Try and use descriptive names

        ```typescript
        // ✅ Correct
        const topUpTransactionCount = await getTransactionCount(
        	TransactionType.TOP_UP
        );

        // ❌ Incorrect
        const count = await getTransactionCount(
        	// Count? What count?
        	TransactionType.TOP_UP
        );
        ```

## Git

1.  (**Commit messages convention**) Inspired by https://www.conventionalcommits.org/en/v1.0.0/, git commit messages must follow the style of

    ```
    <type>: <commit message>

    [Optional commit body]
    ```

    `<type>` must be all in lower-case, and **capitalize** the first letter of the `<commit message>`.

    Some common commit types:

    -   `feat`: Used when adding a new feature  
        Examples:

        ````
        feat: Add sales route

            feat: Update header colors
            ```

        ````

    -   `refactor`: Used for code changes that do not affect what the user sees (formatting, code structure changes, style changes etc.)  
        Examples:
        ```    refactor: Rename`productToName()`to`productToString()`

            refactor: Move auth functions to separate file
            ```

    -   `fix`: Bug fixes  
        Examples:

        ````
        fix: Change language route causes 500

            fix: `FadeInImage` not fading in when the image loads faster than JavaScript
            ```

        ````

    -   `chore`: Project structure and dependency management (package upgrades)  
        Examples:

        ````
        chore: Update packages

            chore: Update README
            ```
        ````

    `<commit message>` **must** be in the imperative voice/present tense, in other words, it must be grammatically correct when it is filled in the blanks of "this commit will **\_**"

    ```
    ✅ Correct
    feat: Add event logging (This commit will add event logging ✅)

    ✅ Correct
    fix: Extra padding in home page (This commit will fix extra padding in home page ✅)

    ❌ Incorrect
    feat: Added event logging (This commit will added event logging ❌)
    ```

2.  Always create a new branch off of the `dev` branch when working on a new feature. **Never** force push to `master` or `dev`. You are free to do so in your own branches.

3.  Before committing, please run `pnpm check` and make sure there are no TypeScript compilation errors, formatting issues and Eslint issues, and run `pnpm test` to make sure that all jest tests pass.
