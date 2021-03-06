 /*
  * Copyright (c) 2018 Elastos Foundation
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

 import Foundation

 @objc(AppBasePlugin)
 class AppBasePlugin : TrinityPlugin {
    var callbackId: String?
    var appId: String?

    var isLauncher = false;
    var isChangeIconPath = false;

    func setId(_ id: String) {
        self.appId = id;
    }

    func success(_ command: CDVInvokedUrlCommand, _ retAsString: String) {
        let result = CDVPluginResult(status: CDVCommandStatus_OK,
                                     messageAs: retAsString);

        self.commandDelegate.send(result, callbackId: command.callbackId)
    }

    func success(_ command: CDVInvokedUrlCommand, retAsDict: [String : Any]) {
        let result = CDVPluginResult(status: CDVCommandStatus_OK,
                                     messageAs: retAsDict);

        self.commandDelegate.send(result, callbackId: command.callbackId)
    }

    func success(_ command: CDVInvokedUrlCommand, retAsArray: [String]) {
        let result = CDVPluginResult(status: CDVCommandStatus_OK,
                                     messageAs: retAsArray);

        self.commandDelegate.send(result, callbackId: command.callbackId)
    }

    func error(_ command: CDVInvokedUrlCommand, _ retAsString: String) {
        let result = CDVPluginResult(status: CDVCommandStatus_ERROR,
                                     messageAs: retAsString);

        self.commandDelegate.send(result, callbackId: command.callbackId)
    }

    func getCurrentLanguage() -> String {
        let preferredLang = NSLocale.preferredLanguages.first!

        switch preferredLang {
        case "en-US", "en-CN":
            return "en"
        case "zh-Hans-US","zh-Hans-CN","zh-Hant-CN","zh-TW","zh-HK","zh-Hans":
            return "zh"
        default:
            return "en"
        }
    }

    @objc func getLocale(_ command: CDVInvokedUrlCommand) {
        let info = AppManager.getShareInstance().getAppInfo(self.appId!);
        let ret = [
            "defaultLang": info!.default_locale,
            "currentLang": AppManager.getShareInstance().getCurrentLocale(),
            "systemLang": getCurrentLanguage()
            ] as [String : String]
        self.success(command, retAsDict: ret);
    }

    @objc(launcher:)
    func launcher(_ command: CDVInvokedUrlCommand) {
        do {
            try AppManager.getShareInstance().loadLauncher();
            self.success(command, "ok");
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    @objc(start:)
    func start(_ command: CDVInvokedUrlCommand) {
        let id = command.arguments[0] as? String ?? ""

        if (id == "") {
            self.error(command, "Invalid id.")
        }
        else if (id == "launcher") {
            self.error(command, "Can't start launcher! Please use launcher().")
        }
        else {
            do {
                try AppManager.getShareInstance().start(id);
                self.success(command, "ok");
            } catch AppError.error(let err) {
                self.error(command, err);
            } catch let error {
                self.error(command, error.localizedDescription);
            }
        }
    }

    @objc(close:)
    func close(_ command: CDVInvokedUrlCommand) {
        do {
            try AppManager.getShareInstance().close(self.appId!);
            self.success(command, "ok");
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    @objc(closeApp:)
    func closeApp(_ command: CDVInvokedUrlCommand) {
        let appId = command.arguments[0] as? String ?? "";

        if (appId == "") {
            self.error(command, "Invalid id.")
            return
        }

        do {
            try AppManager.getShareInstance().close(appId);
            self.success(command, "ok");
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    func jsonAppPlugins(_ plugins: [PluginAuth]) -> [Dictionary<String, Any>] {
        var ret = [Dictionary<String, Any>]()

        for pluginAuth in plugins {
            ret.append(["plugin": pluginAuth.plugin,
                        "authority": pluginAuth.authority])
        }

        return ret;
    }

    func jsonAppUrls(_ urls: [UrlAuth]) -> [Dictionary<String, Any>] {
        var ret = [Dictionary<String, Any>]()

        for urlAuth in urls {
            ret.append(["url": urlAuth.url,
                        "authority": urlAuth.authority])
        }

        return ret;
    }

    @objc func getIconPath(_ url: String)  -> String? {
        guard isChangeIconPath else {
            return nil;
        }

        let str = (url as NSString).substring(from: 7);
        var index = str.index(of: "/");
        guard index != nil else {
            return nil;
        }
        let app_id = String(str[..<index!]);
        index = str.index(index!, offsetBy: 1);
        guard index != nil else {
            return nil;
        }
        let i = Int(str[index!...]);
        guard i != nil else {
            return nil;
        }

        let info = AppManager.getShareInstance().getAppInfo(app_id);
        guard info != nil else {
            return nil;
        }

        let icon = info!.icons[i!];
        let appUrl = AppManager.getShareInstance().getIconPath(info!);
        return resetPath(appUrl, icon.src);
    }

    func jsonAppIcons(_ info: AppInfo) -> [Dictionary<String, String>] {
        var ret = [Dictionary<String, String>]()
        for i in 0..<info.icons.count {
            let icon = info.icons[i];
            var src = icon.src;
            if (isChangeIconPath) {
                src = "icon://" + info.app_id + "/" + String(i);
            }
            ret.append(["src": src,
                        "sizes": icon.sizes,
                        "type": icon.type])
        }

        return ret;
    }

    func jsonAppLocales(_ info: AppInfo) -> Dictionary<String, Any> {
        var ret = Dictionary<String, Any>()
        for locale in info.locales {
            let language = ["name": locale.name,
                             "shortName": locale.short_name,
                             "description": locale.desc,
                             "authorName": locale.author_name] as [String : String];
            ret[locale.language] = language;
        }

        return ret;
    }

    func jsonAppFrameworks(_ info: AppInfo) -> [Dictionary<String, String>] {
        var ret = [Dictionary<String, String>]()
        for framework in info.frameworks {
            ret.append(["name": framework.name,
                        "version": framework.version])
        }

        return ret;
    }

    func jsonAppPlatforms(_ info: AppInfo) -> [Dictionary<String, String>] {
        var ret = [Dictionary<String, String>]()
        for platform in info.platforms {
            ret.append(["name": platform.name,
                        "version": platform.version])
        }

        return ret;
    }

    func jsonAppInfo(_ info: AppInfo) -> [String : Any] {
        let appUrl = AppManager.getShareInstance().getAppUrl(info);
        let dataUrl = AppManager.getShareInstance().getDataUrl(info.app_id);
        return [
            "id": info.app_id,
            "version": info.version,
            "name": info.name,
            "shortName": info.short_name,
            "description": info.desc,
            "startUrl": resetPath(appUrl, info.start_url),
            "icons": jsonAppIcons(info),
            "authorName": info.author_name,
            "authorEmail": info.author_email,
            "defaultLocale": info.default_locale,
            "plugins": jsonAppPlugins(info.plugins),
            "urls": jsonAppUrls(info.urls),
            "backgroundColor": info.background_color,
            "themeDisplay": info.theme_display,
            "themeColor": info.theme_color,
            "themeFontName": info.theme_font_name,
            "themeFontColor": info.theme_font_color,
            "installTime": info.install_time,
            "builtIn": info.built_in,
            "appPath": appUrl,
            "dataPath": dataUrl,
            "locales": jsonAppLocales(info),
            "frameworks": jsonAppFrameworks(info),
            "platforms": jsonAppPlatforms(info),
            ] as [String : Any]
    }

    @objc func getInfo(_ command: CDVInvokedUrlCommand) {
        let info = AppManager.getShareInstance().getAppInfo(self.appId!);

        if (info != nil) {
           self.success(command, retAsDict: jsonAppInfo(info!));
        }
        else {
            self.error(command, "No such app!");
        }
    }

    @objc func getAppInfo(_ command: CDVInvokedUrlCommand) {
        let appId = command.arguments[0] as? String ?? ""

        let info = AppManager.getShareInstance().getAppInfo(appId);

        if (info != nil) {
            isChangeIconPath = true;
            self.success(command, retAsDict: jsonAppInfo(info!));
        }
        else {
            self.error(command, "No such app!");
        }
    }

    @objc(sendMessage:)
    func sendMessage(_ command: CDVInvokedUrlCommand) {
        let toId = command.arguments[0] as? String ?? "";
        let type = command.arguments[1] as? Int ?? -1;
        let msg = command.arguments[2] as? String ?? "";

        if (toId == "") {
            self.error(command, "Invalid id.")
            return
        }

        do {
            try AppManager.getShareInstance().sendMessage(toId, type, msg, self.appId!);
            self.success(command, "ok");
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    @objc(setListener:)
    func setListener(_ command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId;
        // Don't return any result now
        let result = CDVPluginResult(status: CDVCommandStatus_NO_RESULT);
        result?.setKeepCallbackAs(true);
        self.commandDelegate.send(result, callbackId: command.callbackId)

        if (self.appId == "launcher") {
            AppManager.getShareInstance().setLauncherReady();
        }
    }

    func onReceive(_ msg: String, _ type: Int, _ from: String) {
        guard self.callbackId != nil else {
            return;
        }

        let ret = [
            "message": msg,
            "type": type,
            "from": from
            ] as [String : Any]
        let result = CDVPluginResult(status: CDVCommandStatus_OK,
                                     messageAs: ret);
        result?.setKeepCallbackAs(true);
        self.commandDelegate?.send(result, callbackId:self.callbackId);
    }


    @objc func setCurrentLocale(_ command: CDVInvokedUrlCommand) {
        let code = command.arguments[0] as? String ?? ""
        AppManager.getShareInstance().setCurrentLocale(code);
        self.success(command, "ok");
    }

    @objc func install(_ command: CDVInvokedUrlCommand) {
        let url = command.arguments[0] as? String ?? ""
        do {
            let info = try AppManager.getShareInstance().install(url);

            if (info != nil) {
                self.success(command, retAsDict: jsonAppInfo(info!));
            }
            else {
                self.error(command, "error");
            }
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    @objc func unInstall(_ command: CDVInvokedUrlCommand) {
        let id = command.arguments[0] as? String ?? ""

        do {
            try AppManager.getShareInstance().unInstall(id);
            self.success(command, id);
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    @objc func getAppInfos(_ command: CDVInvokedUrlCommand) {
        let appInfos = AppManager.getShareInstance().getAppInfos();
        var infos = [String: Any]()
        isChangeIconPath = true;

        for (key, info) in appInfos {
            infos[key] = jsonAppInfo(info);
        }

        let list = AppManager.getShareInstance().getAppIdList();
        let ret = ["infos": infos,
                   "list": filterList(list),
            ] as [String : Any];

        self.success(command, retAsDict: ret);
    }

    @objc func setPluginAuthority(_ command: CDVInvokedUrlCommand) {
        let id = command.arguments[0] as? String ?? ""
        let plugin = command.arguments[1] as? String ?? ""
        let authority = command.arguments[1] as? Int ?? 0

        if (id == "") {
            self.error(command, "Invalid id.")
            return
        }

        do {
            try AppManager.getShareInstance().setPluginAuthority(id, plugin, authority);
            self.success(command, "ok");
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    @objc func setUrlAuthority(_ command: CDVInvokedUrlCommand) {
        let id = command.arguments[0] as? String ?? ""
        let url = command.arguments[1] as? String ?? ""
        let authority = command.arguments[1] as? Int ?? 0

        if (id == "") {
            self.error(command, "Invalid id.")
            return
        }

        do {
            try AppManager.getShareInstance().setUrlAuthority(id, url, authority);
            self.success(command, "ok");
        } catch AppError.error(let err) {
            self.error(command, err);
        } catch let error {
            self.error(command, error.localizedDescription);
        }
    }

    func filterList(_ list: [String]) -> [String] {
        var ret = [String]();
        for id in list {
            if (id != "launcher") {
                ret.append(id);
            }
        }
        return ret;
    }

    @objc(getRunningList:)
    func getRunningList(_ command: CDVInvokedUrlCommand) {
        let list = AppManager.getShareInstance().getRunningList();
        self.success(command, retAsArray: filterList(list));
    }

    @objc(getAppList:)
    func getAppList(_ command: CDVInvokedUrlCommand) {
        let list = AppManager.getShareInstance().getAppIdList();
        self.success(command, retAsArray: filterList(list));
    }

    @objc(getLastList:)
    func getLastList(_ command: CDVInvokedUrlCommand) {
        let list = AppManager.getShareInstance().getLastList();
        self.success(command, retAsArray: filterList(list));
    }

    func alertDialog(_ command: CDVInvokedUrlCommand, _ icon: Int,
                     _ cancel: Bool  = false) {

        let title = command.arguments[0] as? String ?? ""
        let msg = command.arguments[1] as? String ?? ""

        func doOKHandler(alerAction:UIAlertAction) {
            if (cancel) {
                self.success(command, "ok");
            }
        }

        func doCancelHandler(alerAction:UIAlertAction) {

        }

        let alertController = UIAlertController(title: title,
                                        message: msg,
                                        preferredStyle: UIAlertController.Style.alert)
        if (cancel) {
            let cancelAlertAction = UIAlertAction(title: "Cancel", style:
                UIAlertAction.Style.cancel, handler: doCancelHandler)
            alertController.addAction(cancelAlertAction)
        }
        let sureAlertAction = UIAlertAction(title: "OK", style: UIAlertAction.Style.default, handler: doOKHandler)
        alertController.addAction(sureAlertAction)

        AppManager.getShareInstance().mainViewController.present(alertController, animated: true, completion: nil)
    }

    @objc func alertPrompt(_ command: CDVInvokedUrlCommand) {
        alertDialog(command, 0);
    }

    @objc func infoPrompt(_ command: CDVInvokedUrlCommand) {
        alertDialog(command, 1);
    }

    @objc func askPrompt(_ command: CDVInvokedUrlCommand) {
        alertDialog(command, 0, true);
    }

 }
