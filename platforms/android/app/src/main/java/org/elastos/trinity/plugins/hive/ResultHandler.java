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

package org.elastos.trinity.plugins.hive;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.utils.LogUtil;
import org.json.JSONException;
import org.json.JSONObject;

import org.elastos.hive.*;

class ResultHandler<T> implements Callback<T> {
    private final Type type;
    private final int handlerId;
    private final CallbackContext callbackContext;

    ResultHandler(int id, Type type, CallbackContext callbackContext) {
        this.handlerId = id;
        this.callbackContext = callbackContext;
        this.type = type;
    }

    private void sendEvent(JSONObject info) throws JSONException {
        if (callbackContext != null) {
            info.put("hid", handlerId);
            PluginResult res = new PluginResult(PluginResult.Status.OK, info);
            res.setKeepCallback(true);
            callbackContext.sendPluginResult(res);
        }
    }

    @Override
    public void onError(HiveException ex) {
        try {
            JSONObject ret = new JSONObject();
            ret.put("error", ex.getMessage());
            sendEvent(ret);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSuccess(T result) {
        JSONObject ret = null;

//        LogUtil.d("body = " + result.toString());

        try {
//            if (body instanceof Void) {
//                ret = voidToJson();
//            } else if (body instanceof Length){
//                ret = lengthToJson((Length) body);
//            } else if (body instanceof Data){
//                ret = dataToJson((Data) body);
//            } else if (body instanceof FileList){
//                ret = fileListToJson((FileList) body);
//            } else if (body instanceof ValueList){
//                ret = valueListToJson((ValueList) body);
//            } else if (body instanceof CID){
//                ret = cidToJson((CID) body);
//            }

            switch (type) {
                case Void:
                    ret = voidToJson();
                    break;
                case Length:
                    break;
                case String:
                    break;
                case FileList:
                    break;
                case ValueList:
                    break;
                default:
                    break;
            }
            if (ret == null) {
                ret = new JSONObject();
                ret.put("error", "ret is null");
            }
            sendEvent(ret);
        } catch (JSONException e) {
            e.getMessage();
        }
    }


//    private JSONObject cidToJson(CID cid) throws JSONException{
//        JSONObject json = new JSONObject();
//        json.put("cid",cid.getCid());
//
//        return json ;
//    }
//
//    private JSONObject valueListToJson(ValueList valueList) throws JSONException{
//        ArrayList<Data> list = valueList.getList();
//        JSONObject json = new JSONObject();
//        JSONArray array = new JSONArray();
//        for (Data data :list){
//            array.put(new String(data.getData()));
//        }
//        json.put("values",array);
//
//        return json ;
//    }
//
//    private JSONObject fileListToJson(FileList filelist) throws JSONException{
//        String[] files = filelist.getList() ;
//        JSONObject json = new JSONObject();
//        JSONArray array = new JSONArray();
//        for (String filePath : files){
//            array.put(filePath);
//        }
//        json.put("files",array);
//
//        return json ;
//    }
//
//    private JSONObject dataToJson(Data data) throws JSONException{
//        JSONObject json = new JSONObject();
//        json.put("data", new String(data.getData()));
//
//        return json;
//    }
//
    private JSONObject lengthToJson(long length) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("length", length);

        return json;
    }

    private JSONObject voidToJson() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("status", "Success!");
        return json;
    }

    enum Type {
        Void,
        Length,
        String,
        CID,
        FileList,
        ValueList
    }
}
