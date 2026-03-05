type DeepObject = {
  [key: string]: string | DeepObject
}

export async function loadMessages(locale: string) {
  const { default: messages } = (await import(`./messages/${locale}.json`)) as {
    default: DeepObject
  }

  return messages
}
