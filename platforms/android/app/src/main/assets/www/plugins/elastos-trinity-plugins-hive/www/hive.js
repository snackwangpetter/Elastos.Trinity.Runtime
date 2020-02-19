cordova.define("elastos-trinity-plugins-hive.HivePlugin", function(require, exports, module) {

"use strict";
/*
 * Copyright (c) 2019 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var exec = cordova.exec;
var IPFSImpl = /** @class */ (function () {
    function IPFSImpl() {
        this.objId = null;
        this.plugin = null;
        this.clazz = 4;
    }
    IPFSImpl.prototype.put = function (data) {
        return this.plugin.getPromise(this, 'putStringIPFS', [this.objId, data]);
    };
    IPFSImpl.prototype.get = function (cid) {
        return this.plugin.getPromise(this, 'getAsStringIPFS', [this.objId, cid]);
    };
    IPFSImpl.prototype.size = function (cid) {
        return this.plugin.getPromise(this, 'getSizeIPFS', [this.objId, cid]);
    };
    return IPFSImpl;
}());
var FilesImpl = /** @class */ (function () {
    function FilesImpl() {
        this.objId = null;
        this.plugin = null;
        this.clazz = 3;
    }
    FilesImpl.prototype.put = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'putStringForFiles', [this.objId, remoteFile, data]);
    };
    FilesImpl.prototype.getAsString = function (remoteFile) {
        return this.plugin.getPromise(this, 'getAsStringForFiles', [this.objId, remoteFile]);
    };
    FilesImpl.prototype.size = function (remoteFile) {
        return this.plugin.getPromise(this, 'sizeForFiles', [this.objId, remoteFile]);
    };
    FilesImpl.prototype.deleteFile = function (remoteFile) {
        return this.plugin.getPromise(this, 'deleteForFiles', [this.objId, remoteFile]);
    };
    FilesImpl.prototype.list = function () {
        return this.plugin.getPromise(this, 'listForFiles', [this.objId]);
    };
    return FilesImpl;
}());
var KeyValuesImpl = /** @class */ (function () {
    function KeyValuesImpl() {
        this.objId = null;
        this.plugin = null;
        this.clazz = 2;
    }
    KeyValuesImpl.prototype.putValue = function (key, value) {
        return this.plugin.getPromise(this, 'putValue', [this.objId, key, value]);
    };
    KeyValuesImpl.prototype.setValue = function (key, value) {
        return this.plugin.getPromise(this, 'setValue', [this.objId, key, value]);
    };
    KeyValuesImpl.prototype.getValues = function (key) {
        return this.plugin.getPromise(this, 'getValues', [this.objId, key]);
    };
    KeyValuesImpl.prototype.deleteKey = function (key) {
        return this.plugin.getPromise(this, 'deleteKey', [this.objId, key]);
    };
    return KeyValuesImpl;
}());
var ClientImpl = /** @class */ (function () {
    function ClientImpl() {
        this.objId = null;
        this.plugin = null;
        this.clazz = 1;
        this.ipfs = [];
        this.files = [];
        this.keyValues = [];
    }
    // login(handler: Function, onSuccess?: () => void, onError?: (err: string) => void) {
    //     var handlerId = this.plugin.addLoginRequestCb(handler);
    //     exec(onSuccess, onError, 'HivePlugin', 'login', [this.clazz, this.objId, handlerId]);
    // }
    // logout(onSuccess?: () => void, onError?: (err: string) => void) {
    //     exec(onSuccess, onError, 'HivePlugin', 'logout', [this.clazz, this.objId]);
    // }
    ClientImpl.prototype.isConnected = function (onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
            if (onSuccess)
                onSuccess(ret.isConnect);
        };
        alert(this.objId);
        exec(_onSuccess, onError, 'HivePlugin', 'isConnected', [this.objId]);
    };
    ClientImpl.prototype.getIPFS = function (onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
            var ipfs = new IPFSImpl();
            ipfs.objId = ret.ipfsId;
            ipfs.plugin = me.plugin;
            me.ipfs[ipfs.objId] = ipfs;
            if (onSuccess)
                onSuccess(ipfs);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'getIPFS', [this.objId]);
    };
    ClientImpl.prototype.getFiles = function (onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
            var files = new FilesImpl();
            files.objId = ret.filesId;
            files.plugin = me.plugin;
            me.files[files.objId] = files;
            if (onSuccess)
                onSuccess(files);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'getFiles', [this.objId]);
    };
    ClientImpl.prototype.getKeyValues = function (onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
            var keyValues = new KeyValuesImpl();
            keyValues.objId = ret.keyValuesId;
            keyValues.plugin = me.plugin;
            me.keyValues[keyValues.objId] = keyValues;
            if (onSuccess)
                onSuccess(keyValues);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'getKeyValues', [this.objId]);
    };
    return ClientImpl;
}());
var LISTENER_LOGIN = 1;
var LISTENER_RESULT = 2;
var IPFSClientCreationOptions = /** @class */ (function () {
    function IPFSClientCreationOptions() {
    }
    return IPFSClientCreationOptions;
}());
var OneDriveClientCreationOptions = /** @class */ (function () {
    function OneDriveClientCreationOptions(clientId, redirectUrl) {
        this.driveType = 2 /* ONEDRIVE */;
        this.clientId = clientId;
        this.redirectUrl = redirectUrl;
    }
    return OneDriveClientCreationOptions;
}());
var HiveManagerImpl = /** @class */ (function () {
    function HiveManagerImpl() {
        var _this = this;
        this.clients = [];
        this.resultIndex = 0;
        this.resultEvent = [];
        this.loginCount = 0;
        this.loginRequest = [];
        this.addResultEventCb = function (callback, object) {
            var eventcb = {
                callback: callback,
                object: object
            };
            this.resultIndex++;
            this.resultEvent[this.resultIndex] = eventcb;
            return this.resultIndex;
        };
        Object.freeze(HiveManagerImpl.prototype);
        Object.freeze(ClientImpl.prototype);
        Object.freeze(IPFSImpl.prototype);
        Object.freeze(FilesImpl.prototype);
        Object.freeze(KeyValuesImpl.prototype);
        this.setListener(LISTENER_LOGIN, function (event) {
            var id = event.id;
            if (id == 0) {
                _this.loginEvent.callback(event.url);
            }
        });
        this.setListener(LISTENER_RESULT, function (event) {
            var id = event.hid;
            event.hid = null;
            if (_this.resultEvent[id].callback) {
                _this.resultEvent[id].callback(event);
            }
        });
        exec(function () { }, null, 'HivePlugin', 'initVal', []);
    }
    HiveManagerImpl.prototype.addLoginRequestCb = function (callback) {
        var eventcb = {
            callback: callback,
            object: null
        };
        this.loginEvent = eventcb;
        return 0;
    };
    HiveManagerImpl.prototype.getPromise = function (object, method, args) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var onResult = function (ret) {
                if (null == ret.error)
                    resolve(ret);
                else
                    reject(ret.error);
            };
            me.addResultEventCb(onResult, object),
                exec(null, null, 'HivePlugin', method, args);
        });
    };
    HiveManagerImpl.prototype.getVersion = function (onSuccess, onError) {
        exec(onSuccess, onError, 'HivePlugin', 'getVersion', []);
    };
    HiveManagerImpl.prototype.setListener = function (type, eventCallback) {
        exec(eventCallback, null, 'HivePlugin', 'setListener', [type]);
    };
    HiveManagerImpl.prototype.createClient = function (handler, options, onSuccess, onError) {
        var client = new ClientImpl();
        var me = this;
        var _onSuccess = function (ret) {
            client.objId = ret.clientId;
            client.plugin = me;
            me.clients[client.objId] = client;
            if (onSuccess)
                onSuccess(client);
        };
        if (typeof (options) == "undefined" || options == null ||
            typeof (options.driveType) != "string") {
            if (onError) {
                onError("invalid options");
            }
            return;
        }
        var configStr = JSON.stringify(options);
        var handlerId = this.addLoginRequestCb(handler);
        exec(_onSuccess, onError, 'HivePlugin', 'createClient', [configStr, handlerId]);
    };
    return HiveManagerImpl;
}());
module.exports = new HiveManagerImpl();


});
