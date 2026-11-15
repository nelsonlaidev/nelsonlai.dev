---
name: tanstack-form
description: Write, refactor, or review React forms using TanStack Form and shadcn/ui, with consistent field binding, validation, and accessible errorId wiring. Use when implementing forms in a project that uses this stack or checking forms against the shadcn guide.
---

# TanStack Form

Follow the [shadcn TanStack Form guide](https://ui.shadcn.com/docs/forms/tanstack-form), with the additional accessibility convention below: explicitly connect each control to its rendered error through a stable `errorId` and `aria-describedby`.

## Fit the project

Inspect existing forms, shared schemas, UI primitives, and mutation patterns before implementing. Reuse their imports and domain rules. Check the installed library versions and consult the official guide for controls not covered here; adapt to the project's Base UI or Radix primitives. Keep review-only requests read-only and migrations within the requested scope.

Use existing components directly. Introduce form helpers or wrappers only when they provide concrete shared behavior. Follow repository conventions for component props, formatting, and translations.

## Form and field structure

- Use `useForm` with complete `defaultValues`, and `form.Field` render callbacks for controlled fields. JSX children and the `children` prop are equivalent; match nearby code.
- Compose `FieldGroup`, `Field`, `FieldLabel`, and optional `FieldDescription` as appropriate to the layout. Connect labels with matching `htmlFor` and control `id` values.
- Bind text inputs and text areas with `name={field.name}`, `value={field.state.value}`, `onBlur={field.handleBlur}`, and `onChange` calling `field.handleChange(event.target.value)`.
- Bind Switch and Checkbox with `checked` and `onCheckedChange`; bind Select with `value` and `onValueChange`. Use the installed primitive's callback types. Put accessibility props on the actual focusable control or Select trigger.
- Subscribe to form state through `form.Subscribe` or the project's existing reactive pattern when rendering counters, dirty state, or submission state outside a field callback.

## Accessible errors: required convention

For fields with validation, calculate `isInvalid = field.state.meta.isTouched && !field.state.meta.isValid`. Apply `data-invalid={isInvalid}` to `Field` and `aria-invalid={isInvalid}` to the control. Render `FieldError` with the field's errors when invalid.

Generate stable IDs with React `useId` at component scope, outside render callbacks and loops. Use a unique `errorId` for each field, and pass it to both `FieldError.id` and the control's `aria-describedby` while that error is rendered. Keep input IDs unique across repeated form instances too; the field's data `name` remains independent of its DOM ID.

If help text exists, retain its description ID in `aria-describedby` when adding the error ID. Reference only mounted elements. For repeated fields, use a keyed field component that can call `useId`, or derive unique IDs from a form-instance prefix and stable item identity.

Example field fragment inside a component with `form` already configured:

```tsx
const inputId = useId()
const descriptionId = `${inputId}-description`
const errorId = `${inputId}-error`

// Inside the form's JSX:
<form.Field name='name'>
  {(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={inputId}>Display name</FieldLabel>
        <Input
          id={inputId}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          autoComplete='name'
          required
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${descriptionId} ${errorId}` : descriptionId}
        />
        <FieldDescription id={descriptionId}>Shown on your public profile.</FieldDescription>
        {isInvalid && <FieldError id={errorId} errors={field.state.meta.errors} />}
      </Field>
    )
  }}
</form.Field>
```

Without help text, use `aria-describedby={isInvalid ? errorId : undefined}`. Adapt example labels to the project's localization system. For controls without validation requirements, preserve labeling and help-text connections without inventing unreachable error states.

## Validation

Prefer passing an existing Zod schema directly to `validators.onSubmit`. Add `onBlur` or `onChange` only when the requested interaction calls for it; submit-only validation is valid. Preserve existing validation timing when refactoring.

Use custom validators when needed for localized messages or domain logic. Return errors associated with their actual field paths. A single-field form's manual error mapping must not be copied into a multi-field form without routing each issue correctly. Preserve error objects compatible with `FieldError`, and retain a fallback for unrecognized localized errors.

Use native constraints such as `required`, `type`, and length limits where they match domain semantics. Native validation can block submission before TanStack's submit handler runs; consider that when preserving an existing error experience. Keep schema validation for rules such as rejecting whitespace-only values, and keep server-side validation authoritative. A boolean preference accepting both values needs no artificial validation rule.

## Submission and reset

Prevent the browser's default submission and call `form.handleSubmit()`. Keep network mutations in the form's `onSubmit`, after validation. Use explicit `type='submit'` for submission and `type='button'` for other form buttons. For a button outside the form, connect it with `form={formId}`.

Choose a consistent pending-state owner. When using TanStack Form's `isSubmitting`, return or await the asynchronous operation. When following a React Query `mutate` pattern, use the mutation's `isPending` for loading state and duplicate-submit protection; awaiting `form.handleSubmit()` alone does not wait for that network operation. Handle failures, preserve entered values on failure, and reset or close only when the operation succeeds.

Use `form.reset()` to restore defaults and clear metadata, or `form.reset(savedValues)` when establishing a new saved baseline. Preserve user edits during background data refreshes. Keep server errors visible through the project's existing alert or toast pattern, with field errors next to their controls when available.

## Verify

Review every changed field for controlled bindings, label association, invalid styling, and error ID wiring. Check that description and error references resolve in both valid and invalid states, including multiple mounted form instances. Verify the intended validation timing, successful submission, failure recovery, duplicate-submit protection, and reset behavior. Run repository-required checks and report any interaction behavior not verified; add automated tests only when the task and repository instructions permit them.
