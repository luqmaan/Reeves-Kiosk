/* html5sql.js MIT v0.9.4 http://html5sql.com/ */
var html5sql=function(){var a=false,b=function(){},c=function(a){return a.replace(/^\s+/,"").replace(/\s+$/,"")},d=function(a){return Object.prototype.toString.call(a)==="[object Array]"},e=function(a){return a===void 0},f=new RegExp("^select\\s","i"),g=function(a){return f.test(a)},h=function(a,b,c,d){var e=0,f=null,h=function(){a.executeSql(b[e].sql,b[e].data,i,j)},i=function(a,d){var i,j,k=[];if(html5sql.logInfo){console.log("Success processing: "+b[e].sql)}if(html5sql.putSelectResultsInArray&&g(b[e].sql)){for(i=0,j=d.rows.length;i<j;i++){k[i]=d.rows.item(i)}}else{k=null}f=b[e].success(a,d,k);e++;if(f&&$.isArray(f)){b[e].data=f;f=null}else{f=null}if(b.length>e){h()}else{c(a,d,k)}},j=function(a,c){if(html5sql.logErrors){console.error("Error: "+c.message+" while processing statment "+(e+1)+": "+b[e].sql)}d(c,b[e].sql)};h()},i=function(a){var f;if(typeof a==="string"){c(a);a=a.split(";");for(f=1;f<a.length;f++){while(a[f].split(/["]/gm).length%2===0||a[f].split(/[']/gm).length%2===0||a[f].split(/[`]/gm).length%2===0){a.splice(f,2,a[f]+";"+a[f+1])}a[f]=c(a[f])+";";if(a[f]===";"){a.splice(f,1)}}}if(d(a)===false){a=[a]}for(f=0;f<a.length;f++){if(typeof a[f]==="string"){a[f]={sql:a[f],data:[],success:b}}else{if(e(a[f].data)){a[f].data=[]}if(e(a[f].success)){a[f].success=b}if(typeof a[f]!=="object"||typeof a[f].sql!=="string"||typeof a[f].success!=="function"||!$.isArray(a[f].data)){throw new Error("Malformed sql object: "+a[f])}}}return a},j=function(a){var b=0;do{if(!g(a[b].sql)){return false}b++}while(b<a.length);return true};return{database:null,logInfo:false,logErrors:false,defaultFailureCallback:b,putSelectResultsInArray:true,openDatabase:function(b,c,d,e){html5sql.database=openDatabase(b,"",c,d);a=typeof html5sql.database.readTransaction==="function";if(e){e()}},process:function(c,d,f){if(html5sql.database){var g=i(c);if(e(d)){d=b}if(e(f)){f=html5sql.defaultFailureCallback}if(j(g)&&a){html5sql.database.readTransaction(function(a){h(a,g,d,f)})}else{html5sql.database.transaction(function(a){h(a,g,d,f)})}}else{if(html5sql.logErrors){console.error("Error: Database needs to be opened before sql can be processed.")}return false}},changeVersion:function(a,c,d,f,g){if(html5sql.database){if(html5sql.database.version===a){var j=i(d);if(e(f)){f=b}if(e(g)){g=html5sql.defaultFailureCallback}html5sql.database.changeVersion(a,c,function(a){h(a,j,f,g)})}}else{if(html5sql.logErrors){console.log("Error: Database needs to be opened before sql can be processed.")}return false}}}}()