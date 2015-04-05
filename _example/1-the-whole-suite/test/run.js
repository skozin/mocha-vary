/*
 * In your tests, use require('mocha-vary') instead of this.
 */
var vary = require('../../..')
    grequire = require('grequire'),
    bluebird = require('bluebird'),
    es6Promise = require('es6-promise').Promise,
    lib = require('../')

/**
 * Important detail: this module needs to be executed after modules with tests that
 * you want to parametrize.
 *
 * In this setup, this is achieved by manually requirung them from this module.
 * See only-selected-files-var-2 example for an alternative way.
 */
grequire(module, './*.js')


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
