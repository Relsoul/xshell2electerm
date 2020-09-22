const fs = require('fs-extra')
const ini = require('ini')
const glob = require('glob')
const iconv = require('iconv-lite')
const uid = require('uid')
const path = require('path')

let electermObj = {
    "bookmarkGroups": [
        {
            "id": "default",
            "title": "default",
            "bookmarkIds": [

            ],
            "bookmarkGroupIds": []
        }
    ],
    "bookmarks": [
    ]
}
// options is optional
glob("./Sessions/**/*.xsh", {}, async function (er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.

    console.log(files)
    for (let i of files){
        let text
        try {
            text = await fs.readFile(i,);
            text = iconv.decode(text,'utf16')
            // text = text.replace('/')
            const parseT = ini.parse(text);
            const title = path.basename(i,'.xsh')
            const id = uid(9)
            const bookMarkItem = {
                    "id": id,
                    "title": title,
                    "host": parseT.CONNECTION.Host,
                    "username": parseT['CONNECTION:AUTHENTICATION']['UserName'],
                    "authType": "password",
                    "password": "",
                    "port": Number(parseT.CONNECTION.Port),
                    "loginScriptDelay": 500,
                    "encode": "utf-8",
                    "enableSftp": true,
                    "term": "xterm-256color",
                    "proxy": {
                        "proxyType": "5"
                    },
                    "x11": false,
                    "quickCommands": []
                };
            electermObj.bookmarkGroups[0].bookmarkIds.push(id)
            electermObj.bookmarks.push(bookMarkItem)
        }catch (e){
            console.error('e',e)
        }

    }

    fs.writeJson('./bookmarks.json',electermObj)
})
