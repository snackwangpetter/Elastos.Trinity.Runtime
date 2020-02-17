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
//
//alert("ssss");
//        do_onedrive_command("help");
//        display_others_msg("created onedrive client successfully");
//                alert("111");
//
//        $("input").focus();
//        alert("222");
////            $('input').unbind('keypress');
//
//        alert("333");
//        $("input").bind('keypress', function (event) {
//        alert("---");
//
//            if (event.keyCode == "13") {
//            alert("444");
//
//                var content = $('input').val()
//                if (content.trim() != "") {
//                alert("555");
//
//                    display_me_msg($('input').val());
//                    do_onedrive_command($('input').val());
//                    $('input').val('');
//                                alert("ffff");
//
//                }
//            }
//                        alert("ggggggg");
//                                });

    var success = function (ret) {
        do_onedrive_command("help");
        client = ret ;
        display_others_msg("created onedrive client successfully");

        $("input").focus();
        $('input').unbind('keypress');

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
//    $('input').unbind('keypress')
//
//    var success = function (ret) {
//        do_ipfs_command("help");
//        connection = ret ;
//        display_others_msg("created ipfs client successfully");
//
//        $("input").focus();
//        $("input").bind('keypress', function (event) {
//            if (event.keyCode == "13") {
//                var content = $('input').val()
//                if (content.trim() != "") {
//                    display_me_msg($('input').val());
//                    do_ipfs_command($('input').val());
//                    $('input').val('');
//                }
//            }
//        });
//    }
//
////    hiveManager.createConnection(null,ipfs_opts, success, null);
}
//
//var ipfs_commands = [
//    { cmd: "help",      fn: help_ipfs,                   help: "help [cmd]"  },
//    { cmd: "version",   fn: get_version,            help: "version"     },
////    { cmd: "create",            fn: create_hive_file,           help: "create [filepath]"},
////    { cmd: "putipfsfile",       fn: put_ipfs_file,           help: "putipfsfile sourceFilePath encrypt"},
////    { cmd: "putipfsbuffer",       fn: put_ipfs_buffer,           help: "putipfsbuffer sourceString encrypt"},
////    { cmd: "getipfsfilelength",       fn: get_ipfs_file_length,           help: "getipfsfilelength cid"},
////    { cmd: "getipfsbuffer",       fn: get_ipfs_buffer,           help: "getipfsbuffer cid encrypt"},
////    { cmd: "getipfsfile",       fn: get_ipfs_file,           help: "getipfsfile cid storePath encrypt"},
////    { cmd: "exit",      fn: exit,                   help: "exit"        }
////]
var onedrive_commands = [
    { cmd: "help",      fn: help_onedrive,                   help: "help [cmd]"  },
    { cmd: "version",   fn: get_version,            help: "version"     },
    { cmd: "isconnected",            fn: show_connect_status,           help: "isconnected"},
    { cmd: "getipfs",            fn: get_ipfs,           help: "getipfs"},
    { cmd: "getfiles",            fn: get_files,           help: "getfiles"},
    { cmd: "getkeyvalues",            fn: get_keyvalues,           help: "getkeyvalues"},
    { cmd: "putstring",           fn: put_string_files,           help: "putstring [remoteFile] [data]"},
    { cmd: "putstring",           fn: put_string_files,           help: "putstring [remoteFile] [data]"},
//    { cmd: "putbuffer",         fn: put_hive_file_from_buffer,           help: "putbuffer destFileName sourceString encrypt"},
//    { cmd: "getfilelength",     fn: get_file_length,           help: "getfilelength destFileName"},
//    { cmd: "getbuffer",           fn: get_file_buffer,           help: "getbuffer destFileName encrypt"},
//    { cmd: "getfile",           fn: get_file,           help: "getfile destFileName storePath encrypt"},
//    { cmd: "deletefile",        fn: delete_file,           help: "deletefile destFileName"},
//    { cmd: "listfile",          fn: list_file,           help: "listfile"},
//    { cmd: "putvalue",          fn: put_value,           help: "putvalue key valueStr encrypt"},
//    { cmd: "setvalue",          fn: set_value,           help: "setvalue key valueStr encrypt"},
//    { cmd: "getvalue",          fn: get_value,           help: "getvalue key encrypt"},
//    { cmd: "deletevalue",       fn: delete_value,           help: "deletevalue key"},
//    { cmd: "exit",      fn: exit,                   help: "exit"        }
]
//
//function do_ipfs_command(input) {
//    var args = input.trim().match(/[^\s"]+|"([^"]*)"/g);
//    if (!args || args[0] == "") {
//        return;
//    }
//    args[0] = args[0].toLowerCase()
//    for (var i = 0; i < ipfs_commands.length; i++) {
//        if (ipfs_commands[i].cmd == args[0]) {
//            ipfs_commands[i].fn(args);
//            return;
//        }
//    }
//    display_others_msg("Unknown command:" + args[0]);
//}
//
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
//
//function help_ipfs(args) {
//    if (args.length > 1) {
//        for (var i = 0; i < ipfs_commands.length; i++) {
//            if (ipfs_commands[i].cmd == args[1]) {
//                display_others_msg("Usage: :" + ipfs_commands[i].help);
//                return;
//            }
//        }
//        display_others_msg("Usage: :" + ipfs_commands[0].help);
//    }
//    else {
//        var msg = "Available commands list: </br>"
//        for (var i = 0; i < ipfs_commands.length; i++) {
//            msg += "&nbsp;&nbsp;" + ipfs_commands[i].help + "</br>";
//        }
//        display_others_msg(msg);
//    }
//}

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

//function create_hive_file(argv) {
//    if (argv.length > 2) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var filePath ="/";
//
//    if (argv.length == 2){
//        filePath = argv[1];
//    }
//
//    connection.createHiveFile(
//        filePath,
//        function (file) {
//            hivefile = file;
//            display_others_msg("file objID = "+hivefile.objId);
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        }
//    );
//}
//





//function get_string_files(argv) {
//    if (argv.length != 2) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var destFileName = argv[1];
//
//    client.getFileLength(destFileName).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}

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
     if (argv.length != 2) {
         display_others_msg("Invalid command syntax.");
         return;
     }

     client.getIPFS().then(
         function (ret) {
//             display_others_msg(ret.status);
         ipfs = ret;
         display_others_msg("success");
         },
         function (error) {
             display_others_msg("show connect status error! " + error);
         });
}

function get_files(argv) {
//      if (argv.length != 1) {
//          display_others_msg("Invalid command syntax.");
//          return;
//      }
//
//      client.getFiles(
//          function (ret) {
// //             display_others_msg(ret.status);
//          files = ret;
//          display_others_msg("success");
//          },
//          function (error) {
//              display_others_msg("show connect status error! " + error);
//          }));

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
         display_others_msg("please getFiles first.");
         return;
     }

     var remoteFile = argv[1];
     var data = argv[2];

     files.put(remoteFile,data).then(
         function (ret) {
             display_others_msg(ret.status);
         },
         function (error) {
             display_others_msg("Create HiveFile error! " + error);
         });
 }

// function get_string_files(argv) {
//     if (argv.length != 3) {
//         display_others_msg("Invalid command syntax.");
//         return;
//     }
//
//     if(files==null){
//         display_others_msg("please getFiles first.");
//         return;
//     }
//
//     var remoteFile = argv[1];
//     var data = argv[2];
//
//     files.put(remoteFile,data).then(
//         function (ret) {
//             display_others_msg(ret.status);
//         },
//         function (error) {
//             display_others_msg("Create HiveFile error! " + error);
//         });
// }


//function put_hive_file(argv) {
//    if (argv.length != 4) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var destFileName = argv[1];
//    var storePath = argv[2];
//    var encrypt = argv[3];
//
//    hivefile.putFile(destFileName,storePath,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//
//function put_hive_file_from_buffer(argv) {
//    if (argv.length != 4) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var destFileName = argv[1];
//    var sourceString = argv[2];
//    var encrypt = argv[3];
//
//    hivefile.putFileFromBuffer(destFileName,sourceString,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_file_length(argv) {
//    if (argv.length != 2) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var destFileName = argv[1];
//
//    hivefile.getFileLength(destFileName).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_file_buffer(argv) {
//    if (argv.length != 3) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var destFileName = argv[1];
//    var encrypt = argv[2];
//
//    hivefile.getFileToBuffer(destFileName,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_file(argv) {
//    if (argv.length != 4) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var destFileName = argv[1];
//    var storePath = argv[2];
//    var encrypt = argv[3];
//
//    hivefile.getFile(destFileName,storePath,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function delete_file(argv) {
//    if (argv.length != 2) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//    var destFileName = argv[1];
//
//    hivefile.deleteFile(destFileName).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function list_file() {
//    hivefile.listFile().then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function put_value(argv) {
//    if (argv.length != 4) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var key = argv[1];
//    var valueStr = argv[2];
//    var encrypt = argv[3];
//
//    hivefile.putValue(key,valueStr,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function set_value(argv) {
//    if (argv.length != 4) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//    var key = argv[1];
//    var valueStr = argv[2];
//    var encrypt = argv[3];
//
//    hivefile.setValue(key,valueStr,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_value(argv) {
//    if (argv.length != 3) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//    var key = argv[1];
//    var encrypt = argv[2];
//    hivefile.getValue(key,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function delete_value(argv) {
//    if (argv.length != 2) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//    var key = argv[1];
//
//    hivefile.deleteValueFromKey(key).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function put_ipfs_file(argv) {
//    if (argv.length != 3) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//    var sourceFilePath = argv[1];
//    var encrypt = argv[2];
//    hivefile.putIPFSFile(sourceFilePath,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function put_ipfs_buffer(argv) {
//    if (argv.length != 3) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var sourceString = argv[1];
//    var encrypt = argv[2];
//    hivefile.putIPFSFileFromBuffer(sourceString,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_ipfs_file_length(argv) {
//    if (argv.length != 2) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var cid = argv[1];
//    hivefile.getIPFSFileLength(cid).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_ipfs_buffer(argv) {
//    if (argv.length != 3) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var cid = argv[1];
//    var encrypt = argv[2];
//    hivefile.getIPFSFileToBuffer(cid,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}
//
//function get_ipfs_file(argv) {
//    if (argv.length != 4) {
//        display_others_msg("Invalid command syntax.");
//        return;
//    }
//
//    var cid = argv[1];
//    var storePath = argv[2];
//    var encrypt = argv[3];
//
//    hivefile.getIPFSFile(cid,storePath,encrypt).then(
//        function (ret) {
//            display_others_msg(JSON.stringify(ret));
//        },
//        function (error) {
//            display_others_msg("Create HiveFile error! " + error);
//        });
//}

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
    ip:"10.0.2.2",
    port:5001
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

