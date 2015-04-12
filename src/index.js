import http from 'superagent'
import Promise from 'bluebird'
import query from 'qs'

class FederatedNameNotFoundError extends Error {
  constructor() {
    super()
    this.message = 'federated name not found'
  }
}

class FederatedNameError extends Error {

  constructor(message) {
    super()
    this.message = message
  }
}

export default class RippleFederationClient {

  constructor(url) {
    this.url = url
  }

  get Errors() {
    return {
      NameNotFound: FederatedNameNotFoundError
    }
  }

  lookup(address, domain) {

    let params = query.stringify({
      type: 'federation',
      destination: address,
      domain: domain
    })
    console.log("URL", `${this.url}?${params}`)

    return new Promise((resolve, reject) => {
      http
        .get(`${this.url}?${params}`)
        .end((error, response) => {
          if (error) { return reject(new FederatedNameNotFoundError) }

          switch (response.body.result) {
          case 'success':
            resolve(response.body.federation_json)
            break;
          case 'error':
            reject(new FederatedNameError(response.body.error_message))
            break;
          default:
            reject(response.body)
            break;
          }
        })
    })
  }
}

