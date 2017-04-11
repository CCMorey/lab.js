export default class Transmit {
  constructor(options) {
    this.url = options.url
    this.metadata = options.metadata || {}
  }

  handle(context, event) {
    const url = this.url
    const metadata = this.metadata

    switch (event) {
      case 'prepare':
        // Set commit handler on data store
        context.options.datastore.on('commit', function() {
          this.transmit(
            url, { payload: 'staging', ...metadata }, 'staging',
          )
        })
        break
      case 'end':
        // Transmit the entire data set
        context.options.datastore.transmit(
          url, { payload: 'full', ...metadata },
        )
        break
    }
  }
}
