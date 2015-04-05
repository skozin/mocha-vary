import { assert } from 'chai'

/**
 * This line is important, otherwise the magic will not work!
 * In your tests, it will look slightly different:
 *
 *   import describe from 'mocha-vary'
 */
import describe from '../es6'


describe('describe.onlyWhen() and describe.skipWhen():', (array, obj, { it, runName }) =>
{
  //////////////////////////////////////////////////////////////////////////////////////////////////
  describe('describe.onlyWhen() applies all nested tests only to the selected runs:', () =>
  //////////////////////////////////////////////////////////////////////////////////////////////////
  {
    describe.onlyWhen('first-run', ".onlyWhen('first-run', desc, fn) block", () => {
      it('will apply only to run 1', () => assert.equal(runName, 'first-run'))
    })

    describe.onlyWhen('first-run, third-run', ".onlyWhen('first-run, third-run', desc, fn) block",
      () => {
        it('apply only to runs 1 and 3', () => assert.notEqual(runName, 'second-run'))
      }
    )
  })


  //////////////////////////////////////////////////////////////////////////////////////////////////
  describe('describe.skipWhen() excludes all nested tests from the selected runs:', () =>
  //////////////////////////////////////////////////////////////////////////////////////////////////
  {
    describe.skipWhen('first-run', ".skipWhen('first-run', desc, fn) block", () => {
      it('will be skipped in run 1', () => assert.notEqual(runName, 'first-run'))
    })

    describe.skipWhen('first-run, third-run', ".skipWhen('first-run, third-run', desc, fn) block",
      () => {
        it('will be skipped in runs 1 and 3', () => assert.equal(runName, 'second-run'))
      }
    )
  })


  //////////////////////////////////////////////////////////////////////////////////////////////////
  describe('both .onlyWhen() and .skipWhen() support currying:', () =>
  //////////////////////////////////////////////////////////////////////////////////////////////////
  {
    const firstRun = describe.onlyWhen('first-run')
    const notFirstRun = describe.skipWhen('first-run')

    firstRun(".onlyWhen('first-run')(desc, fn) block", () => {
      it('will allpy only to run 1', () => assert.equal(runName, 'first-run'))
    })

    notFirstRun("skipWhen('first-run')(desc, fn) block", () => {
      it('will be skipped in run 1', () => assert.notEqual(runName, 'first-run'))
    })
  })
})


////////////////////////////////////////////////////////////////////////////////////////////////////
describe.onlyWhen('first-run', 'top-level describes support .onlyWhen too:', (array, obj, { it }) =>
////////////////////////////////////////////////////////////////////////////////////////////////////
{
  it('this will apply only to run 1', () => {
    assert.deepEqual(array, [ 'run 1' ])
  })

  describe('and this too', () => {
    it('object', () => assert.deepEqual(obj, { run: 1 }))
  })
})


////////////////////////////////////////////////////////////////////////////////////////////////////
describe.skipWhen('first-run', 'and .skipWhen is supported as well:', (array, obj, { it }) =>
////////////////////////////////////////////////////////////////////////////////////////////////////
{
  it('this will not apply to run 1', () => {
    assert.notDeepEqual(array, [ 'run 1' ])
  })

  describe('and this too', () => {
    it('object', () => assert.notDeepEqual(obj, { run: 1 }))
  })
})


const thirdRun = describe.onlyWhen('third-run')

////////////////////////////////////////////////////////////////////////////////////////////////////
thirdRun('top-level describes can be curried just like nested ones:', (array, obj, { it }) =>
////////////////////////////////////////////////////////////////////////////////////////////////////
{
  it('this will apply only to run 3', () => {
    assert.deepEqual(obj, { something: 'different' })
  })

  describe.onlyWhen('first-run')('and this will never be executed', () => {
    assert.equal(42, 53, 'really?')
  })
})
