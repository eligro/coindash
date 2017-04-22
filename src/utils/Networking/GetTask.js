import { NetworkTask } from './NetworkTask'

export class GetTask extends NetworkTask {
  constructor (url) {
    super(url, 'get')
  }
}
