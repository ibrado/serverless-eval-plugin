'use strict';

class ServerlessExpressionsPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.config = {};

    this.commands = {
      'deploy': {
        lifecycleEvents: ['functions']
      }
    };

    this.hooks = {
      'before:deploy:functions': this.evaluateExpressions.bind(this)
    }
  }

  _evaluate(prop, val) {
    let m;
    if (typeof val !== 'string' && !(val instanceof String)) return val;

    let v = val+'';
    let re = /\$([\`\|])(.*?)\1/g;
    let exp;

    do {
      while(exp = re.exec(v)) {
        v = v.replace(exp[0], eval(exp[2]));
      }
    } while(v.match(re));

    if(v !== val && this.config.verbose)
      this.serverless.cli.log('serverless-expressions-plugin set '+prop+' to "'+v+'"');
    
    return v;
  }

  _processProperties(key, x) {
    if(Array.isArray(x)) {
      for(let i in x) {
        this._processProperties(key+'['+i+']', x[i]);
      }
    } else if(typeof x === 'object') {
      for(let prop in x) {
        const val = x[prop];
        if(typeof val === 'object') {
          this._processProperties(prop, val);
        } else {
          x[prop] = this._evaluate(prop, val);
        }
      }
    } else {
      x = this._evaluate(key, x);
    }
  }

  evaluateExpressions() {
    return new Promise((resolve, reject) => {

      let svc = this.serverless.service;
      let custom = svc.custom || {};
      this.config = custom['serverless-expressions-plugin'] || {};

      for(const prop in svc) {
        if(prop === 'serverless') continue;
        this._processProperties(prop, svc[prop]);
      }

      resolve(true);
    })
  }
}

module.exports = ServerlessExpressionsPlugin;

