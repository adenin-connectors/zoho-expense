'use strict';
const got = require('got');
const isPlainObj = require('is-plain-obj');
const HttpAgent = require('agentkeepalive');
const HttpsAgent = HttpAgent.HttpsAgent;

let _activity = null;

function api(path, opts) {
  if (typeof path !== 'string') {
    return Promise.reject(new TypeError(`Expected \`path\` to be a string, got ${typeof path}`));
  }

  opts = Object.assign({
    json: true,
    token: _activity.Context.connector.token,
    endpoint: 'https://expense.zoho.com/api/v1',
    agent: {
      http: new HttpAgent(),
      https: new HttpsAgent()
    }
  }, opts);


  opts.headers = Object.assign({
    accept: 'application/json',
    'user-agent': 'adenin Now Assistant Connector, https://www.adenin.com/now-assistant'
  }, opts.headers);

  if (opts.token) {
    opts.headers.Authorization = `Zoho-oauthtoken ${opts.token}`;
  }

  const url = /^http(s)\:\/\/?/.test(path) && opts.endpoint ? path : opts.endpoint + path;
  if (opts.stream) {
    return got.stream(url, opts);
  }

  return got(url, opts).catch(err => {
    if (err.statusCode == 401) {
      err.response.statusCode = err.statusCode = 461;
      err.message = err.message.replace('401', '461');
    }
    throw err;
  });
}
// convert response from /issues endpoint to 
api.convertReports = function (response) {
  let items = [];
  let reports = response.body.expense_reports;

  // iterate through each issue and extract id, title, etc. into a new array
  for (let i = 0; i < reports.length; i++) {
    let raw = reports[i];
    let item = { id: raw.report_id, title: raw.report_name, description: raw.description, link: `https://expense.zoho.com/app#/expensereports/${raw.report_id}`, raw: raw }
    items.push(item);
  }

  return { items: items };
}

const helpers = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
];

api.stream = (url, opts) => apigot(url, Object.assign({}, opts, {
  json: false,
  stream: true
}));

api.initialize = function (activity) {
  _activity = activity;
}
for (const x of helpers) {
  const method = x.toUpperCase();
  api[x] = (url, opts) => api(url, Object.assign({}, opts, { method }));
  api.stream[x] = (url, opts) => api.stream(url, Object.assign({}, opts, { method }));
}

module.exports = api;
