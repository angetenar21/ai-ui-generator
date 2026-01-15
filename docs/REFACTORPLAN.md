You are absolutely right. My previous review was based on a traditional web-app development mindset, where consolidation and minimizing bundle size are key.

Your project's goal is fundamentally different: you are building an **AI UI Generator**. For this, **generative breadth is the primary feature**. Having multiple charting libraries, or both simple (`Stack`) and complex (`Flexbox`) primitives, is a *feature*, not a bug, as it gives the AI a wider vocabulary to pull from.

Thank you for the clarification. Here is a new, detailed action plan based on your goal of creating a robust, schema-driven AI generator.

-----

## 🚀 AI UI Generator: Refactor Plan

This plan is broken into three phases:

1.  **Cleanup:** Remove *true* junk—placeholders and legacy files that add no generative value.
2.  **Automation:** Create the schema generation script you mentioned.
3.  **Prompt Update:** Refactor `MainPrompt.md` to be powered by the new automated schema.

-----

### Phase 1: Cleanup `templates/` Directory

The goal here is to eliminate files that are either non-functional, misleading (simulations), or pure legacy duplicates. This streamlines the library without sacrificing capability.

#### 1.1: Delete Root-Level Legacy Templates

These files are legacy versions of components that now exist in proper subdirectories. They are confusing and redundant.

  * **DELETE:** `src/templates/ButtonGroupTemplate.tsx`
      * **Reason:** The AI should build this by composing `navigation/Button.tsx` inside a `layout/Stack.tsx` or `layout/Flexbox.tsx`.
  * **DELETE:** `src/templates/CardTemplate.tsx`
      * **Reason:** This is a legacy duplicate. The AI should use `surfaces/Panel.tsx` or `surfaces/Paper.tsx` as its "card" primitive.
  * **DELETE:** `src/templates/ChartTemplate.tsx`
      * **Reason:** This is a *simulated* chart. The AI should *only* use the real, functional charts from the `charts/` directory.
  * **DELETE:** `src/templates/FormTemplate.tsx`
      * **Reason:** This is a rigid anti-pattern for a generator. The AI should build forms by *composing* components from `inputs/` (e.g., `TextField.tsx`, `Checkbox.tsx`, `Button.tsx`).
  * **DELETE:** `src/templates/LayoutTemplate.tsx`
      * **Reason:** This is a legacy version of `layout/Grid.tsx` and `layout/Flexbox.tsx`. Delete it and prompt the AI to use the modern, more flexible layout components.
  * **DELETE:** `src/templates/TableTemplate.tsx`
      * **Reason:** This is a 1-to-1 duplicate of `data-display/DataTable.tsx`.
  * **DELETE:** `src/templates/TextTemplate.tsx`
      * **Reason:** This is a 1-to-1 duplicate of `surfaces/Text.tsx`.

#### 1.2: Delete Non-Functional Placeholders

These files contain no logic and provide no generative value. The AI will be "hallucinating" functionality if it tries to use them.

  * **DELETE (from `navigation/`):**

      * `ContextMenu.tsx`
      * `Dropdown.tsx`
      * `FloatingActionButton.tsx`
      * `IconButton.tsx`
      * `Link.tsx`
      * `NavigationRail.tsx`
      * `SegmentedControl.tsx`
      * `SpeedDial.tsx`

  * **DELETE (from `media/`):**

      * `ImageComparison.tsx`
      * `ImageCropper.tsx`
      * `Lightbox.tsx` (Note: `Gallery.tsx` *already implements* its own lightbox, making this file doubly unnecessary).

#### 1.3: Delete "Simulated" Components

These files are *misleading*. They look real but are just placeholder visualizations. They must be removed to ensure the AI only generates functional components.

  * **DELETE (from `advanced/`):**

      * `Barcode.tsx`
      * `Map.tsx`
      * `QRCode.tsx`
      * `Signature.tsx`

  * **DELETE (from `charts/`):**

      * `CandlestickChart.tsx`
      * `SunburstChart.tsx`
      * `ViolinChart.tsx`
      * *(And any other "approximated" charts)*

#### 1.4: Consolidate True Duplicates

These components offer the *exact same* functionality. This is not generative breadth, just confusion.

  * **DELETE:** `feedback/Snackbar.tsx` and `feedback/Toast.tsx`.
      * **Reason:** Keep `feedback/Notification.tsx`. It is the most feature-rich (title, actions, etc.) and serves the exact same purpose. Standardize on `notification`.
  * **DELETE:** `feedback/Dialog.tsx`.
      * **Reason:** Keep `feedback/Modal.tsx`. A `Dialog` is just a `Modal` with a specific layout. The AI should be instructed to *compose* a dialog using the `Modal` primitive (e.g., a `Modal` containing a `Text` component and a `Flexbox` of `Button`s).

-----

### Phase 2: Create Schema Generation Script

This is the core of your automation goal. You need a script that reads your `templates/` directory and generates a single, machine-readable JSON schema.

I recommend creating a script (e.g., `scripts/generate-schema.ts`). Here is its action plan:

1.  **Read All Components:** The script will use `glob` to find all `src/templates/**/*.tsx` files.

2.  **Extract Metadata:** For each file, it will parse the exported `metadata` object (like the one in `src/templates/surfaces/Text.tsx`).

3.  **Enhance Prop Definitions:** The current `metadata.propTypes` is just a string. This is not robust enough. You should refactor the `metadata` in each component to export a structured `propTypes` object, just like the schemas in your `MainPrompt.md`.

    **Example for `SummaryCard.tsx`:**

    ```typescript
    // In src/templates/surfaces/SummaryCard.tsx
    export const metadata = {
      name: 'summary-card',
      category: 'surfaces' as const,
      component: SummaryCard,
      description: 'Card component for displaying multiple summary metrics...',
      propTypes: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: false },
        layout: { type: 'enum', options: ['vertical', 'horizontal', 'grid'], required: false },
        columns: { type: 'enum', options: [2, 3, 4], required: false },
        items: {
          type: 'array',
          required: true,
          schema: {
            type: 'object',
            properties: {
              label: { type: 'string', required: true },
              value: { type: 'string | number', required: true },
              change: { type: 'string', required: false },
              changeType: { type: 'enum', options: ['positive', 'negative', 'neutral'], required: false },
              subtext: { type: 'string', required: false },
            }
          }
        }
      }
    };
    ```

4.  **Assemble Schema:** The script will loop through all components, read this new structured `metadata`, and assemble it into a single `component-library-schema.json`.

5.  **Output:** The final file will be a JSON object that maps component names to their full schemas (props, descriptions, categories).

-----

### Phase 3: Update `MainPrompt.md`

With the cleanup and automation script in place, you can now radically simplify and improve your main prompt.

1.  **Remove Manual Schemas:** Delete **all** of `PART 5`, `PART 6`, `PART 8`, and `PART 9` (the manually written schemas, examples, and reference tables).
2.  **Inject Automated Schema:** The prompt should now instruct the AI that the *complete and definitive schema* will be provided as a separate JSON file.
3.  **Refocus the Prompt:** The prompt should now focus on *philosophy, rules, and best practices*, using the provided schema as its "source of truth."

#### Proposed `MainPrompt.md` Structure:

  * **PART 1: AGENT ROLE & PHILOSOPHY** (Keep as-is)

  * **PART 2: WORKFLOW** (Keep as-is)

  * **PART 3: OUTPUT FORMAT** (Keep as-is)

  * **PART 4: COLOR PALETTE** (Keep as-is)

  * **NEW PART 5: COMPONENT LIBRARY SCHEMA**

    > **CRITICAL:** You will be provided with a `component-library-schema.json` file alongside this prompt. That file contains the *complete and definitive API* for every available component.

    >   * **You MUST** use that schema as your single source of truth for component names, props, and types.
    >   * **You MUST** adhere strictly to the `name` and `templateProps` defined in that schema.
    >   * **Do NOT** hallucinate props or components that are not in the schema.

  * **NEW PART 6: BEST PRACTICES & GUIDELINES**

      * **Compose, Don't Assume:** Do not look for a `dialog` component. Build one using a `modal` primitive with `text` and `button` components inside.
      * **Build Forms:** Do not look for a `form` component. Build forms by composing components from the 'inputs' category (e.g., `text-field`, `checkbox`, `select`, `button`).
      * **Group Buttons:** Do not look for a `button-group`. Create one by using a `stack` or `flexbox` component with multiple `button` components inside.
      * **Choose the Right Chart:** You have access to two charting libraries.
          * Use `@mui/x-charts` (`line-chart`, `bar-chart`, `pie-chart`, `scatter-chart`) for standard, modern, and clean visualizations.
          * Use `recharts` (`treemap-chart`, `radar-chart`, `boxplot-chart`, etc.) for more complex or specialized statistical charts.
      * **Explain Your Choices:** Always include a `text` component to describe the data and *why* you chose a specific visualization.
      * **Summarize First:** Lead with high-level metrics. Use `summary-card` and `insight-card` components *before* showing complex charts or tables.

This new structure makes your prompt cleaner, more robust, and automatically in sync with your codebase.