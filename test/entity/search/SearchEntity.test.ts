

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { TavilySDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('SearchEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TAVILY_TEST_LIVE=TRUE.
  afterEach(liveDelay('TAVILY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TavilySDK.test()
    const ent = testsdk.Search()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = TavilySDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Search().create({"include_answer":"x","query":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TAVILY_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'search.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"answer":{"a":true,"h":"Answer","n":"answer","r":false,"t":"`$STRING`","key$":"answer","index$":0},"include_answer":{"a":true,"h":"Include Answer","n":"include_answer","r":false,"t":"`$BOOLEAN`","key$":"include_answer","index$":1},"max_results":{"a":true,"h":"Max Results","n":"max_results","r":false,"t":"`$INTEGER`","key$":"max_results","index$":2},"query":{"a":true,"h":"Query","n":"query","op":{"create":{"req":true,"type":"`$STRING`"}},"r":false,"sh":"The search query.","t":"`$STRING`","key$":"query","index$":3},"response_time":{"a":true,"h":"Response Time","n":"response_time","r":false,"t":"`$NUMBER`","key$":"response_time","index$":4},"results":{"a":true,"h":"Results","n":"results","r":false,"t":"`$ARRAY`","key$":"results","index$":5},"search_depth":{"a":true,"h":"Search Depth","n":"search_depth","r":false,"t":"`$STRING`","key$":"search_depth","index$":6}},"name":"search","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["include_answer","max_results","query","search_depth"],"co":{"id":"POST /search","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/search","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"search"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"search","name__orig":"search","Name":"Search","name_":"search","name-":"search","NAME":"SEARCH","index$":0}, {"active":true,"entity":"search","key$":"BasicSearchFlow","kind":"basic","name":"BasicSearchFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"search_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'Search', {"POST /search":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["query"],"properties":{"query":{"type":"string","description":"The search query.","key$":"query"},"max_results":{"type":"integer","minimum":1,"maximum":20,"default":5,"key$":"max_results"},"search_depth":{"type":"string","enum":["basic","advanced"],"default":"basic","key$":"search_depth"},"include_answer":{"type":"boolean","default":false,"key$":"include_answer"}},"index$":1}}}},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const search_ref01_ent = client.Search()
    let search_ref01_data = setup.data.new.search['search_ref01']

    search_ref01_data = (await search_ref01_ent.create(search_ref01_data)).data()
    assert(null != search_ref01_data)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/search/SearchTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = TavilySDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['search01','search02','search03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TAVILY_TEST_SEARCH_ENTID': idmap,
    'TAVILY_TEST_LIVE': 'FALSE',
    'TAVILY_TEST_EXPLAIN': 'FALSE',
    'TAVILY_APIKEY': '',
  })

  idmap = env['TAVILY_TEST_SEARCH_ENTID']

  const live = 'TRUE' === env.TAVILY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TAVILY_TEST_SEARCH_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new TavilySDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.TAVILY_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.TAVILY_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
