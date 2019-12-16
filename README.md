# Serverless Eval Plugin

This Serverless plugin evaluates and replaces expressions within `serverless.yml`.

## Install

```
npm install --save-dev serverless-eval-plugin
```

## Usage

Add `serverless-eval-plugin` to your `serverless.yml` plugin section:

```yaml
plugins:
  - serverless-eval-plugin
```

### Configuration

The only configurable option is for verbose output:

```yaml
custom:
  serverless-eval-plugin:
    verbose: true     # (default: false) Print the resulting values during deploy
```

`serverless-eval-plugin` supports basic `eval()` support for expressions bounded by `` $`..` `` or `$|..|`.

> NOTE: Nesting `eval()`s using the same expression delimiters is currently not supported. Also, you may need to `eval()` inside a string.

```yaml
custom:
  serverless-eval-plugin:
    verbose: true

  test: "$`'5 minutes from now is $|(new Date((new Date()).getTime() + 300000))|'`"

provider:
  profile: "$`'{self:provider.stage}' === 'prod' ? 'production-minimal' : 'testing-minimal'`"

  environment:
    DEPLOY_TIME: $|(new Date()).getTime()|

```

which results in:

```
  Serverless: serverless-eval-plugin set test to "5 minutes from now is Wed Sep 04 2019 18:29:46 GMT+0800 (PST)"
  Serverless: serverless-eval-plugin set profile to "testing-minimal"
  Serverless: serverless-eval-plugin set DEPLOY_TIME to "1567592686825"
```

## See also

Generate deployed version info for your Lambdas with [serverless-version-info](https://www.npmjs.com/package/serverless-version-info).

## Contribute

Please see the [Github repository](https://github.com/ibrado/serverless-eval-plugin.git).




