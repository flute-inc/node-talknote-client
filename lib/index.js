// Native fetch in Node.js v18+
const extend = require('deep-extend');
const querystring = require('querystring');
const winston = require('winston');

const VERSION = require('../package.json').version;

const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class TalknoteClient {

  constructor(accessToken, options = {}) {
    this.version = VERSION;
    this.accessToken = accessToken;
    this.options = extend({
      apiUrl: 'https://eapi.talknote.com/api/v1',
      logger: undefined,
      logLevel: LogLevel.INFO,
    }, options);

    // Request Header
    this.headers = extend({
      'User-Agent': `node-talknote-client/${VERSION}`,
      'X-TALKNOTE-OAUTH-TOKEN': this.accessToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    }, options.headers);

    // Logging
    if (options.logger) {
      this.logger = options.logger;
    } else {
      this.logger = winston.createLogger({
        level: this.options.logLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple()
        ),
        transports: new winston.transports.Console()
      });
    }

    this.logger.info('TalknoteClient initialized successfully');
  }

  async _handleResponse(response) {
    try {
      const resJson = await response.json();
      this.logger.debug('Response received', { data: resJson });
      return resJson;
    } catch (err) {
      this.logger.error('Error parsing response', { error: err.message });
      throw err;
    }
  }

  _handleError(error) {
    this.logger.error('Request failed', { error: error.message });
    return { error };
  }

  async _request(path, req) {
    this.logger.debug('Making request', { path, method: req.method });
    const url = `${this.options.apiUrl}${path}`;
    try {
      const response = await fetch(url, req);
      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  async get(path, params = {}) {
    const req = {
      method: 'GET',
      headers: this.headers
    };
    const query = querystring.stringify(params);
    return this._request(query ? `${path}?${query}` : path, req);
  }

  async post(path, params = {}) {
    const req = {
      method: 'POST',
      headers: this.headers,
      body: querystring.stringify(params),
    };
    return this._request(path, req);
  }

  // API endpoints

  async dm() {
    return this.get(`/dm`);
  }

  async dm_list(id) {
    // Notes: ドキュメントでは POST になっているが、GET が正しいっぽい
    return this.get(`/dm/list/${id}`);
  }

  async dm_unread(id) {
    return this.get(`/dm/unread/${id}`);
  }

  async dm_post(id, message) {
    return this.post(`/dm/post/${id}`, { message });
  }

  async group() {
    // Notes: ドキュメントでは POST `/group/${group_id}` になっているが、id は必要ないっぽい
    return this.post(`/group`);
  }

  async group_list(id) {
    // Notes: ドキュメントでは POST になっているが、GET が正しいっぽい
    return this.get(`/group/list/${id}`);
  }

  async group_unread(id) {
    // Notes: ドキュメントでは POST になっているが、GET が正しいっぽい
    return this.get(`/group/unread/${id}`);
  }

  async group_post(id, message) {
    return this.post(`/group/post/${id}`, { message });
  }

}

module.exports = TalknoteClient;
