let runName,
    runParams,
    running = false,
    parametrized = [],
    excludeSkippedContexts = true,
    defaultDescribe = 'Parametrized run, {{name}}:'


const config = {
  wrapInDescribe: (value) => { defaultDescribe = value },
  excludeSkippedContexts: (value = true) => { excludeSkippedContexts = !!value }
}


export default parametrizedDescribe
export {
  parametrizedDescribe as describe,
  parametrizedDescribe as context,
  run, config
}


import { it, before, after, beforeEach, afterEach } from 'arrow-mocha/es5'


function run(runs)
{
  Object.keys(runs).forEach(name =>
  {
    let opts = runs[ name ]
    if (opts == undefined) {
      return
    }
    let desc = opts.describe == undefined
      ? defaultDescribe
      : opts.describe
    if (!desc) {
      return runWithOpts(name, opts)
    }
    describe(withRunValues(desc, name, toArray(opts.params)), () => runWithOpts(name, opts))
  })
  parametrized = []
}


function runWithOpts(name, opts)
{
  let lastArg = { runName: name, it, before, after, beforeEach, afterEach },
      args = toArray(opts.params).concat(lastArg),
      filterDesc = toFilter(opts.filter),
      filter = (parametrized) => filterDesc(parametrized.desc)
  running = true
  runName = name
  runParams = opts.params
  parametrized.filter(filter).forEach(runWithArg(args))
  running = false
}


function parametrizedDescribe(desc, fn)
{
  if (running) {
    return describe(desc, fn)
  }
  parametrized.push({ desc, fn: (params) => {
    describe(withRunValues(desc), withParams(params, fn))
  }})
}


parametrizedDescribe.only = (desc, fn) =>
{
  if (running) {
    return describe.only(desc, fn)
  }
  parametrized.push({ desc, fn: (params) => {
    describe.only(withRunValues(desc), withParams(params, fn))
  }})
}


parametrizedDescribe.skip = (desc, fn) =>
{
  if (running) {
    return describe.skip(desc, fn)
  }
  parametrized.push({ desc, fn: (params) => {
    describe.skip(withRunValues(desc), fn)
  }})
}


parametrizedDescribe.onlyWhen = (runs, desc, fn) => when({  on: splitByComma(runs) }, desc, fn)
parametrizedDescribe.skipWhen = (runs, desc, fn) => when({ off: splitByComma(runs) }, desc, fn)

parametrizedDescribe.when = parametrizedDescribe.onlyWhen
parametrizedDescribe.whenNot = parametrizedDescribe.skipWhen


function when(runs, desc, fn)
{
  if (desc == undefined) {
    return (desc, fn) => when(runs, desc, fn)
  }
  if (running) {
    return describeWhen(desc, fn, runs)
  }
  parametrized.push({ desc, fn: (params) => {
    describeWhen(withRunValues(desc), withParams(params, fn), runs)
  }})
}


function describeWhen(desc, fn, { on, off })
{
  return ((on && on.indexOf(runName) >= 0) || (off && off.indexOf(runName) == -1)
    ? describe(desc, fn)
    : excludeSkippedContexts || describe.skip('[s] ' + desc, fn)
  )
}


const runWithArg = (arg) => (parametrized) => parametrized.fn(arg)
const withParams = (params, fn) => () => fn.apply(undefined, params)

const withRunValues = (s, name, params) => (String(s)
  .replace(/\{\{name\}\}/g, name || runName)
  .replace(/\{\{(\d+)\}\}/g, (_, n) => stringify((params || runParams)[+n]))
)

const stringify = (obj) => {
  try {
    return JSON.stringify(obj)
  }
  catch (err) {
    return String(obj)
  }
}

const splitByComma = (s) => (s instanceof Array) ? s : String(s).split(/,\s+/)
const toArray = (obj) => (obj instanceof Array) ? obj : [obj]

const toFilter = (obj) => ('string' === typeof obj
  ? (s) => ('' + s).substr(0, obj.length) == obj
  : obj instanceof RegExp
  ? (s) => obj.test('' + s)
  : obj || all
)

const all = () => true
