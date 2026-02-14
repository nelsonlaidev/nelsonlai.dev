export class TraceableError extends Error {
  public context: Record<string, unknown>

  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message)
    this.name = 'TraceableError'
    this.context = context
  }
}
