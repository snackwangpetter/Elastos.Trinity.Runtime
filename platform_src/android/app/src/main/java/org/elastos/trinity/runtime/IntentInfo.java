package org.elastos.trinity.runtime;

import org.apache.cordova.CallbackContext;

public class IntentInfo {
    String action;
    String params;
    String fromId;
    String toId;
    long intentId;
    CallbackContext callbackContext;

    IntentInfo(String action, String params, String fromId, String toId,
               long intentId, CallbackContext callbackContext) {
        this.action = action;
        this.params = params;
        this.fromId = fromId;
        this.toId = toId;
        this.intentId = intentId;
        this.callbackContext = callbackContext;
    }
}
