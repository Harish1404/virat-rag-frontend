---
name: frontend-design
description: Use when creating, improving, refactoring, reviewing or making existing frontend UI responsive in this RAG application. Follow the existing Claude Design handoff, design system and CSS architecture. Especially use for responsive improvements across mobile, tablet, laptop, desktop and large Android TV screens.
---

# Frontend Design and Development Skill

## 1. Purpose

This Skill defines how to build, improve and maintain the frontend UI of this RAG application.

The project already has an initial frontend implementation and Claude Design has already been integrated.

The goal is NOT to redesign everything from scratch.

The goal is to progressively improve the existing interface, maintain visual consistency, improve responsiveness and maintain clean, production-oriented frontend code.

Always follow the main project instructions in CLAUDE.md.

---

## 2. Existing Design System

The application has an existing design created using Claude Design.

Before implementing any UI changes:

1. Inspect the existing frontend.
2. Understand the current visual design.
3. Inspect the existing component hierarchy.
4. Understand the current light and dark themes.
5. Inspect the existing styles folder.
6. Identify reusable components and design tokens.
7. Preserve the established visual identity.

Do not introduce an entirely new design language without my approval.

### Design Consistency

Maintain consistency in:

- Typography.
- Font sizes and weights.
- Primary and secondary colours.
- Background colours.
- Card styles.
- Borders.
- Shadows.
- Border radius.
- Spacing.
- Buttons.
- Form controls.
- Navigation.
- Icons.
- Interactive states.

New components should look like they belong to the existing application.

When Claude Design provides a new design or handoff, use it as the visual reference while respecting the existing application architecture.

---

## 3. Centralised Styling Architecture

The project already contains a styles folder with separate light-theme, dark-theme and component CSS files.

Respect this architecture.

### CSS Variables

All reusable theme colours should be managed centrally.

Examples:

- --color-primary
- --color-secondary
- --color-background
- --color-surface
- --color-text-primary
- --color-text-secondary
- --color-border
- --color-muted
- --color-accent
- --color-success
- --color-warning
- --color-error

Use the existing variable naming conventions whenever available.

### Rules

- Do not hardcode repeated colours inside individual components.
- Do not create duplicate colour definitions.
- Do not introduce a separate design-token system.
- Keep light and dark theme values in their respective existing files.
- Use component CSS files for styles that genuinely need dedicated CSS.
- Use Tailwind for layout, spacing and responsive utilities.
- Ensure components work correctly in both light and dark themes.
- Make it easy to customise the entire application by changing centralised CSS variables.

When introducing a new design token, check whether an equivalent token already exists.

---

## 4. Responsive Design — Highest Priority

Every component must be designed and tested for multiple screen sizes.

Do not treat responsive design as an optional finishing step.

### A. Mobile

Prioritise small screens and touch interactions.

Requirements:

- Avoid horizontal overflow.
- Use appropriate padding and spacing.
- Ensure readable text.
- Make buttons and interactive elements touch-friendly.
- Adapt navigation for smaller screens.
- Ensure chat messages fit within the available width.
- Keep the chat input accessible.
- Prevent long messages and code blocks from breaking the layout.
- Ensure dialogs and dropdowns fit the viewport.
- Handle virtual keyboard behaviour appropriately.

Do not simply shrink the desktop layout.

### B. Tablet

Requirements:

- Make effective use of available width.
- Adjust sidebar and navigation behaviour.
- Maintain balanced content spacing.
- Use suitable typography.
- Prevent excessively wide chat messages.
- Ensure touch interactions remain comfortable.
- Adapt grids and cards appropriately.

### C. Laptop and Desktop

Requirements:

- Maintain a balanced content layout.
- Avoid excessive empty space.
- Use sensible maximum content widths.
- Keep navigation and sidebars organised.
- Maintain consistent spacing.
- Make long conversations readable.
- Ensure the chat interface uses available screen space effectively.

### D. Large Displays and Android TV

Android TV support is important for this project.

Do not treat large TV screens as simply larger desktop monitors.

Requirements:

- Support large screen resolutions.
- Use readable typography from a reasonable viewing distance.
- Scale important controls appropriately.
- Avoid tiny buttons and tightly packed UI elements.
- Maintain comfortable content widths.
- Avoid excessive horizontal stretching.
- Use clear focus indicators.
- Where Android TV remote navigation is supported, ensure interactive controls can be navigated using directional keys.
- Maintain logical focus order.
- Ensure focused elements are visually distinguishable.
- Avoid hover-only interactions.
- Ensure dialogs and interactive components remain usable from a distance.

Do not sacrifice desktop usability to accommodate TV layouts.

### Responsive Implementation

Use:

- Mobile-first design.
- Tailwind responsive breakpoints.
- CSS media queries where necessary.
- CSS Grid and Flexbox.
- Flexible widths and heights.
- min-width and max-width constraints where appropriate.
- Responsive typography when useful.

Avoid unnecessary fixed dimensions.

Always inspect the actual viewport behaviour before considering a component complete.

---

## 5. RAG Chat Interface Design

The main product experience is the RAG chat application.

Pay particular attention to the following components.

### Chat Layout

- Maintain a clean and distraction-free interface.
- Ensure user and AI messages are visually distinguishable.
- Keep conversation spacing consistent.
- Handle long conversations gracefully.
- Ensure the chat container uses available space properly.
- Avoid layout shifts when new messages arrive.

### User Messages

- Maintain readable message widths.
- Handle long text correctly.
- Ensure appropriate spacing.
- Preserve a consistent visual style.

### AI Responses

- Support structured Markdown content.
- Format headings, paragraphs, lists and code blocks clearly.
- Ensure code blocks do not create horizontal overflow.
- Maintain good readability.
- Handle long responses gracefully.

### RAG Source References

- Display source references beneath AI responses.
- Show source names and relevant text snippets when available.
- Keep source details collapsed by default.
- Provide clear expand/collapse interactions.
- Make source references visually distinguishable from the answer.
- Do not invent missing source information.

### Chat Input

- Keep the input area easy to access.
- Support multiline input.
- Maintain a clear send button.
- Provide appropriate disabled and loading states.
- Ensure it works correctly on mobile.
- Avoid overlapping the message area.
- Handle mobile virtual keyboards appropriately.

### Streaming UI

When streaming is supported:

- Show a clear response-generation state.
- Render incoming text progressively.
- Avoid unnecessary layout shifts.
- Keep the interface responsive.
- Ensure the latest content is visible without forcibly interrupting users reading older messages.

---

## 6. Component Architecture and Code Quality

The existing frontend should be improved incrementally.

Before creating a new component:

1. Check whether an equivalent component already exists.
2. Check whether the existing component can be extended.
3. Reuse shared UI components when appropriate.
4. Avoid duplicating styles and functionality.

### Component Guidelines

- Keep components focused on one responsibility.
- Avoid excessively large components.
- Extract reusable UI where it provides real value.
- Use clear TypeScript interfaces and types.
- Keep business logic out of presentation components.
- Avoid unnecessary prop drilling.
- Use composition where appropriate.
- Avoid unnecessary abstractions.

### Code Improvements

Look for:

- Duplicate JSX.
- Duplicate CSS.
- Unnecessary conditional rendering.
- Unused state.
- Unnecessary useEffect.
- Unnecessary useMemo and useCallback.
- Unused imports.
- Poor component boundaries.
- Unclear variable names.
- Unnecessary client components.
- Accessibility problems.
- Unnecessary dependencies.

Do not refactor everything at once.

Prioritise improvements that produce measurable benefits in maintainability, responsiveness or performance.

---

## 7. Accessibility and Interaction

Ensure the interface is usable by different users and input methods.

Requirements:

- Use semantic HTML.
- Provide accessible labels for inputs.
- Maintain keyboard navigation.
- Provide visible focus states.
- Use sufficient colour contrast.
- Do not communicate status using colour alone.
- Ensure buttons have clear purposes.
- Support appropriate keyboard interactions.
- Respect reduced-motion preferences.
- Make interactive controls usable with touch and, where applicable, TV remotes.

---

## 8. Performance

Prioritise practical frontend performance improvements.

- Avoid unnecessary component re-renders.
- Avoid loading unnecessary libraries.
- Use Next.js image optimisation where appropriate.
- Lazy-load components when there is a meaningful benefit.
- Avoid excessive DOM nesting.
- Keep client-side JavaScript minimal.
- Avoid unnecessary state management.
- Keep large conversation interfaces efficient.

Do not introduce premature optimisations without a clear reason.

---

## 9. How to Approach UI Tasks

Follow this workflow for every significant frontend task.

### Step 1: Inspect

Understand:

- Existing page.
- Existing components.
- Existing styles.
- Current responsive behaviour.
- Existing design tokens.
- Existing interactions.

### Step 2: Identify Problems

Identify:

- Visual inconsistencies.
- Responsive issues.
- CSS duplication.
- Component complexity.
- Accessibility problems.
- Performance concerns.

### Step 3: Plan

Explain:

- What needs improvement.
- Which files need modification.
- Whether new components are necessary.
- How existing functionality will be preserved.

For significant changes, wait for my approval before implementation.

### Step 4: Implement

- Follow the existing design system.
- Reuse existing components.
- Use centralised CSS variables.
- Maintain TypeScript safety.
- Follow the project's architecture.
- Implement responsive behaviour.

### Step 5: Verify

Check:

- Mobile layout.
- Tablet layout.
- Laptop layout.
- Desktop layout.
- Large Android TV layout.
- Light theme.
- Dark theme.
- Keyboard interactions.
- Touch interactions.
- Existing application functionality.

Run relevant linting, TypeScript checks and tests.

### Step 6: Report

Explain:

1. What was changed.
2. Which files were modified.
3. What responsive improvements were made.
4. What code-quality improvements were made.
5. Whether verification passed.
6. Any remaining issues.

---

## 10. Important Restrictions

Never:

- Redesign the entire application without permission.
- Ignore the existing Claude Design output.
- Introduce unrelated UI libraries.
- Hardcode theme colours across components.
- Duplicate existing CSS.
- Use fixed dimensions that break responsiveness.
- Ignore Android TV layouts.
- Create unnecessary components.
- Rewrite working components without a reason.
- Remove existing functionality while improving UI.
- Make backend assumptions.
- Introduce unnecessary animations.
- Use hover-only interactions.
- Claim responsiveness without checking it.

---

## Final Objective

Build and maintain a visually consistent, accessible, responsive and maintainable RAG chat frontend.

The application should provide a polished experience across mobile phones, tablets, laptops, desktops and large Android TV displays.

Always prioritise:

1. Existing design consistency.
2. Responsive behaviour.
3. Clean component architecture.
4. Centralised styling.
5. Maintainable TypeScript code.
6. Accessibility.
7. Practical performance.

Improve the existing application progressively instead of rebuilding it unnecessarily.


