import { expect, test } from '../fixtures/test'

test.describe('timestamp pagination cursors', () => {
  for (const resource of ['comment', 'message'] as const) {
    for (const { format, cursor } of [
      { format: 'timestamp-only', cursor: '2040-01-01T00:00:00.123Z' },
      { format: 'microsecond-precision', cursor: { createdAt: '2040-01-01T00:00:00.123456Z', id: 'cursor-id' } },
    ]) {
      test(`${resource} list rejects a ${format} cursor`, async ({ request }) => {
        const response = await request.post(`/rpc/${resource}/list`, {
          data: { json: { slug: 'pagination-contract', cursor } },
        })

        expect(response.status()).toBe(400)
        expect(await response.json()).toMatchObject({ json: { code: 'BAD_REQUEST' } })
      })
    }
  }
})
