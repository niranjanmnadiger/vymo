# Dynamic lead form

Built with Vite, React, TypeScript, and CSS Modules.

## Install and run

Use Node.js 22.12 or newer.

```bash
npm ci
npm run dev
```

Open the URL shown in the terminal.

```bash
npm test             # Run the tests
npm run build        # Check TypeScript and build the app
npm run preview      # View the production build
```

## Folder layout

```text
src/
design-system/
tokens.css                  # Colours, spacing, and typography
breakpoints.module.css      # Shared mobile and desktop breakpoints
atoms/                      # Input, select, textarea, checkbox, button
Field/                      # Label, control, hint, and error wrapper
components/DynamicForm/         # Config rendering and form state
features/lead/
lead.config.ts              # Fields, options, and validation rules
validateLead.ts             # Pure validation function
LeadPage.tsx                # Lead form page and submitted values
LeadPage.module.css         # Page layout
lead.fixtures.ts            # Mock values for tests
types/form.ts                # Shared TypeScript types
test/                        # Test setup
App.tsx
main.tsx
styles.css                   # Global styles
```

## How it works

The form maps the config to reusable atoms. Add a config entry to add another
field of a supported type. Validation takes the config and current values and
returns errors. Errors appear on blur and submit; invalid submission is blocked.
Company name is only shown and required when Company is selected. Hidden values
stay in the draft but are excluded from submission. Valid values appear below
the form. Refreshing the page clears the data.

## Responsive layout

`DynamicForm.module.css` owns the field grid and submit bar. Above 1024px there
are two columns, with notes and consent spanning both. Below 768px there is one
column and a fixed bottom submit bar. Tablet uses one column.

`LeadPage.module.css` owns the centred page and mobile bottom spacing.
`breakpoints.module.css` supplies the shared breakpoints through CSS Modules
`@value`. `Field.module.css` keeps labels, hints, and errors wrapping correctly.

## Checks

`npm test` covers validation and form interactions. Browser layout still needs
a manual check: try 320px, 390px, 768px, and 1440px widths and submit an empty form
at each size. The automated DOM tests do not measure layout.
