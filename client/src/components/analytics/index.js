'use strict'

import ReactGA from 'react-ga'
import config from '../../config'

const ga = (...args) => ReactGA.ga(...args)
const pageview = path => ReactGA.pageview(path)
const modalview = modalName => ReactGA.modalview(modalName)
const event = args => ReactGA.event(args)
const timing = args => ReactGA.timing(args)
const outboundLink = (args, hitCallback) => ReactGA.outboundLink(args, hitCallback)
const exception = args => ReactGA.exception(args)
const plugin = ReactGA.plugin

ReactGA.initialize(config.googleAnalytics)

const listener = location => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
}

export default {
  listener,
  ga,
  pageview,
  modalview,
  event,
  timing,
  outboundLink,
  exception,
  plugin
}
