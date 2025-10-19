// Extracted from shadcn/ui - apps/v4/public/schema/registry-item.json
export type CssValue =
  | string
  | {
      [k: string]: CssValue
    }

export type RegistryItem = {
  /**
   * The name of the item. This is used to identify the item in the registry. It should be unique for your registry.
   */
  name: string
  /**
   * The type of the item. This is used to determine the type and target path of the item when resolved for a project.
   */
  type:
    | 'registry:lib'
    | 'registry:block'
    | 'registry:component'
    | 'registry:ui'
    | 'registry:hook'
    | 'registry:theme'
    | 'registry:page'
    | 'registry:file'
    | 'registry:style'
    | 'registry:item'
  /**
   * The description of the item. This is used to provide a brief overview of the item.
   */
  description?: string
  /**
   * The human-readable title for your registry item. Keep it short and descriptive.
   */
  title?: string
  /**
   * The author of the item. Recommended format: username <url>
   */
  author?: string
  /**
   * An array of NPM dependencies required by the registry item.
   */
  dependencies?: string[]
  /**
   * An array of NPM dev dependencies required by the registry item.
   */
  devDependencies?: string[]
  /**
   * An array of registry items that this item depends on. Use the name of the item to reference shadcn/ui components and urls to reference other registries.
   */
  registryDependencies?: string[]
  /**
   * The main payload of the registry item. This is an array of files that are part of the registry item. Each file is an object with a path, content, type, and target.
   */
  files?: Array<{
    /**
     * The path to the file relative to the registry root.
     */
    path?: string
    /**
     * The content of the file.
     */
    content?: string
    /**
     * The type of the file. This is used to determine the type of the file when resolved for a project.
     */
    type?:
      | 'registry:lib'
      | 'registry:block'
      | 'registry:component'
      | 'registry:ui'
      | 'registry:hook'
      | 'registry:theme'
      | 'registry:page'
      | 'registry:file'
      | 'registry:style'
      | 'registry:item'
    /**
     * The target path of the file. This is the path to the file in the project.
     */
    target?: string
    [k: string]: unknown
  }>
  /**
   * The tailwind configuration for the registry item. This is an object with a config property. Use cssVars for Tailwind v4 projects.
   */
  tailwind?: {
    config?: {
      content?: string[]
      theme?: Record<string, unknown>
      plugins?: string[]
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  /**
   * The css variables for the registry item. This will be merged with the project's css variables.
   */
  cssVars?: {
    /**
     * CSS variables for the @theme directive. For Tailwind v4 projects only. Use tailwind for older projects.
     */
    theme?: Record<string, string>
    /**
     * CSS variables for the light theme.
     */
    light?: Record<string, string>
    /**
     * CSS variables for the dark theme.
     */
    dark?: Record<string, string>
    [k: string]: unknown
  }
  /**
   * CSS definitions to be added to the project's CSS file. Supports at-rules, selectors, nested rules, utilities, layers, and more.
   */
  css?: Record<string, CssValue>
  /**
   * Environment variables required by the registry item. Key-value pairs that will be added to the project's .env file.
   */
  envVars?: Record<string, string>
  /**
   * Additional metadata for the registry item. This is an object with any key value pairs.
   */
  meta?: Record<string, unknown>
  /**
   * The documentation for the registry item. This is a markdown string.
   */
  docs?: string
  categories?: string[]
  /**
   * The name of the registry item to extend. This is used to extend the base shadcn/ui style. Set to none to start fresh. This is available for registry:style items only.
   */
  extends?: string
  [k: string]: unknown
}
