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

package org.elastos.trinity.runtime;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginEntry;
import org.elastos.trinity.plugins.appmanager.AppManagerPlugin;
import org.elastos.trinity.plugins.appservice.AppServicePlugin;


import java.util.ArrayList;

 public class AppViewFragment extends WebViewFragment {
    public static String TAG = "AppViewFragment";

     final String[] managerAccessList = {
             "org.elastos.trinity.dapp.installer",
            //  "org.elastos.trinity.remote.launcher",
     };

    View titlebar;

    public static WebViewFragment newInstance(String id) {
        if (id != null) {
            AppViewFragment fragment = new AppViewFragment();

            Bundle bundle = new Bundle();
            bundle.putString("id", id);
            fragment.setArguments(bundle);
            return fragment;
        }
        else {
            return null;
        }
    }

    @Override
    protected void finalize(){
        System.out.println("in finalize");
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        if(getArguments() == null){
            return null;
        }

        id = getArguments().getString("id");
        appInfo = AppManager.getShareInstance().getAppInfo(id);

        super.onCreateView(inflater, container, savedInstanceState);

        FrameLayout rootView = new FrameLayout(this.getContext());

        rootView.addView(appView.getView());
        addTitleBar(inflater, rootView);

        return rootView;
    }

    private void addTitleBar(LayoutInflater inflater, FrameLayout rootView) {
        titlebar = inflater.inflate(R.layout.title_bar, null);

        rootView.addView(titlebar);
        titlebar.setVisibility(View.GONE);

        Button btnClose =(Button) titlebar.findViewById(R.id.btnClose);
        btnClose.setOnClickListener(new Button.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    AppManager.getShareInstance().close(id);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private boolean isCheckAuthority(String name) {
        for (AppInfo.PluginAuth pluginAuth : appInfo.plugins) {
            if (pluginAuth.plugin.equals(name)) {
                return true;
            }
        }
        return false;
    }

    private boolean isManagerAccess(String id) {
        String appid = id.toLowerCase();
        for (String item : managerAccessList) {
            if (item.equals(appid)) {
                return true;
            }
        }
        return false;
    }

    @Override
    protected void loadConfig() {
        pluginEntries = new ArrayList<PluginEntry>(20);
        preferences = cfgPreferences;

        launchUrl = AppManager.getShareInstance().getStartPath(appInfo);

        String pluginClass;
        AppWhitelistPlugin whitelistPlugin = new AppWhitelistPlugin(appInfo);
        for(PluginEntry entry:cfgPluginEntries) {
            if (entry.service.equals("Whitelist")) {
                pluginEntries.add(new PluginEntry("Whitelist",
                        "org.elastos.plugins.appmanager.AppWhitelistPlugin", entry.onload, whitelistPlugin));
            }
            else if (entry.service.equals("AppManager") && isManagerAccess(appInfo.app_id)) {
                basePlugin = new AppManagerPlugin(appInfo.app_id);
                pluginEntries.add(new PluginEntry(entry.service, entry.pluginClass, true, basePlugin));
            }
            else if (entry.service.equals("AppService") && !isManagerAccess(appInfo.app_id)) {
                basePlugin = new AppServicePlugin(appInfo.app_id);
                pluginEntries.add(new PluginEntry(entry.service, entry.pluginClass, true, basePlugin));
            }
            else {
                pluginClass = entry.pluginClass;
                CordovaPlugin plugin = null;
                if (isCheckAuthority(entry.service)) {
                    pluginClass = "org.elastos.plugins.appmanager.AuthorityPlugin";
                    plugin = new AuthorityPlugin(entry.pluginClass, appInfo, entry.service, whitelistPlugin);
                }
                else {
                    pluginClass = "org.elastos.plugins.appmanager.NullPlugin";
                    plugin = new NullPlugin(entry.service);
                }
                pluginEntries.add(new PluginEntry(entry.service, pluginClass, entry.onload, plugin));
            }
        }
    }

    @Override
    public Object onMessage(String id, Object data) {
        super.onMessage(id, data);

        if ("exit".equals(id)) {
            try {
                AppManager.getShareInstance().loadLauncher();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

}
