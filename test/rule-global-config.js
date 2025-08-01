import assert from 'node:assert';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import sinon from 'sinon';
import rule from '../lib/rules/global-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setting the message paths & files before fs is stubbed
const messageSyntaxPath = path.join(__dirname, '../lib/messages', 'global-config-syntax.twig');
const messageSyntaxFile = fs.readFileSync(messageSyntaxPath, 'utf8');
const messageMiscPath = path.join(__dirname, '../lib/messages', 'global-config-misc.twig');
const messageMiscFile = fs.readFileSync(messageMiscPath, 'utf8');

describe('global config rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no global config', async function () {
    this.sandbox.stub(fs, 'existsSync').returns(false);
    const error = await rule.verify();
    assert.ok(!error);
  });

  it('pass if the config content is valid JSON', async function () {
    this.sandbox.stub(fs, 'existsSync').returns(true);
    this.sandbox.stub(fs, 'readFileSync').returns('{ "foo": 1 }');
    const error = await rule.verify();
    assert.ok(!error);
  });

  it('fails if JSON is invalid', async function () {
    this.sandbox.stub(fs, 'existsSync').withArgs(rule.configPath).returns(true);

    const fsStub = this.sandbox.stub(fs, 'readFileSync');
    fsStub.withArgs(rule.configPath).returns('@#');
    fsStub.withArgs(messageSyntaxPath).returns(messageSyntaxFile);

    const error = await rule.verify();
    // Assert(error instanceof SyntaxError);
    assert.ok(/Unexpected token '?@/.test(error));
    // Assert.equal(error, rule.errors.syntax(new SyntaxError('Unexpected token @'), rule.configPath));
  });

  it('fails if file is unreadable', async function () {
    this.sandbox.stub(fs, 'existsSync').withArgs(rule.configPath).returns(true);

    const fsStub = this.sandbox.stub(fs, 'readFileSync');
    fsStub.withArgs(rule.configPath).throws(new Error('nope'));
    fsStub.withArgs(messageMiscPath).returns(messageMiscFile);

    const error = await rule.verify();
    assert.equal(error, rule.errors.misc(rule.configPath));
  });
});
