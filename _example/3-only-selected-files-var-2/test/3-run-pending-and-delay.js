/*
 * In your tests, use require('mocha-vary') instead of this.
 */
var vary = require('../../..')
    bluebird = require('bluebird'),
    es6Promise = require('es6-promise').Promise,
    lib = require('../')

/**
 * Important detail: this module needs to be executed after modules with tests that you
 * want to parametrize.
 *
 * In other setups, this is achieved by manually requirung them from the module with the
 * vary.run() call.
 *
 * In this setup, this is achieved by using the --sort Mocha argument and assigning this
 * file a name that will push it after the files with tests when sorting alphabetically.
 *
 * You may have multiple such "runner" modules for different groups of tests, e.g.:
 *
 *   1-a.js
 *   2-b.js
 *   3-run-a-b.js
 *   4-non-parametrized-test.js
 *   4-c.js
 *   4-d.js
 *   3-run-c-d.js
 *   5-another-non-parametrized-test.js
 *   ...
 */
vary.config.wrapInDescribe('Works with the "{{name}}" Promise implementation:')
vary.run(
{
  'bluebird': {
    params: [ lib.withPromiseImpl(bluebird), bluebird ]
  },
  'es6-promise': {
    params: [ lib.withPromiseImpl(es6Promise), es6Promise ]
  },
  'native': ('undefined' === typeof Promise) ? undefined : {
    describe: 'Works with native V8 Promises',
    params: [ lib.withPromiseImpl(Promise), Promise ]
  }
})
