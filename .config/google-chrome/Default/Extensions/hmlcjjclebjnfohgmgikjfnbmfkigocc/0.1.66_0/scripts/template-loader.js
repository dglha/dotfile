"use strict";!function(e,t){e(document).ready(function(e){function a(a){a.find("[data-i18n]").each(function(a,n){var o=e(n),r=t.i18n.getMessage(o.data("i18n"));""!==r&&o.text(r)})}var n=e("#navbar-placeholder");e.ajax({url:t.extension.getURL("navbar-template.html"),type:"GET",dataType:"html",cache:!0}).done(function(o){e("body").css("padding-top","70px"),n.html(o),a(n),n.find("#rate-me").attr("href","https://chrome.google.com/webstore/detail/"+t.runtime.id+"/reviews?utm_source=extension_navbar")}).fail(function(){n.remove()});var o=e("#panel-placeholder");o.length>0&&e.ajax({url:"panel-template.html",type:"GET",dataType:"html",cache:!0}).done(function(n){o.html(n),e("#extension-version").text("v"+t.runtime.getManifest().version),t.cookies.get({url:"https://*.facebook.com",name:"c_user"},function(t){null!==t&&e("#fb-user-id").text(t.value).attr("href","https://www.facebook.com/profile.php?id="+t.value)}),t.storage.sync.get({account_type:"free"},function(t){var n=t.account_type;e("#account-type").text(""+n[0].toUpperCase()+n.substr(1)),"premium"===n&&e("#cta-premium").remove(),a(o)})}).fail(function(){o.remove(),e("#main").removeClass("col-xs-8").addClass("col-xs-12"),e(".container").css("width","800px")})})}(jQuery,chrome);