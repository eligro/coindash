'use strict'

import ReactGA from 'react-ga'
import config from '../../config'

const listener = location => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
}

ReactGA.initialize(config.googleAnalytics)

export default {
  listener
}
