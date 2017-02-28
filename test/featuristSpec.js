const expect = require('chai').expect
const tester = require('cli-tester')
const cli = require.resolve('../bin/featurist')

describe('featurist cli', () => {
  it('errors when no argument is provided', async () => {
    const result = await tester(cli)
    expect(result.code).to.equal(1)
    expect(result.stderr).to.contain('Please use the `new` command')
  })
})
