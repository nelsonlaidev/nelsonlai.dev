# Storybook

Local Storybook for the public exports in `packages/ui`. It imports the actual
components, stylesheet, and font packages. It does not import `apps/web`, contact
application APIs, or include application feature examples.

From the repository root:

```sh
pnpm storybook
pnpm storybook:build
```

Development binds to `127.0.0.1:6006`. To use a different local port:

```sh
pnpm --filter @repo/storybook exec storybook dev --host 127.0.0.1 --port 6007 --no-open --disable-telemetry
```

The separate static output is `apps/storybook/storybook-static/` and is ignored by Git.
The normal application build and development commands do not start or build
Storybook. No hosting or deployment is configured.

## Browsing and authoring

Search by component name. Each family has a Docs page with import guidance and
named, working examples. The source panel shows the actual story source. The
viewport toolbar supports narrow-screen review; isolated stories are useful for
fixed-position sidebars and overlays. Documentation previews use separate frames
so portals, ids, keyboard shortcuts, and toast managers cannot collide between
examples.

Add a matching `stories/<component>.stories.tsx` when adding a public UI family.
Import from `@repo/ui/components/<component>`, use explicit readable JSX, and show
meaningful states. Keep function props named `props`, and put children on the
component receiving a self-closing `render` element. Storybook discovers files;
there is no separate component registry or duplicated exhaustive prop table.
Automatic prop inference is disabled. TypeScript checks the real props used in
each example.

Compound exports are exercised through compositions: content components include
their real portals/backdrops, ChartContainer uses ChartStyle, TreeView uses
TreeViewNode, and Toaster uses the exported toast anatomy. Helpers such as CVA
recipes, the segment-group provider/hook, and detached dialog handles have
examples where they affect usage. Private tooltip styles and the mobile hook are
covered through their consuming components.

## Coverage

All 36 public visual families are represented:

| Category                 | Families                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Actions and forms        | Button, Field, Input, InputGroup, Label, SegmentGroup, Select, Switch, Textarea             |
| Overlays and feedback    | AlertDialog, Command, Dialog, Drawer, DropdownMenu, InfoTip, Popover, Sheet, Toast, Tooltip |
| Structure and navigation | AspectRatio, Card, ScrollArea, Separator, Sidebar, Tabs, TreeView                           |
| Data and display         | Avatar, Badge, BlurImage, Chart, ExternalLink, Logo, Marquee, Skeleton, Spinner, Table      |

Foundations document the actual dark palette, typography including CJK samples,
radii, surfaces, keyboard/motion guidance, and UIProvider labels/nonce behavior.
Colors reference live CSS variables rather than copied token values. There is no
light/system theme in the current UI package.

The preview shows package styling. The website's additional control sizing,
focus outlines, and page styles are not part of this package and are not copied
here. Preview-wide reduced-motion rules stop transitions when the system requests
reduced motion; individual components retain their own styles.

Loading, failure, and empty examples reflect supported behavior. BlurImage clears
its loading treatment after failure but does not supply a replacement image.
Tables, trees, and charts receive explanatory empty-state content from their
caller. The marquee duplicates children, so its examples are noninteractive.
Sidebar retains its original local `sidebar_state` cookie behavior. Toast actions
and confirmations only update browser-local state.

## Build isolation and verification

The shared stylesheet scans `packages/ui/src`; the website registers its own
`src` sources. Only this app's preview stylesheet registers `stories` sources.
This prevents example-only utilities from appearing in the website CSS. Tooling
dependencies, fixtures, and generated output remain in this workspace application.

Useful existing checks from the repository root:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm storybook:build
pnpm knip
```

Review keyboard focus, arrow-key navigation, Escape/focus return, touch dragging,
mobile sidebar/sheets, long text, and reduced motion in the browser. A successful
build does not verify those behaviors. No new automated tests are included.

The preview provider's nonce is illustrative. It does not install or relax the
application's production CSP, and a Storybook preview does not establish
production SSR, hydration, or CSP compatibility.
