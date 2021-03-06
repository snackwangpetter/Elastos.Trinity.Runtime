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

import Foundation


class PluginPermission {
    var apiList = [String: Bool]();
    var defaultValue = true;

    init(_ defaultValue: Bool) {
        self.defaultValue = defaultValue;
    }

    func setDefaultValue(_ defaultValue: Bool) {
        self.defaultValue = defaultValue;
    }

    func getApiPermission(_ api: String) -> Bool {
        if (apiList.isEmpty) {
            return defaultValue;
        }

        let permission = apiList[api];
        if (permission == nil) {
            return defaultValue;
        }

        return permission!;
    }

    func setApiPermission(_ api: String, _ permission: Bool) {
        apiList[api] = permission;
    }
}

class PermissionGroup {

    var pluginList = [String: PluginPermission]();
    let name: String;

    init(_ name: String) {
        self.name = name;
    }

    func addPlugin(_ plugin: String, _ defaultValue: Bool) -> PluginPermission {
        var pluginPermission = pluginList[plugin];
        if (pluginPermission == nil) {
            pluginPermission = PluginPermission(defaultValue);
            pluginList[plugin] = pluginPermission;
        }
        return pluginPermission!;
    }

    func getApiPermission(_ plugin: String, _ api: String) -> Bool {
        let pluginPermission = pluginList[plugin];
        if (pluginPermission == nil) {
            return true;
        }

        return pluginPermission!.getApiPermission(api);
    }
}

class PermissionManager {
    var groupList = [String: PermissionGroup]();
    var appList = [String: String]();
    static var permissionManager: PermissionManager?;

    public init() {
        do {
            try parsePermissionGroup();
            try parseAppPermission();
        }
        catch let error {
            print("PermissionManager para config error: \(error)");
        }
        PermissionManager.permissionManager = self;
    }

    static func getShareInstance() -> PermissionManager {
        return PermissionManager.permissionManager!;
    }

    func parsePermissionGroup() throws {
        let path = getAbsolutePath("www/config/permission/group.json");
        let url = URL.init(fileURLWithPath: path)

        let data = try Data(contentsOf: url);
        let json = try JSONSerialization.jsonObject(with: data,
            options: []) as! [String: [String: [String]]];

        for (group, plugins) in json {
            var permissionGroup = PermissionGroup(group);
            groupList[group] = permissionGroup;
            for (var plugin, array) in plugins {
                var defaultValue = true;
                if (plugin.hasPrefix("+")) {
                    plugin = (plugin as NSString).substring(from: 1);
                    defaultValue = false;
                } else if (plugin.hasPrefix("-")) {
                    plugin = (plugin as NSString).substring(from: 1);
                }
                plugin = plugin.lowercased();

                var pluginPermission = permissionGroup.addPlugin(plugin, defaultValue);
                for i in 0..<array.count {
                    let api = array[i];
                    if (api == "*") {
                        pluginPermission.setDefaultValue(!defaultValue);
                        break;
                    }
                    pluginPermission.setApiPermission(api, !defaultValue);
                }
            }
        }
    }

    func parseAppPermission() throws {
        let path = getAbsolutePath("www/config/permission/app.json");
        let url = URL.init(fileURLWithPath: path)

        let data = try Data(contentsOf: url);
        let json = try JSONSerialization.jsonObject(with: data,
            options: []) as! [String: String];

        for (app, group) in json {
            appList[app] = group;
        }

    }

    func getPermissionGroup(_ app: String) -> PermissionGroup {
        var group = appList[app];
        if (group == nil) {
            group = "user";
        }

        var permissionGroup = groupList[group!];
        if (permissionGroup == nil) {
            permissionGroup = groupList["user"];
        }

        return permissionGroup!;
    }
}

