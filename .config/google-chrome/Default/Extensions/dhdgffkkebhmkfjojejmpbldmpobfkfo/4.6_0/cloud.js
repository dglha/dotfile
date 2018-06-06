'use strict';Registry.require("promise helper xmlhttprequest uri convert tools".split(" "),function(){var x=rea.FEATURES,h=Registry.get("promise"),y=Registry.get("xmlhttprequest").run,n=Registry.get("uri"),v=Registry.get("helper"),q=Registry.get("convert"),r=Registry.get("tools"),w,z=r.createQueue(1),A=function(g){var d=h(),b=new FileReader;b.onloadend=function(){d.resolve(q.arrbuf2str(this.result))};b.onerror=d.reject;b.onabort=d.reject;b.readAsArrayBuffer(g);return d.promise()},u=function(g){var d,
b=[],a=null,k,c={extend:function(m){m=m(c);Object.keys(c).forEach(function(a){var e=Object.getOwnPropertyDescriptor(c,a);e.get?(m.__defineGetter__(a,e.get),e.set&&m.__defineSetter__(a,e.set)):m[a]=m[a]||c[a]});return c=m},config:{},changes:function(){var a;return{listen:function(){a||(a=h(),c.watch&&c.watch.start());return a.promise()},notify:function(c){a.notify(c)}}}(),oauth:function(){var a,b={run:function(){if(k)return k;var e=h(),f=k=e.promise();a="!!"+g+"-"+v.createUUID();var p=w({type:g,url:b.getAuthUrl()});
p.promise.progress(function(f){var a;e&&(a=b.onUrl(f.url))&&(c.credentials=a,d=null,e.resolve(),e=null,p.close())}).always(function(){k=d=null;e&&e.reject("auth_failed")});return f},getAuthUrl:function(){return c.config.request_uri+"?"+n.hash2params({response_type:c.config.response_type,client_id:c.config.client_id,redirect_uri:c.config.redirect_uri,state:a,scope:c.config.scope})},onUrl:function(e){var f,p;if(e&&0===e.indexOf(c.config.redirect_uri)&&(p=n.parse(e))&&(f=n.params2hash(p))&&f.access_token&&
f.state===a)return{uid:f.uid,access_token:f.access_token}}};return b}(),request:function(a){var c=function(){var c=h(),f=function(f){console.debug("cloud: request failed",f);c.reject(f)};y(a,{onload:function(a){-1==[200,201,204].indexOf(a.status)?f(a):c.resolve(a.response)},onerror:f,ontimeout:f,onprogress:c.notify});return c.promise()};return a.no_queue?c():z.add(c)},wait:function(a){return function(){if(c.credentials.access_token)return a.apply(this,arguments);var k=arguments,e=h();b.push(function(){e.consume(a.apply(this,
k))});d||c.oauth.run().done(function(){b.forEach(function(f){f()});b=[]}).fail(function(f){e.reject(f)});return e.promise()}}},t=x.HTML5.LOCALSTORAGE;c.__defineGetter__("credentials",function(){if(null===a){if(t)try{var b=JSON.parse(t.getItem(c.config.storage_key));a={uid:b.uid,access_token:b.access_token}}catch(k){}a=a||{}}return a});c.__defineSetter__("credentials",function(b){if(t)try{t.setItem(c.config.storage_key,JSON.stringify({uid:b.uid,access_token:b.access_token}))}catch(k){}a=b});return c};
Registry.register("cloud","5770",{init:function(g){w=g},drive:function(){return(new u("drive")).extend(function(g){var d,b,a={config:{redirect_uri:"https://tampermonkey.net/oauth.php",request_uri:"https://accounts.google.com/o/oauth2/v2/auth",client_id:"408438522028-3cgn3t3jas3fak7isbnfod1q4h15g2fv.apps.googleusercontent.com",storage_key:"gd_config",scope:"https://www.googleapis.com/auth/drive.appdata",response_type:"token"},request:function(b){b.headers=b.headers||{};b.headers.Authorization=
"Bearer "+a.credentials.access_token;return g.request.apply(this,arguments).then(function(a){return a},function(c){if(!c||-1!=[403,500].indexOf(c.status))return b.backoff=2*(b.backoff||1E3),r.sleep(b.backoff).then(function(){return a.request(b)});if(-1!=[400,401].indexOf(c.status)){if(console.warn("Google Drive: authentication error",c),a.credentials={},!b.retry_auth)return b.retry_auth=!0,a.oauth.run().then(function(){return a.request(b)})}else if(404==c.status)return h().resolve(null);return h().reject(c.statusText||
c.responseText)})},list:g.wait(function(b){var c=[],d=h(),g=function(a){return"https://www.googleapis.com/drive/v3/files?"+n.hash2params({spaces:"appDataFolder",pageToken:a,orderBy:"modifiedTime desc",fields:"nextPageToken, files(id, size, name, modifiedTime, md5Checksum)",pageSize:500})},l=function(b){return a.request({method:"GET",url:b,headers:{"Content-Type":"application/json"}}).then(function(f){f=f?JSON.parse(f):{files:[]};c=c.concat(f.files);if(f.nextPageToken)return l(g(f.nextPageToken));
d.resolve(c)})};l(g());return d.promise().then(function(a){var f={};return a.map(function(a){if(!b){if(f[a.name])return;f[a.name]=!0}return{name:a.name,size:a.size||0,id:a.id,md5:a.md5Checksum,modified:(new Date(a.modifiedTime)).getTime()}}).filter(function(a){return a})})}),get:g.wait(function(b){return a.request({method:"GET",url:"https://www.googleapis.com/drive/v3/files/"+(b.id||b)+"?"+n.hash2params({spaces:"appDataFolder",alt:"media"}),responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),
put:g.wait(function(b,c,d){var g=b.name||b,l=b.id,e=v.createUUID();return h.Pledge().then(function(){if(c)return A(c)}).then(function(f){var b=d&&d.lastModified?(new Date(d.lastModified)).toISOString():void 0,c=[];c.push("--"+e);c.push("Content-Type: application/json");c.push("");c.push(JSON.stringify({name:g,parents:l?void 0:["appDataFolder"],modifiedTime:b}));c.push("--"+e);f&&(c.push("Content-Type: application/octet-stream"),c.push("Content-Transfer-Encoding: base64"),c.push(""),c.push(q.Base64.encode(f)),
c.push("--"+e+"--"));c.push("");return a.request({method:l||!f?"PATCH":"POST",url:"https://www.googleapis.com/"+(f?"upload/":"")+"drive/v3/files"+(l?"/"+l:"")+"?"+n.hash2params({uploadType:"multipart"}),headers:{"Content-Type":"multipart/related; boundary="+e},data:c.join("\r\n")})})}),delete:g.wait(function(b){return a.request({method:"DELETE",url:"https://www.googleapis.com/drive/v3/files/"+(b.id||b)+"?"+n.hash2params({spaces:"appDataFolder"}),headers:{"Content-Type":" application/json"}})}),compare:function(a,
b){var d=h(),g;(g=a.md5)&&g==q.MD5(b,"utf-8")?d.resolve(!0):d.resolve(!1);return d.promise()},watch:{start:function(){if(!d){d=!0;var k,c=function(){b=null;d&&a.request({method:"GET",url:"https://www.googleapis.com/drive/v3/changes/?"+n.hash2params({pageToken:k,spaces:"appDataFolder",pageSize:1E3,includeRemoved:!0}),headers:{"Content-Type":" application/json"}}).then(function(b){if(!d)return h.Breach();var c=b?JSON.parse(b):{};if(!(k=c.newStartPageToken))return console.warn("Google Drive: watch token error",
b),a.watch.stop();c.nextPageToken&&console.warn("Google Drive: too much changes",b);(c.changes||[]).forEach(function(a){var b,f;"file"===a.type&&(f=a.file)&&(b=Date.parse(a.time),isNaN(b)&&(b=Date.now()),g.changes.notify({id:f.id,time:b,name:f.name,removed:a.removed}))})}).fail(function(a){console.warn("Google Drive: file changes check failed",a)}).always(function(){b=window.setTimeout(c,18E5)})};g.wait(function(){return d?a.request({method:"GET",url:"https://www.googleapis.com/drive/v3/changes/startPageToken",
headers:{"Content-Type":" application/json"}}).then(function(b){if(!(k=(b?JSON.parse(b):{}).startPageToken))return console.warn("Google Drive: watch token error",b),a.watch.stop();c()}):h.Breach()})()}},stop:function(){d=!1;b&&(window.clearTimeout(b),b=null)}}};return a})},dropbox:function(g){g=g||"";return(new u("dropbox")).extend(function(d){var b,a,k,c,n=!0,m=function(a,b){var c=(a?a.split("/"):[]).concat(b?[b]:[]).join("/");return c?"/"+c:""},l=function(a){var b=[],c=h(),d=function(a){return e.request({method:"POST",
url:"https://api.dropboxapi.com/2/files/list_folder"+(a?"/continue":""),headers:{"Content-Type":" application/json"},data:{path:a?void 0:m(g),cursor:a}}).then(function(a){a=a?JSON.parse(a):{entries:[]};b=b.concat(a.entries);if(a.has_more&&a.cursor)return d(a.cursor);c.resolve({list:b,cursor:a.cursor})}).fail(c.reject)};n?(n=!1,e.put(".version",new Blob([rea.extension.manifest.version])).then(function(){d(a)}).fail(c.reject)):d(a);return c.promise()},e={config:{redirect_uri:"https://tampermonkey.net/oauth.php",
request_uri:"https://www.dropbox.com/oauth2/authorize",client_id:"gq3auc9yym0e21y",storage_key:"db_config",response_type:"token"},request:function(a){a.no_auth||(a.headers=a.headers||{},a.headers.Authorization="Bearer "+e.credentials.access_token);return d.request.apply(this,arguments).then(function(a){return a},function(b){return b&&-1==[500,429].indexOf(b.status)?-1==[401].indexOf(b.status)||(console.warn("Dropbox: authentication error",b),e.credentials={},a.retry_auth)?h().reject(b.responseText||
b.statusText):(a.retry_auth=!0,e.oauth.run().then(function(){return e.request(a)})):(a.backoff=2*(a.backoff||1E3),r.sleep(a.backoff).then(function(){return e.request(a)}))})},list:d.wait(function(a){return l().then(function(b){var d={};c=b.cursor;return b.list.map(function(b){if(!a){if(d[b.name])return;d[b.name]=!0}return{name:b.name,size:b.size,dropbox_hash:b.content_hash,modified:(new Date(b.client_modified)).getTime(),precision:1E3}}).filter(function(a){return a})}).always(function(){k&&c&&(k(),
k=null)})}),get:d.wait(function(a){return e.request({method:"POST",url:"https://content.dropboxapi.com/2/files/download",headers:{"Dropbox-API-Arg":JSON.stringify({path:m(g,a.name||a)})},responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),put:d.wait(function(a,b,c){a=a.name||a;c=c&&c.lastModified?(new Date(c.lastModified)).toISOString().match(/[^:]*:[^:]*:[^:.a-zA_Z]*/)[0]+"Z":void 0;return e.request({method:"POST",url:"https://content.dropboxapi.com/2/files/upload",headers:{"Dropbox-API-Arg":JSON.stringify({path:m(g,
a),client_modified:c,mode:"overwrite"}),"Content-Type":"application/octet-stream"},data_type:"typified",data:{type:"raw",value:b}})}),delete:d.wait(function(a){return e.request({method:"POST",url:"https://api.dropboxapi.com/2/files/delete",headers:{"Content-Type":" application/json"},data:{path:m(g,a.name||a)}})}),compare:function(a,b){var c=h();if(window.crypto&&window.ArrayBuffer){for(var d=q.str2arrbuf(b,"utf-8"),e=[],g=d.byteLength,k=1,m=function(){if(0===--k){var b=new window.ArrayBuffer;e.forEach(function(a){var c=
b,d=new Uint8Array(c.byteLength+a.byteLength);d.set(new Uint8Array(c),0);d.set(new Uint8Array(a),c.byteLength);b=d.buffer});window.crypto.subtle.digest("SHA-256",b).then(function(b){b=Array.from(new Uint8Array(b)).map(function(a){return("00"+a.toString(16)).slice(-2)}).join("");c.resolve(b==a.dropbox_hash)})}},n=0,l=0;l<g;l+=4194304,n++)(function(a){e.push(null);k++;window.crypto.subtle.digest("SHA-256",d.slice(l,l+Math.min(4194304,g-l))).then(function(b){e[a]=b;m()},function(){console.warn("Dropbox: unable to calculate SHA-256 hashes");
c.reject()})})(n);m()}else console.warn("Dropbox: unable to calculate SHA-256 hashes"),c.reject();return c.promise()},watch:{start:function(){if(!b){b=!0;var f=0,g=function(){a=null;f=0;if(b){if(!c)return console.warn("Dropbox: watch token error",c),e.watch.stop();e.request({method:"POST",url:"https://notify.dropboxapi.com/2/files/list_folder/longpoll",headers:{"Content-Type":" application/json"},no_auth:!0,no_queue:!0,data:{cursor:c,timeout:180}}).then(function(a){if(!b)return h.Breach();var d=a?
JSON.parse(a):{};d.backoff&&(f=1E3*d.backoff);return d.changes?r.sleep(6E4).then(function(){return l(c)}).then(function(b){return(c=b.cursor)?b.list:(console.warn("Dropbox: watch token error",a),e.watch.stop())}):null}).then(function(a){a&&a.forEach(function(a){var b,c=a[".tag"];-1!=["file","deleted"].indexOf(c)&&(b=Date.parse(a.server_modified),d.changes.notify({id:a.id,time:b,name:a.name,removed:"deleted"==c}))})}).fail(function(a){console.warn("Dropbox: file changes check failed",a)}).always(function(){a=
window.setTimeout(g,f+18E5)})}};d.wait(function(){if(!b)return h.Breach();c?g():k=g;return h.Pledge()})()}},stop:function(){b=!1;a&&(window.clearTimeout(a),a=null)}}};return e})},onedrive:function(){return(new u("onedrive")).extend(function(g){var d={config:{redirect_uri:"https://tampermonkey.net/oauth.php",request_uri:"https://login.live.com/oauth20_authorize.srf",client_id:"000000004C1A3122",storage_key:"od_config",response_type:"token",scope:"onedrive.appfolder"},request:function(b){b.headers=
b.headers||{};b.headers.Authorization="Bearer "+d.credentials.access_token;return g.request.apply(this,arguments).then(function(a){return a},function(a){return a?-1==[401].indexOf(a.status)||(console.warn("OneDrive: authentication error",a),d.credentials={},b.retry_auth)?h().reject(a.statusText||a.responseText):(b.retry_auth=!0,d.oauth.run().then(function(){return d.request(b)})):(console.warn("OneDrive: timeout"),h().reject("Timeout"))})},list:g.wait(function(){return d.request({method:"GET",url:"https://api.onedrive.com/v1.0/drive/special/approot/children",
headers:{"Content-Type":" application/json"}}).then(function(b){var a=JSON.parse(b);a["@odata.nextLink"]&&console.warn("OneDrive: too much files",b);return a.value.map(function(a){return{name:a.name,size:a.size,modified:(new Date(a.lastModifiedDateTime)).getTime()}})})}),get:g.wait(function(b){return d.request({method:"GET",url:"https://api.onedrive.com/v1.0/drive/special/approot:/"+encodeURIComponent(b.name||b)+":/content",responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),put:g.wait(function(b,
a){return d.request({method:"PUT",url:"https://api.onedrive.com/v1.0/drive/special/approot:/"+encodeURIComponent((b.name||b).replace(/[#%<>:"|\?\*\/\\]/g,"-"))+":/content",headers:{"Content-Type":"application/octet-stream"},data_type:"typified",data:{type:"raw",value:a}})}),delete:g.wait(function(b){return d.request({method:"DELETE",url:"https://api.onedrive.com/v1.0/drive/special/approot:/"+encodeURIComponent(b.name||b)})})};return d})}})});
