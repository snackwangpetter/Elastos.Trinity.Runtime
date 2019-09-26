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

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Iterator;
import java.util.Random;
import java.util.TreeMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class AppInstaller {

    final String[] pluginWhitelist = {
            "device",
            "networkstatus",
            "splashscreen",
    };

    final String[] urlWhitelist = {
            "http://www.elastos.org/*",
    };

    private String appPath = null;
    private String dataPath = null;
    private String tempPath = null;
    private ManagerDBAdapter dbAdapter = null;
    private Context context = null;

    private Random random =new Random();

    public boolean init(Context context, ManagerDBAdapter dbAdapter,
                        String appPath, String dataPath, String tempPath) {
        this.context = context;
        this.appPath = appPath;
        this.dataPath = dataPath;
        this.tempPath = tempPath;
        this.dbAdapter = dbAdapter;

        random = new Random();

        return true;
    }

    private boolean unpackZip(InputStream srcZip, String destPath, boolean verifyDigest) throws Exception {
        ZipInputStream zis;
        MessageDigest md = null;
        TreeMap<String, String> digest_map = null;
        String filelist_sha = "";

        try
        {
            if (verifyDigest) {
                md = MessageDigest.getInstance("SHA-256");
                digest_map = new TreeMap<String, String>();
            }
            String filepath;
            zis = new ZipInputStream(new BufferedInputStream(srcZip));
            ZipEntry ze;
            byte[] buffer = new byte[1024];
            int count;

            while ((ze = zis.getNextEntry()) != null) {
                String entry_name = ze.getName();
                filepath = destPath + entry_name;

                if (ze.isDirectory()) {
                    File fmd = new File(filepath);
                    fmd.mkdirs();
                }
                else {
                    File file = new File(filepath);
                    file.getParentFile().mkdirs();

                    FileOutputStream fout = new FileOutputStream(file);

                    if (verifyDigest && !entry_name.startsWith("EPK-SIGN/")) {
                        md.reset();
                    }
                    while ((count = zis.read(buffer)) != -1) {
                        if (verifyDigest) {
                            if (!entry_name.startsWith("EPK-SIGN/")) {
                                md.update(buffer, 0, count);
                            } else if (entry_name.equals("EPK-SIGN/FILELIST.SHA")) {
                                filelist_sha = new String(buffer, 0, count);
                            }
                        }
                        fout.write(buffer, 0, count);
                    }
                    if (verifyDigest && !entry_name.startsWith("EPK-SIGN/")) {
                        byte[] digest = md.digest();
                        StringBuilder sb = new StringBuilder(2 * digest.length);
                        for (byte b : digest) {
                            sb.append("0123456789abcdef".charAt((b & 0xF0) >> 4));
                            sb.append("0123456789abcdef".charAt((b & 0x0F)));
                        }
                        String hex = sb.toString();
                        digest_map.put(entry_name, hex);
                    }

                    fout.close();
                }
                zis.closeEntry();
            }

            zis.close();

            if (verifyDigest) {
                StringBuilder filelist_inf = new StringBuilder();
                md.reset();
                for (String file : digest_map.keySet()) {
                    filelist_inf.append(digest_map.get(file) + " " + file + "\n");
                }
                md.update(filelist_inf.toString().getBytes("UTF-8"));

                byte[] digest = md.digest();
                StringBuilder sb = new StringBuilder(2 * digest.length);
                for (byte b : digest) {
                    sb.append("0123456789abcdef".charAt((b & 0xF0) >> 4));
                    sb.append("0123456789abcdef".charAt((b & 0x0F)));
                }
                String hex = sb.toString();
                if (!hex.equals(filelist_sha)) {
                    // Verify digest failed!
                    throw new Exception("Failed to verify EPK digest!");
                }
            }
        }
        catch(IOException e) {
            e.printStackTrace();
            return false;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    private boolean downloadDAppPackage(String url, String destFile) throws Exception {
        BufferedInputStream in = new BufferedInputStream(new URL(url).openStream());
        FileOutputStream fileOutputStream = new FileOutputStream(destFile);
        byte dataBuffer[] = new byte[1024];
        int bytesRead;
        while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
            fileOutputStream.write(dataBuffer, 0, bytesRead);
        }
        return true;
    }

    private void deleteDAppPackage(String packagePath) {
        if (packagePath != null && !packagePath.isEmpty()) {
            File file = new File(packagePath);
            file.delete();
        }
    }

    public void copyAssetsFolder(String src, String dest) throws Exception {
        AssetManager manager = context.getAssets();
        String fileNames[] = manager.list(src);

        if (fileNames.length > 0) {
            File file = new File(dest);
            if (file.exists()) {
                deleteAllFiles(file);
            }
            file.mkdirs();
            for (String fileName : fileNames) {
                copyAssetsFolder(src + "/" + fileName, dest + "/" + fileName);
            }
        }
        else {
            InputStream in = manager.open(src);
            OutputStream out = new FileOutputStream(dest);

            byte[] buffer = new byte[1024];

            int length;

            while ((length = in.read(buffer)) > 0) {
                out.write(buffer, 0, length);
            }
            in.close();
            out.close();
        }
    }

    private static String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        final int buffer_size = 1024;
        char[] cstr = new char[buffer_size];
        int read_count;
        while ((read_count = reader.read(cstr, 0, buffer_size)) != -1) {
            sb.append(cstr, 0, read_count);
        }
        reader.close();
        return sb.toString();
    }

    private static String getStringFromFile(String filePath) {
        try {
            File fl = new File(filePath);
            FileInputStream fin = null;
            fin = new FileInputStream(fl);
            String ret = convertStreamToString(fin);
            fin.close();
            return ret;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public AppInfo install(String url, boolean dev) throws Exception {
        InputStream inputStream = null;
        AppInfo info = null;
        String downloadPkgPath = null;

        if (url.startsWith("asset://")) {
            AssetManager manager = context.getAssets();
            String substr = url.substring(9);
            inputStream = manager.open(substr);
        }
        else if (url.startsWith("content://")) {
            Uri uri = Uri.parse(url);
            inputStream = context.getContentResolver().openInputStream(uri);
        }
        else if (url.startsWith("http://") || url.startsWith("https://")) {
            downloadPkgPath = appPath + "tmp_" + random.nextInt() + ".epk";
            if (downloadDAppPackage(url, downloadPkgPath)) {
                inputStream = new FileInputStream(downloadPkgPath);
            }
        }
        else {
            if (url.startsWith("file://")) {
                url = url.substring(7);
            }
            inputStream = new FileInputStream(url);
        }

        String temp = "tmp_" + random.nextInt();
        String path = appPath + temp + "/";

        File fmd = new File(path);
        fmd.mkdirs();

        if (!unpackZip(inputStream, path, true)) {
            deleteDAppPackage(downloadPkgPath);
            throw new Exception("Failed to unpack EPK!");
        }

        String public_key = getStringFromFile(path + "EPK-SIGN/SIGN.PUB");
        String payload = getStringFromFile(path + "EPK-SIGN/FILELIST.SHA");
        String signed_payload = getStringFromFile(path + "EPK-SIGN/FILELIST.SIGN");

        if (public_key == null || payload == null || signed_payload == null ||
                !NativeVerifier.verify(public_key, payload, signed_payload)) {
            deleteDAppPackage(downloadPkgPath);
            throw new Exception("Failed to verify EPK signature!");
        }

        Log.d("AppInstaller", "The EPK was signed by " + public_key);

        info = getInfoByManifest(path);
        File from = new File(appPath, temp);
        if (info == null || info.app_id == null || info.app_id.equals("launcher")) {
            deleteAllFiles(from);
            deleteDAppPackage(downloadPkgPath);
            throw new Exception("App info error!");
        }

        AppInfo oldInfo = AppManager.getShareInstance().getAppInfo(info.app_id);
        if (oldInfo != null) {
            if (dev) {
                AppManager.getShareInstance().unInstall(info.app_id);
            }
            else {
                deleteAllFiles(from);
                deleteDAppPackage(downloadPkgPath);
                throw new Exception("App '" + info.app_id + "' already existed!");
            }
        }

        File to = new File(appPath, info.app_id);
        if (to.exists()) {
            deleteAllFiles(to);
            to = new File(appPath, info.app_id);
        }
        from.renameTo(to);
        info.built_in = 0;
        dbAdapter.addAppInfo(info);
        deleteDAppPackage(downloadPkgPath);
        return info;
    }

    public boolean deleteAllFiles(File root) throws Exception {
        if (!root.exists()) {
            return false;
        }

        File files[] = root.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isFile() && f.exists()) {
                    f.delete();
                }
                else {
                    deleteAllFiles(f);
                }
            }
        }

        root.delete();

        return true;
    }

    public void unInstall(AppInfo info)  throws Exception {
        if (info == null) {
            throw new Exception("No such app!");
        }

        if (info.built_in == 1) {
            throw new Exception("App is a built in!");
        }
        int count = dbAdapter.removeAppInfo(info);
        if (count < 1) {
            throw new Exception("Databashe error!");
        }

        File root = new File(appPath + info.app_id);
        deleteAllFiles(root);
        root = new File(dataPath + info.app_id);
        deleteAllFiles(root);
    }

    private boolean isAllowPlugin(String name) {
        String pluginName = name.toLowerCase();
        for (String item : pluginWhitelist) {
            if (item.equals(pluginName)) {
                return true;
            }
        }
        return false;
    }

    private boolean isAllowUrl(String url) {
        url = url.toLowerCase();
        for (String item : urlWhitelist) {
            if (item.equals(url)) {
                return true;
            }
        }
        return false;
    }


    public AppInfo getInfoByManifest(String path) throws Exception {
        String manifest = path + "manifest.json";
        File file = new File(manifest);
        if (!file.exists()) {
            path = path + "assets/";
            manifest = path + "manifest.json";
            file = new File(manifest);
            if (!file.exists()) {
                throw new Exception("File 'manifest.json' no exist!");
            }
        }
        InputStream input = new FileInputStream(manifest);
        AppInfo info = parseManifest(input, 0);
        manifest = path + "manifest.i18n";
        file = new File(path + "manifest.i18n");
        if (file.exists()) {
            input = new FileInputStream(manifest);
            parseManifestLocale(input, info);
        }
        return info;
    }

    private String getMustStrValue(JSONObject json, String name) throws Exception {
        if (json.has(name)) {
            return json.getString(name);
        } else {
            throw new Exception("Parse Manifest.json error: '" + name + "' no exist!");
        }
    }

    private int getMustIntValue(JSONObject json, String name) throws Exception {
        if (json.has(name)) {
            return json.getInt(name);
        } else {
            throw new Exception("Parse Manifest.json error: '" + name + "' no exist!");
        }
    }

    private JSONObject getJsonFromFile(InputStream inputStream) throws Exception {
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
        BufferedReader bufReader = new BufferedReader(inputStreamReader);
        String line;
        StringBuilder builder = new StringBuilder();
        while ((line = bufReader.readLine()) != null) {
            builder.append(line);
        }
        bufReader.close();
        inputStreamReader.close();
        JSONObject json = new JSONObject(builder.toString());
        return json;
    }

    public AppInfo parseManifest(InputStream inputStream, int launcher) throws Exception {
        AppInfo appInfo = new AppInfo();

        JSONObject json = getJsonFromFile(inputStream);

        //Must
        appInfo.app_id = getMustStrValue(json, "id");
        appInfo.version = getMustStrValue(json, AppInfo.VERSION);
        appInfo.version_code = getMustIntValue(json, AppInfo.VERSION_CODE);
        appInfo.name = getMustStrValue(json, AppInfo.NAME);
        appInfo.start_url = getMustStrValue(json, AppInfo.START_URL);
        if (appInfo.start_url.indexOf("://") != -1) {
            appInfo.remote = 1;
        }
        else {
            appInfo.remote = 0;
        }

        if (launcher == 0) {
            if (json.has("icons")) {
                JSONArray array = json.getJSONArray("icons");
                for (int i = 0; i < array.length(); i++) {
                    JSONObject icon = array.getJSONObject(i);
                    String src = icon.getString(AppInfo.SRC);
                    String sizes = icon.getString(AppInfo.SIZES);
                    String type = icon.getString(AppInfo.TYPE);
                    appInfo.addIcon(src, sizes, type);
                }
            } else {
                throw new Exception("Parse Manifest.json error: 'icons' no exist!");
            }
        }

        //Optional
        if (json.has(AppInfo.SHORT_NAME)) {
            appInfo.short_name = json.getString(AppInfo.SHORT_NAME);
        }

        if (json.has(AppInfo.DESCRIPTION)) {
            appInfo.description = json.getString(AppInfo.DESCRIPTION);
        }

        if (json.has(AppInfo.DEFAULT_LOCAL)) {
            appInfo.default_locale = json.getString(AppInfo.DEFAULT_LOCAL);
        }
        else {
            appInfo.default_locale = "en";
        }

        if (json.has(AppInfo.TYPE)) {
            appInfo.type = json.getString(AppInfo.TYPE);
        }
        else {
            appInfo.type = "app";
        }

        if (json.has("author")) {
            JSONObject author = json.getJSONObject("author");
            if (author.has("name")) {
                appInfo.author_name = author.getString("name");
            }
            if (author.has("email")) {
                appInfo.author_email = author.getString("email");
            }
        }

        if (json.has("plugins")) {
            JSONArray array = json.getJSONArray("plugins");
            for (int i = 0; i < array.length(); i++) {
                String plugin = array.getString(i);
                int authority = AppInfo.AUTHORITY_NOINIT;
                if (isAllowPlugin(plugin)) {
                    authority = AppInfo.AUTHORITY_ALLOW;
                }
                appInfo.addPlugin(plugin, authority);
            }
        }

        if (json.has("urls")) {
            JSONArray array = json.getJSONArray("urls");
            for (int i = 0; i < array.length(); i++) {
                String url = array.getString(i);
                int authority = AppInfo.AUTHORITY_NOINIT;
                if (isAllowUrl(url)) {
                    authority = AppInfo.AUTHORITY_ALLOW;
                }
                appInfo.addUrl(url, authority);
            }
        }

        if (json.has("framework")) {
            JSONArray array = json.getJSONArray("framework");
            for (int i = 0; i < array.length(); i++) {
                String framework = array.getString(i);
                String[] element = framework.split("@");

                if (element.length == 1) {
                    appInfo.addFramework(element[0], null);
                }
                else if (element.length > 1) {
                    appInfo.addFramework(element[0], element[1]);
                }
            }
        }

        if (json.has("platform")) {
            JSONArray array = json.getJSONArray("platform");
            for (int i = 0; i < array.length(); i++) {
                String platform = array.getString(i);
                String[] element = platform.split("@");
                if (element.length == 1) {
                    appInfo.addPlatform(element[0], null);
                }
                else if (element.length > 1) {
                    appInfo.addPlatform(element[0], element[1]);
                }
            }
        }

        if (json.has(AppInfo.BACKGROUND_COLOR)) {
            appInfo.background_color = json.getString(AppInfo.BACKGROUND_COLOR);
        }

        if (json.has("theme")) {
            JSONObject theme = json.getJSONObject("theme");
            if (theme.has(AppInfo.THEME_DISPLAY)) {
                appInfo.theme_display = theme.getString(AppInfo.THEME_DISPLAY);
            }
            if (theme.has(AppInfo.THEME_COLOR)) {
                appInfo.theme_color = theme.getString(AppInfo.THEME_COLOR);
            }
            if (theme.has(AppInfo.THEME_FONT_NAME)) {
                appInfo.theme_font_name = theme.getString(AppInfo.THEME_FONT_NAME);
            }
            if (theme.has(AppInfo.THEME_FONT_COLOR)) {
                appInfo.theme_font_color = theme.getString(AppInfo.THEME_FONT_COLOR);
            }
        }


        if (json.has("intent_filters")) {
            JSONArray array = json.getJSONArray("intent_filters");
            for (int i = 0; i < array.length(); i++) {
                JSONObject jobj = array.getJSONObject(i);
                if (jobj.has("action")) {
                    Intent intent = new Intent(appInfo.app_id, jobj.getString("action"));
                    dbAdapter.addIntent(intent);
                }
            }
        }

        appInfo.install_time = System.currentTimeMillis() / 1000;
        appInfo.launcher = launcher;

        File destDir = new File(dataPath + appInfo.app_id);
        if (!destDir.exists()) {
            destDir.mkdirs();
        }
        destDir = new File(tempPath + appInfo.app_id);
        if (!destDir.exists()) {
            destDir.mkdirs();
        }

        return appInfo;
    }

    public void parseManifestLocale(InputStream inputStream, AppInfo info) throws Exception {
        JSONObject jsonObject = getJsonFromFile(inputStream);

        Boolean exist = false;
        Iterator iterator = jsonObject.keys();
        while(iterator.hasNext()){
            String language = (String) iterator.next();
            JSONObject locale = jsonObject.getJSONObject(language);

            String name = getMustStrValue(locale, AppInfo.NAME);
            String short_name = getMustStrValue(locale, AppInfo.SHORT_NAME);
            String description = getMustStrValue(locale, AppInfo.DESCRIPTION);
            String author_name = getMustStrValue(locale, AppInfo.AUTHOR_NAME);

            info.addLocale(language, name, short_name, description, author_name);

            if (language.equals(info.default_locale)) {
                exist = true;
            }
        }

        if (!exist) {
            info.addLocale(info.default_locale, info.name, info.short_name, info.description, info.author_name);
        }
    }
}
