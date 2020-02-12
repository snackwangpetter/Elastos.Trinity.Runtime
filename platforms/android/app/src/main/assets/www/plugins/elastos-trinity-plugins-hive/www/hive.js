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
//var FileImpl = /** @class */ (function () {
//    function FileImpl() {
//        this.objId = null;
//        this.plugin = null;
//    }
//    FileImpl.prototype.putFile = function (destFileName,storePath,encrypt) {
//        return this.plugin.getPromise(this, 'putFile', [this.objId,destFileName,storePath,encrypt]);
//    };
//
//    FileImpl.prototype.putFileFromBuffer = function (destFileName,sourceString,encrypt) {
//        return this.plugin.getPromise(this, 'putFileFromBuffer', [this.objId,destFileName,sourceString,encrypt]);
//    };
//
//    FileImpl.prototype.getFileLength = function (destFileName) {
//        return this.plugin.getPromise(this, 'getFileLength', [this.objId,destFileName]);
//    };
//
//    FileImpl.prototype.getFileToBuffer = function (destFileName,encrypt) {
//        return this.plugin.getPromise(this, 'getFileToBuffer', [this.objId,destFileName,encrypt]);
//    };
//    FileImpl.prototype.getFile = function (destFileName,storePath,encrypt) {
//        return this.plugin.getPromise(this, 'getFile', [this.objId,destFileName,storePath,encrypt]);
//    };
//    FileImpl.prototype.deleteFile = function (destFileName) {
//        return this.plugin.getPromise(this, 'deleteFile', [this.objId,destFileName]);
//    };
//    FileImpl.prototype.listFile = function () {
//        return this.plugin.getPromise(this, 'listFile', [this.objId]);
//    };
//    FileImpl.prototype.putValue = function (key,valueStr,encrypt) {
//        return this.plugin.getPromise(this, 'putValue', [this.objId , key,valueStr,encrypt]);
//    };
//    FileImpl.prototype.setValue = function (key,valueStr,encrypt) {
//        return this.plugin.getPromise(this, 'setValue', [this.objId , key,valueStr,encrypt]);
//    };
//    FileImpl.prototype.getValue = function (key,encrypt) {
//        return this.plugin.getPromise(this, 'getValue', [this.objId , key,encrypt]);
//    };
//    FileImpl.prototype.deleteValueFromKey = function (key) {
//        return this.plugin.getPromise(this, 'deleteValueFromKey', [this.objId ,key]);
//    };
//
//    FileImpl.prototype.putIPFSFile = function (sourceFilePath,encrypt) {
//        return this.plugin.getPromise(this, 'putIPFSFile', [this.objId , sourceFilePath,encrypt]);
//    };
//
//    FileImpl.prototype.putIPFSFileFromBuffer = function (sourceString,encrypt) {
//        return this.plugin.getPromise(this, 'putIPFSFileFromBuffer', [this.objId , sourceString,encrypt]);
//    };
//
//    FileImpl.prototype.getIPFSFileLength = function (cid) {
//        return this.plugin.getPromise(this, 'getIPFSFileLength', [this.objId , cid]);
//    };
//    FileImpl.prototype.getIPFSFileToBuffer = function (cid,encrypt) {
//        return this.plugin.getPromise(this, 'getIPFSFileToBuffer', [this.objId , cid,encrypt]);
//    };
//    FileImpl.prototype.getIPFSFile = function (cid,storePath,encrypt) {
//        return this.plugin.getPromise(this, 'getIPFSFile', [this.objId , cid,storePath,encrypt]);
//    };
//    return FileImpl;
//}());

//var FilesImpl = /** @class */ (function () {
//    function FilesImpl() {
//        this.objId = null;
//        this.plugin = null;
//    }
//    FilesImpl.prototype.putFile = function (destFileName,storePath,encrypt) {
//        return this.plugin.getPromise(this, 'putFile', [this.objId,destFileName,storePath,encrypt]);
//    };
//
//    return FileImpl;
//}());

//var ConnectionImpl = /** @class */ (function () {
//    function ConnectionImpl() {
//        this.objId = null;
//        this.files = [] ;
//        this.plugin = null;
//    }
//    ConnectionImpl.prototype.createHiveFile = function (filePath , onSuccess, onError) {
//        var me = this;
//        var _onSuccess = function (ret) {
//            var file = new FileImpl();
//            file.objId = ret.fileId;
//            file.plugin = me.plugin;
//            me.files[file.objId] = file;
//            if (onSuccess)
//                onSuccess(file);
//        };
//        exec(_onSuccess, onError, 'HivePlugin', 'createHiveFile', [this.objId , filePath]);
//    };
//    return ConnectionImpl;
//}());




var ClientImpl = /** @class */ (function () {
    function ClientImpl() {
        this.objId = null;
        this.plugin = null;
    }
    ClientImpl.prototype.isConnect = function (filePath , onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
        alert(JSON.stringify(ret));

//            var file = new FileImpl();
//            file.objId = ret.fileId;
//            file.plugin = me.plugin;
//            me.files[file.objId] = file;
//            if (onSuccess)
//                onSuccess(file);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'isConnect', [this.objId , filePath]);
    };
    ClientImpl.prototype.disConnect = function (filePath , onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
//            var file = new FileImpl();
//            file.objId = ret.fileId;
//            file.plugin = me.plugin;
//            me.files[file.objId] = file;
//            if (onSuccess)
//                onSuccess(file);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'disConnect', [this.objId , filePath]);
    };

    ClientImpl.prototype.getIPFS = function (filePath , onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
//            var file = new FileImpl();
//            file.objId = ret.fileId;
//            file.plugin = me.plugin;
//            me.files[file.objId] = file;
//            if (onSuccess)
//                onSuccess(file);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'getIPFS', [this.objId , filePath]);
    };

    ClientImpl.prototype.getFiles = function (filePath , onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
//            var file = new FileImpl();
//            file.objId = ret.fileId;
//            file.plugin = me.plugin;
//            me.files[file.objId] = file;
//            if (onSuccess)
//                onSuccess(file);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'getFiles', [this.objId , filePath]);
    };

    ClientImpl.prototype.getKeyValues = function (filePath , onSuccess, onError) {
        var me = this;
        var _onSuccess = function (ret) {
//            var file = new FileImpl();
//            file.objId = ret.fileId;
//            file.plugin = me.plugin;
//            me.files[file.objId] = file;
//            if (onSuccess)
//                onSuccess(file);
        };
        exec(_onSuccess, onError, 'HivePlugin', 'getKeyValues', [this.objId, filePath]);
    };

    ClientImpl.prototype.putStringForFiles = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'putStringForFiles', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.getAsStringForFiles = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'getAsStringForFiles', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.sizeForFiles = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'sizeForFiles', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.deleteForFiles = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'deleteForFiles', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.listForFiles = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'listForFiles', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.putStringIPFS = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'putStringIPFS', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.getAsStringIPFS = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'getAsStringIPFS', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.getSizeIPFS = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'getSizeIPFS', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.putValue = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'putValue', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.setValue = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'setValue', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.getValues = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'getValues', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.deleteKey = function (remoteFile, data) {
        return this.plugin.getPromise(this, 'deleteKey', [this.objId, remoteFile, data]);
    };
    ClientImpl.prototype.put
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
//        this.connection = [];
        this.client = [];
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
//        Object.freeze(FileImpl.prototype);

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
        alert("callback");
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
            var _args = [
                object.clazz,
                object.objId,
                me.addResultEventCb(onResult, object),
            ];
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
        var me = this;
        var _onSuccess = function (ret) {
            var client = new ClientImpl();
            client.objId = ret.clientId;
            client.plugin = me ;
            me.client[client.objId] = client;

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

        alert("aaaa");
        exec(_onSuccess, onError, 'HivePlugin', 'createClient', [configStr, handlerId]);
    };
//   HiveManagerImpl.prototype.createConnection = function (handler, options, onSuccess, onError) {
//        var me = this;
//        var _onSuccess = function (ret) {
////            var connection = new ConnectionImpl();
////            connection.objId = ret.connectId;
////            connection.plugin = me ;
////            me.connection[connection.objId] = connection;
//            if (onSuccess)
//                onSuccess(connection);
//        };
//        if (typeof (options) == "undefined" || options == null ||
//            typeof (options.driveType) != "string") {
//            if (onError) {
//                onError("invalid options");
//            }
//            return;
//        }
//        var configStr = JSON.stringify(options);
//        var handlerId = this.addLoginRequestCb(handler);
//        exec(_onSuccess, onError, 'HivePlugin', 'createConnection', [configStr, handlerId]);
//    };
    return HiveManagerImpl;
}());
module.exports = new HiveManagerImpl();

});
