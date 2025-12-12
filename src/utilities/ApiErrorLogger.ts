export const ApiErrorLogger = (
  collection: string,
  message: unknown,
  type: 'get' | 'put' | 'post' | 'delete',
) => {
  const mapperMethodMessage = {
    get: 'getting',
    post: 'creating',
    put: 'updating',
    delete: 'deleting',
  }
  console.error(`===========================================================`)
  console.error(`Error ${mapperMethodMessage[type]} ${collection} due to:`)
  console.error(message)
  console.error(`===========================================================`)
}
