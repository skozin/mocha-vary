import { assert } from 'chai'

/**
 * This line is important, otherwise the magic will not work!
 * In your tests, it will look slightly different:
 *
 *   import describe from 'mocha-vary'
 */
import describe from '../es6'


describe('this will not be included in the second run, see run.js', (array, obj, { runName }) =>
{
  it('is not the second run', () => {
    assert.notEqual(runName, 'second-run')
    assert.notDeepEqual(array, [ 'run 2' ])
    assert.notDeepEqual(obj, { run: 2 })
  })
})
