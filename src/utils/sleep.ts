/**
 * Sleep for a specified duration
 * @param ms - The duration to sleep in milliseconds
 * @returns A promise that resolves after the specified duration
 */
export async function sleep(ms: number): Promise<void> {
  // This function intentionally uses a new Promise with setTimeout to create a delay.
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
