'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _http = require('superagent');

var _http2 = _interopRequireWildcard(_http);

var _Promise = require('bluebird');

var _Promise2 = _interopRequireWildcard(_Promise);

var _query = require('qs');

var _query2 = _interopRequireWildcard(_query);

var FederatedNameNotFoundError = (function (_Error) {
  function FederatedNameNotFoundError() {
    _classCallCheck(this, FederatedNameNotFoundError);

    _get(Object.getPrototypeOf(FederatedNameNotFoundError.prototype), 'constructor', this).call(this);
    this.message = 'federated name not found';
  }

  _inherits(FederatedNameNotFoundError, _Error);

  return FederatedNameNotFoundError;
})(Error);

var FederatedNameError = (function (_Error2) {
  function FederatedNameError(message) {
    _classCallCheck(this, FederatedNameError);

    _get(Object.getPrototypeOf(FederatedNameError.prototype), 'constructor', this).call(this);
    this.message = message;
  }

  _inherits(FederatedNameError, _Error2);

  return FederatedNameError;
})(Error);

var RippleFederationClient = (function () {
  function RippleFederationClient(url) {
    _classCallCheck(this, RippleFederationClient);

    this.url = url;
  }

  _createClass(RippleFederationClient, [{
    key: 'Errors',
    get: function () {
      return {
        NameNotFound: FederatedNameNotFoundError
      };
    }
  }, {
    key: 'lookup',
    value: function lookup(address, domain) {
      var _this = this;

      var params = _query2['default'].stringify({
        type: 'federation',
        destination: address,
        domain: domain
      });
      console.log('URL', '' + this.url + '?' + params);

      return new _Promise2['default'](function (resolve, reject) {
        _http2['default'].get('' + _this.url + '?' + params).end(function (error, response) {
          if (error) {
            return reject(new FederatedNameNotFoundError());
          }

          switch (response.body.result) {
            case 'success':
              resolve(response.body.federation_json);
              break;
            case 'error':
              reject(new FederatedNameError(response.body.error_message));
              break;
            default:
              reject(response.body);
              break;
          }
        });
      });
    }
  }]);

  return RippleFederationClient;
})();

exports['default'] = RippleFederationClient;
module.exports = exports['default'];