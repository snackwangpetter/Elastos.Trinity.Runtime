//
// Copyright (c) 2019 Elastos Foundation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

function set_msg(side, avatar, content) {
    var data = new Date();
    var msg = '<li class="' + side + '">' +
        '<a class="user" href="#">' +
        '<img class="img-responsive avatar_" src="./img/' + avatar + '.png" alt=""></a>' +
        '<div class="reply-content-box">' +
        '<span class="reply-time">' + data.toLocaleTimeString() + '</span>' +
        '<div class="reply-content pr"><span class="arrow">&nbsp;</span>' +
        content + '</div></div></li>';
    $("#msg_content").append(msg);
    $("html, body").animate({ scrollTop: $(document).height()}, "slow");
}

function display_me_msg(content) {
    set_msg("me", "avatar", content);
}

function display_others_msg(content) {
    set_msg("other", "avatar_rob", content);
}

var client_commands = [
    { name: "onedrive", fn: create_onedrive_client  },
    { name: "ipfs",     fn: create_ipfs_client      }
]

function do_client_command(input) {
     var args = input.trim().match(/[^\s"]+|"([^"]*)"/g);
     if (!args || args[0] == "") {
         return;
     }

     args[0] = args[0].toLowerCase()

     for (var i = 0; i < client_commands.length; i++) {
         if (client_commands[i].name == args[0]) {
             client_commands[i].fn();
             return;
         }
     }
     display_others_msg("Unknown client name:" + args[0]);
 }

function create_onedrive_client() {
    $('input').unbind('keypress');

    var success = function (ret) {
        do_onedrive_command("help");
        client = ret ;
        display_others_msg("created onedrive client successfully");

        $("input").focus();
        $("input").bind('keypress', function (event) {
            if (event.keyCode == "13") {
                var content = $('input').val()
                if (content.trim() != "") {
                    display_me_msg($('input').val());
                    do_onedrive_command($('input').val());
                    $('input').val('');
                }
            }
        });
    }

    hiveManager.createClient(
        function (url) {
            cordova.InAppBrowser.open(url, "_system", "location=yes");
        }, onedrive_opts,success, null);
}

function create_ipfs_client() {
    $('input').unbind('keypress')

    var success = function (ret) {
        do_ipfs_command("help");
        client = ret ;
        display_others_msg("created ipfs client successfully");

        $("input").focus();
        $("input").bind('keypress', function (event) {
            if (event.keyCode == "13") {
                var content = $('input').val()
                if (content.trim() != "") {
                    display_me_msg($('input').val());
                    do_ipfs_command($('input').val());
                    $('input').val('');
                }
            }
        });
    }

    hiveManager.createClient(null,ipfs_opts, success, null);
}

var ipfs_commands = [
    { cmd: "help",      fn: help_ipfs,                   help: "help [cmd]"  },
    { cmd: "version",   fn: get_version,            help: "version"     },

    { cmd: "getipfs",            fn: get_ipfs,           help: "getipfs"},

    { cmd: "put",           fn: put_string_ipfs,           help: "put [data]"},
    { cmd: "get",           fn: get_string_ipfs,           help: "get [cid]"},
    { cmd: "size",           fn: get_size_ipfs,           help: "size [cid]"},
]


var onedrive_commands = [
    { cmd: "help",      fn: help_onedrive,                   help: "help [cmd]"  },
    { cmd: "version",   fn: get_version,            help: "version"     },
    { cmd: "isconnected",            fn: show_connect_status,           help: "isconnected"},

    { cmd: "getfiles",            fn: get_files,           help: "getfiles"},
    { cmd: "getkeyvalues",            fn: get_keyvalues,           help: "getkeyvalues"},

    { cmd: "put",           fn: put_string_files,           help: "put [remoteFile] [data]"},
    { cmd: "get",           fn: get_string_files,           help: "get [remoteFile]"},
    { cmd: "size",           fn: get_size_files,           help: "size [remoteFile]"},
    { cmd: "delete",           fn: delete_file_files,           help: "delete [remoteFile]"},
    { cmd: "list",           fn: list_files,           help: "list"},

    { cmd: "putvalue",           fn: put_value,           help: "putvalue [key] [value]"},
    { cmd: "setvalue",           fn: set_value,           help: "setvalue [key] [value]"},
    { cmd: "getvalues",           fn: get_values,           help: "getvalues [key]"},
    { cmd: "deletekey",           fn: delete_key,           help: "deletekey [key]"},
]

function do_ipfs_command(input) {
    var args = input.trim().match(/[^\s"]+|"([^"]*)"/g);
    if (!args || args[0] == "") {
        return;
    }
    args[0] = args[0].toLowerCase()
    for (var i = 0; i < ipfs_commands.length; i++) {
        if (ipfs_commands[i].cmd == args[0]) {
            ipfs_commands[i].fn(args);
            return;
        }
    }
    display_others_msg("Unknown command:" + args[0]);
}

function do_onedrive_command(input) {
     var args = input.trim().match(/[^\s"]+|"([^"]*)"/g);
     if (!args || args[0] == "") {
         return;
     }
     args[0] = args[0].toLowerCase()
     for (var i = 0; i < onedrive_commands.length; i++) {
         if (onedrive_commands[i].cmd == args[0]) {
             onedrive_commands[i].fn(args);
             return;
         }
     }
     display_others_msg("Unknown command:" + args[0]);
 }

function help_onedrive(args) {
    if (args.length > 1) {
        for (var i = 0; i < onedrive_commands.length; i++) {
            if (onedrive_commands[i].cmd == args[1]) {
                display_others_msg("Usage: :" + onedrive_commands[i].help);
                return;
            }
        }
        display_others_msg("Usage: :" + onedrive_commands[0].help);
    }
    else {
        var msg = "Available commands list: </br>"
        for (var i = 0; i < onedrive_commands.length; i++) {
            msg += "&nbsp;&nbsp;" + onedrive_commands[i].help + "</br>";
        }
        display_others_msg(msg);
    }
}

function help_ipfs(args) {
    if (args.length > 1) {
        for (var i = 0; i < ipfs_commands.length; i++) {
            if (ipfs_commands[i].cmd == args[1]) {
                display_others_msg("Usage: :" + ipfs_commands[i].help);
                return;
            }
        }
        display_others_msg("Usage: :" + ipfs_commands[0].help);
    }
    else {
        var msg = "Available commands list: </br>"
        for (var i = 0; i < ipfs_commands.length; i++) {
            msg += "&nbsp;&nbsp;" + ipfs_commands[i].help + "</br>";
        }
        display_others_msg(msg);
    }
}

function exit(args) {
    appManager.close();
}

function get_version(args) {
    hiveManager.getVersion(
        function (version) {
            display_others_msg(version);
        },
        function (error) {
            display_others_msg("Get version error! " + error);
        }
    );
}

function show_connect_status(argv) {
     if (argv.length != 1) {
         display_others_msg("Invalid command syntax.");
         return;
     }
    var success = function (ret) {
        display_others_msg("Connect status is "+ret);
    }
     client.isConnected(success,null);
}

var client;
var ipfs;
var files;
var keyvalues;

function get_ipfs(argv) {
     if (argv.length != 1) {
          display_others_msg("Invalid command syntax.");
          return;
      }
     var success = function (ret) {
         ipfs = ret;
         display_others_msg("success");
     }

      client.getIPFS(success,null);
}

function get_files(argv) {
     if (argv.length != 1) {
         display_others_msg("Invalid command syntax.");
         return;
     }
    var success = function (ret) {
        files = ret;
        display_others_msg("success");
    }

     client.getFiles(success,null);
}

function get_keyvalues(argv) {
     if (argv.length != 1) {
         display_others_msg("Invalid command syntax.");
         return;
     }
    var success = function (ret) {
        keyvalues = ret;
        display_others_msg("success");
    }

     client.getKeyValues(success,null);
 }



function put_string_files(argv) {
     if (argv.length != 3) {
         display_others_msg("Invalid command syntax.");
         return;
     }

     if(files==null){
         display_others_msg("Please getFiles first.");
         return;
     }

     var remoteFile = argv[1];
     var data = argv[2];

     files.put(remoteFile,data).then(
         function (ret) {
             display_others_msg(ret.status);
         },
         function (error) {
             display_others_msg("Put string error! " + error);
         });
 }

 function get_string_files(argv) {
     if (argv.length != 2) {
         display_others_msg("Invalid command syntax.");
         return;
     }

     if(files==null){
         display_others_msg("Please getFiles first.");
         return;
     }

     var remoteFile = argv[1];

     files.getAsString(remoteFile).then(
         function (ret) {
             display_others_msg(ret.status);
             display_others_msg("content is "+ret.content);
         },
         function (error) {
             display_others_msg("Get string error! " + error);
         });
 }

 function get_size_files(argv) {
     if (argv.length != 2) {
         display_others_msg("Invalid command syntax.");
         return;
     }

     if(files==null){
         display_others_msg("Please getFiles first.");
         return;
     }

     var remoteFile = argv[1];

     files.size(remoteFile).then(
         function (ret) {
             display_others_msg(ret.status);
             display_others_msg("Length is "+ret.length);
         },
         function (error) {
             display_others_msg("Get size error! " + error);
         });
 }

 function delete_file_files(argv) {
     if (argv.length != 2) {
         display_others_msg("Invalid command syntax.");
         return;
     }

     if(files==null){
         display_others_msg("Please getFiles first.");
         return;
     }

     var remoteFile = argv[1];

     files.deleteFile(remoteFile).then(
         function (ret) {
             display_others_msg(ret.status);
         },
         function (error) {
             display_others_msg("Delete file error! " + error);
         });
 }

 function list_files(argv) {
      if (argv.length != 1) {
          display_others_msg("Invalid command syntax.");
          return;
      }

      if(files==null){
          display_others_msg("Please getFiles first.");
          return;
      }

      files.list().then(
          function (ret) {
              display_others_msg(ret.fileList);
          },
          function (error) {
              display_others_msg("Delete file error! " + error);
          });
  }

function put_value(argv) {
    if (argv.length != 3) {
        display_others_msg("Invalid command syntax.");
        return;
    }

    if(keyvalues==null){
        display_others_msg("Please getKeyValues first.");
        return;
    }

    var key = argv[1];
    var value = argv[2];

    keyvalues.putValue(key,value).then(
        function (ret) {
            display_others_msg(ret.status);
        },
        function (error) {
            display_others_msg("Put value error! " + error);
        });
}

function set_value(argv) {
     if (argv.length != 3) {
         display_others_msg("Invalid command syntax.");
         return;
     }

     if(keyvalues==null){
         display_others_msg("Please getKeyValues first.");
         return;
     }

     var key = argv[1];
     var value = argv[2];

     keyvalues.setValue(key,value).then(
         function (ret) {
             display_others_msg(ret.status);
         },
         function (error) {
             display_others_msg("Set value error! " + error);
         });
 }

function get_values(argv) {
    if (argv.length != 2) {
        display_others_msg("Invalid command syntax.");
        return;
    }

    if(keyvalues==null){
        display_others_msg("Please getKeyValues first.");
        return;
    }

    var key = argv[1];

    keyvalues.getValues(key).then(
        function (ret) {
            display_others_msg(ret.status);
            display_others_msg(ret.valueList);
        },
        function (error) {
            display_others_msg("Get values error! " + error);
        });
}

function delete_key(argv) {
    if (argv.length != 2) {
        display_others_msg("Invalid command syntax.");
        return;
    }

    if(keyvalues==null){
        display_others_msg("Please getKeyValues first.");
        return;
    }

    var key = argv[1];

    keyvalues.deleteKey(key).then(
        function (ret) {
            display_others_msg(ret.status);
        },
        function (error) {
            display_others_msg("Get values error! " + error);
        });
}

function put_string_ipfs(argv) {
    if (argv.length != 2) {
        display_others_msg("Invalid command syntax.");
        return;
    }

    if(ipfs==null){
        display_others_msg("Please getIPFS first.");
        return;
    }

    var data = argv[1];

    ipfs.put(data).then(
        function (ret) {
            display_others_msg(ret.status);
            display_others_msg("cid is " + ret.cid);
        },
        function (error) {
            display_others_msg("Put string error! " + error);
        });
}
function get_string_ipfs(argv) {
    if (argv.length != 2) {
        display_others_msg("Invalid command syntax.");
        return;
    }

    if(ipfs==null){
        display_others_msg("Please getIPFS first.");
        return;
    }

    var cid = argv[1];

    ipfs.get(cid).then(
        function (ret) {
            display_others_msg(ret.status);
            display_others_msg("content is " + ret.content);
        },
        function (error) {
            display_others_msg("get string error! " + error);
        });
}

function get_size_ipfs(argv) {
    if (argv.length != 2) {
        display_others_msg("Invalid command syntax.");
        return;
    }

    if(ipfs==null){
        display_others_msg("Please getIPFS first.");
        return;
    }

    var cid = argv[1];

    ipfs.size(cid).then(
        function (ret) {
            display_others_msg(ret.status);
            display_others_msg("size is " + ret.length);
        },
        function (error) {
            display_others_msg("get string error! " + error);
        });
}

function onLauncher() {
    appManager.launcher();
}

function onClose() {
    appManager.close();
}

var onedrive_opts = {
    driveType: "2",
    clientId: "afd3d647-a8b7-4723-bf9d-1b832f43b881",
    scope: "User.Read Files.ReadWrite.All offline_access",
    redirectUrl: "http://localhost:12345"
};

var ipfs_opts = {
    driveType: "3",
    nodes:[
           {ip:"127.0.0.1",port:5001},
           {ip:"3.133.166.156",port:5001},
           {ip:"13.59.79.222",port:5001},
           {ip:"3.133.71.168",port:5001}
          ]
};

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        var msg = "Create which client："
                    + "<br/> 1.onedrive"
                    + "<br/> 2.ipfs";
        display_others_msg(msg);

        $("input").focus();
        $("input").bind('keypress', function (event) {
            if (event.keyCode == "13") {
                var content = $('input').val()
                if (content.trim() != "") {
                    display_me_msg($('input').val());
                    do_client_command($('input').val());
                    $('input').val('');
                }
            }
        });
    },
};

app.initialize();

