import grequire from 'grequire'
import * as vary from '../es6'


// set default describe message
vary.config.wrapInDescribe('Parametrized run "{{name}}":')


// load all sibling .js files
grequire(module, './*.js')


vary.run({
  'first-run': {
    params: [
      [ 'run 1' ],
      { run: 1 }
    ]
  },
  'second-run': {
    params: [
      [ 'run 2' ],
      { run: 2 }
    ],
    filter: /^(?!this will not be included in the second run)/
  },
  'third-run': {
    params: [
      [],
      { something: 'different' }
    ],
    describe: 'Custom describe message for the third run:'
  }
})
