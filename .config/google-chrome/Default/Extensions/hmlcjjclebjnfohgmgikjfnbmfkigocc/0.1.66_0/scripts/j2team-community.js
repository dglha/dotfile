"use strict";!function(e){e.runtime.sendMessage({cmd:"track_page_view",path:"/j2team-community.html"}),e.cookies.get({url:"https://*.facebook.com",name:"c_user"},function(t){if(null===t){var n=e.extension.getURL("images/juno_okyo.png");e.notifications.create({type:"basic",iconUrl:n,appIconMaskUrl:n,title:e.i18n.getMessage("appName"),message:e.i18n.getMessage("error")+": "+e.i18n.getMessage("facebookLoginError")+"."}),window.top.location.replace("https://www.facebook.com/login")}else e.runtime.sendMessage({cmd:"facebook_authentication"}),e.runtime.onMessage.addListener(function(e,t,n){if(e.data&&e.data.length>0){new Vue({el:"#main",data:{access_token:e.data,group_id:"364997627165697",posts:[],page:{previous:null,next:null},loading:!1},methods:{getPosts:function(e){var t=this,n=void 0;n=null===this.page.next?"https://graph.facebook.com/v2.8/"+this.group_id+"/feed?fields=from{name,picture{url}},message,updated_time,reactions.limit(0).summary(true),comments.limit(0).summary(true),shares&limit=10&access_token="+this.access_token:"next"===e?this.page.next:this.page.previous,this.loading=!0,this.$http.get(n).then(function(e){return e.json()}).then(function(e){t.posts=e.data,e.paging&&e.paging.next&&e.paging.previous&&(t.page=e.paging),t.loading=!1,$("html, body").animate({scrollTop:0},"fast")})},getDirectUrl:function(e){return"https://www.facebook.com/"+e.replace("_","/posts/")}},mounted:function(){var e=this;this.getPosts("next"),key("left",function(){return e.getPosts("previous")}),key("right",function(){return e.getPosts("next")})}})}})})}(chrome);