import { assert } from 'chai'

/**
 * This line is important, otherwise the magic will not work!
 * In your tests, it will look slightly different:
 *
 *   import describe from 'mocha-vary'
 */
import describe from '../es6'


const expectedParamsByRun = {
  'first-run': {
    array: [ 'run 1' ],
    obj: { run: 1 }
  },
  'second-run': {
    array: [ 'run 2' ],
    obj: { run: 2 }
  },
  'third-run': {
    array: [],
    obj: { something: 'different' }
  }
}

const runNames = Object.keys(expectedParamsByRun)


////////////////////////////////////////////////////////////////////////////////////////////////////
describe('all top-level describes are parametrized:', (array, obj, mocha) =>
////////////////////////////////////////////////////////////////////////////////////////////////////
{
  let expectedParams = expectedParamsByRun[ mocha.runName ]

  describe('depending on the run, the parameters will be different:', () =>
  {
    it('the array', () => assert.deepEqual(array, expectedParams.array))
    it('and the obj too', () => assert.deepEqual(obj, expectedParams.obj))
  })


  //////////////////////////////////////////////////////////////////////////////////////////////////
  describe('after your parameters, a special argument is added for convenience:', () =>
  //////////////////////////////////////////////////////////////////////////////////////////////////
  {
    let { it, before, runName } = mocha

    it('it includes the current run name', () => {
      assert.include(runNames, runName)
    })

    describe('and also all patched-for-es6-arrow-support Mocha functions from arrow-mocha:', () => {
      before(t => {
        t.lastArg = mocha
      })
      it('it', t => assert.isFunction(t.lastArg.it))
      it('before', t => assert.isFunction(t.lastArg.before))
      it('after', t => assert.isFunction(t.lastArg.after))
      it('beforeEach', t => assert.isFunction(t.lastArg.beforeEach))
      it('afterEach', t => assert.isFunction(t.lastArg.afterEach))
    })
  })


  //////////////////////////////////////////////////////////////////////////////////////////////////
  describe('all nested describes are just the usual Mocha ones:', (...args) =>
  //////////////////////////////////////////////////////////////////////////////////////////////////
  {
    it('no arguments are passed to describe', () => {
      assert.lengthOf(args, 0)
    })

    describe.skip('describe.skip works', () => {
      it('this will be skipped (pending)', () => {})
    })

    // and describe.only too, but we won't show that as it will skip all other tests here
  })
})
