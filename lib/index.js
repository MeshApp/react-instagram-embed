"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var qs = require("query-string");
var InstagramEmbed = /** @class */ (function (_super) {
    __extends(InstagramEmbed, _super);
    function InstagramEmbed(props) {
        var _this = _super.call(this, props) || this;
        _this.request = null;
        // Public
        _this.cancel = function () {
            if (_this.request) {
                _this.request.cancel();
            }
        };
        _this.handleFetchSuccess = function (response) {
            if (_this.props.onSuccess) {
                _this.props.onSuccess(response);
            }
            _this.setState({ html: response.html }, function () {
                window.instgrm.Embeds.process();
                if (_this.props.onAfterRender) {
                    _this.props.onAfterRender();
                }
            });
        };
        _this.handleFetchFailure = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            clearTimeout(_this.timer);
            if (_this.props.onFailure) {
                _this.props.onFailure(args);
            }
        };
        _this.createRequestPromise = function (url) {
            var request = {};
            request.promise = new Promise(function (resolve, reject) {
                var promise = fetch(url)
                    .then(function (response) { return response.json(); })
                    .then(function (json) { return resolve(json); })
                    .catch(function (err) { return reject(err); });
                request.cancel = function () { return reject(new Error('Cancelled')); };
                return promise;
            });
            return request;
        };
        _this.state = { html: null };
        return _this;
    }
    InstagramEmbed.prototype.componentDidMount = function () {
        var _this = this;
        if (window.instgrm) {
            this.fetchEmbed(this.getQueryParams(this.props));
        }
        else {
            if (this.props.injectScript && !document.getElementById('react-instagram-embed-script')) {
                this.injectScript();
            }
            this.checkAPI().then(function () {
                _this.fetchEmbed(_this.getQueryParams(_this.props));
            });
        }
    };
    InstagramEmbed.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, url = _a.url, hideCaption = _a.hideCaption, maxWidth = _a.maxWidth, containerTagName = _a.containerTagName;
        if (prevProps.url !== url ||
            prevProps.hideCaption !== hideCaption ||
            prevProps.maxWidth !== maxWidth ||
            prevProps.containerTagName !== containerTagName) {
            this.request.cancel();
            this.fetchEmbed(this.getQueryParams(this.props));
        }
    };
    InstagramEmbed.prototype.componentWillUnmount = function () {
        this.cancel();
    };
    InstagramEmbed.prototype.render = function () {
        var Tag = this.props.containerTagName;
        return React.createElement(Tag, __assign({}, this.omitComponentProps(), { dangerouslySetInnerHTML: { __html: this.state.html || '' } }));
    };
    InstagramEmbed.prototype.fetchEmbed = function (queryParams) {
        this.request = this.createRequestPromise("https://graph.facebook.com/v8.0/instagram_oembed/?" + queryParams);
        if (this.props.onLoading) {
            this.props.onLoading();
        }
        this.request.promise.then(this.handleFetchSuccess).catch(this.handleFetchFailure);
    };
    InstagramEmbed.prototype.omitComponentProps = function () {
        var _a = this.props, url = _a.url, accessToken = _a.accessToken, hideCaption = _a.hideCaption, maxWidth = _a.maxWidth, containerTagName = _a.containerTagName, onLoading = _a.onLoading, onSuccess = _a.onSuccess, onAfterRender = _a.onAfterRender, onFailure = _a.onFailure, protocol = _a.protocol, injectScript = _a.injectScript, rest = __rest(_a, ["url", "accessToken", "hideCaption", "maxWidth", "containerTagName", "onLoading", "onSuccess", "onAfterRender", "onFailure", "protocol", "injectScript"]);
        return rest;
    };
    InstagramEmbed.prototype.injectScript = function () {
        var protocolToUse = window.location.protocol.indexOf('file') === 0 ? this.props.protocol : '';
        var s = document.createElement('script');
        s.async = s.defer = true;
        s.src = protocolToUse + "//platform.instagram.com/en_US/embeds.js";
        s.id = 'react-instagram-embed-script';
        var body = document.body;
        if (body) {
            body.appendChild(s);
        }
    };
    InstagramEmbed.prototype.checkAPI = function () {
        var _this = this;
        return new Promise(function (resolve) {
            (function checkAPI(self) {
                self.timer = window.setTimeout(function () {
                    if (window.instgrm) {
                        clearTimeout(self.timer);
                        resolve();
                    }
                    else {
                        checkAPI(self);
                    }
                }, 20);
            })(_this);
        });
    };
    InstagramEmbed.prototype.getQueryParams = function (_a) {
        var url = _a.url, accessToken = _a.accessToken, hideCaption = _a.hideCaption, maxWidth = _a.maxWidth;
        return qs.stringify({
            url: url,
            access_token: accessToken,
            hidecaption: hideCaption,
            maxwidth: typeof maxWidth === 'number' && maxWidth >= 320 ? maxWidth : undefined,
            omitscript: true
        });
    };
    InstagramEmbed.defaultProps = {
        hideCaption: false,
        containerTagName: 'div',
        protocol: 'https:',
        injectScript: true
    };
    return InstagramEmbed;
}(React.PureComponent));
exports.default = InstagramEmbed;
