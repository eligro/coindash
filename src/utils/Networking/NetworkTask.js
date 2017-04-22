export class NetworkTask {
  constructor (url, method) {
    this.url = url
    this.method = method
    this.completed = false
  }

  validateResponse (response) {
    return true
  }

  getError (response) {
    return 'Something went wrong'
  }

  postFetchingResponseTransformation (response) {
    return response
  }
}
