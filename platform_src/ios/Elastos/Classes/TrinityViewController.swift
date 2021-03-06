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

 @objc(TrinityViewController)
 class TrinityViewController : CDVViewController {
    var basePlugin: AppBasePlugin?;
    var id = "";
    var appInfo: AppInfo?;
    var whitelistFilter: WhitelistFilter?;

    convenience init() {
        self.init(nibName: nil, bundle: nil)
    }

    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setTrinityPluginInfo(_ plugin:CDVPlugin!) {
        let trinityPlugin = plugin as? TrinityPlugin
        let isApp = self is AppViewController

        if trinityPlugin != nil {
            let launcherPath = AppManager.getShareInstance().getAppPath(self.appInfo!);
            let dataPath = AppManager.getShareInstance().getDataPath(self.id);
            let tempPath = AppManager.getShareInstance().getTempPath(self.id);
            let configPath = AppManager.getShareInstance().getConfigPath();
            trinityPlugin!.setInfo(self.whitelistFilter, checkAuthority:isApp, appPath:launcherPath, dataPath:dataPath,
                configPath:configPath,tempPath:tempPath);
        }
    }

    override func register(_ plugin:CDVPlugin!, withClassName className:String!) {
        setTrinityPluginInfo(plugin);
        return super.register(plugin, withClassName: className);
    }

    override func register(_ plugin:CDVPlugin!, withPluginName pluginName:String!) {
        setTrinityPluginInfo(plugin);
        return super.register(plugin, withPluginName: pluginName);
    }

    func filterPlugin(_ pluginName: String, _ className: String) -> NullPlugin? {
        return nil;
    }

    override func getCommandInstance(_ name: String) -> Any {
        let pluginName = name.lowercased();
        let className = self.pluginsMap[pluginName] as! String;
        var obj = self.pluginObjects[className as Any];
        guard obj == nil else {
            return obj as Any;
        }

        obj = filterPlugin(pluginName, className)
        guard obj == nil else {
            return obj as Any;
        }

        obj = super.getCommandInstance(pluginName)
        let plugin = obj as? CDVPlugin
        if plugin != nil {
            plugin!.pluginName = pluginName;
        }

        return obj as Any;
    }
    
    override func viewDidLoad() {
        super.viewDidLoad();
        for (name , value) in self.pluginObjects as! [String: CDVPlugin] {
            if (name == "AppBasePlugin") {
                let plugin = value as! AppBasePlugin;
                plugin.setId(id);
                self.basePlugin = plugin;
                break;
            }
        }
    }
    
    @objc func getBasePlugin() -> AppBasePlugin {
        return self.basePlugin!;
    }

 }
