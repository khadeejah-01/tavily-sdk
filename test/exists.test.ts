
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { TavilySDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = TavilySDK.test()
    equal(testsdk instanceof TavilySDK, true,
      'TavilySDK.test() must return a client synchronously')
  })

})
