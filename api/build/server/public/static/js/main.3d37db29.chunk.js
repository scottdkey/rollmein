(this.webpackJsonprollmein=this.webpackJsonprollmein||[]).push([[0],{132:function(e,t,n){e.exports=n(258)},257:function(e,t,n){},258:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(49),l=n.n(c),o=n(44),u=n(7),i=n.n(u),s=n(19),m=n(5),f=n(10),d=n(32),p=n.n(d),v={API_URL:"/api/v1",NODE_ENV:Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,REACT_APP_API_URL:"/api/v1"}).REACT_APP_NODE_ENV};console.log(v);var b=v,E="".concat(b.API_URL,"/auth"),h=function(){var e=Object(s.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.post("".concat(E,"/login"),t);case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),g=function(){var e=Object(s.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.get("".concat(E,"/status"));case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),O=function(){var e=Object(s.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.get("".concat(E,"/logout"),{withCredentials:!0});case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),y=function(){var e=Object(s.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.post("".concat(E,"/register"),t);case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),j=function(){var e=Object(s.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.patch("".concat(E,"/update"),t);case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),k=Object(a.createContext)(void 0),w=function(e){var t=e.children,n=Object(a.useState)(void 0),c=Object(m.a)(n,2),l=c[0],o=c[1],u=Object(a.useState)(!1),d=Object(m.a)(u,2),p=d[0],v=d[1],b=Object(a.useState)(""),E=Object(m.a)(b,2),w=E[0],C=E[1];function N(e){o(e.data)}var x=function(){var e=Object(s.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:y(t).then((function(e){N(e),200===e.status?v(!0):v(!1)})).catch((function(e){return console.log(e)}));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){g().then((function(e){N(e),200===e.status?v(!0):v(!1)})).catch((function(e){401===e.status&&C("Unauthorized")}))}),[p]),r.a.createElement(k.Provider,{value:{login:function(e){h(e).then((function(e){N(e),200===e.status?v(!0):v(!1)})).catch((function(e){return console.log(e)}))},logout:function(){return O().then((function(e){N(e),v(!1)})).catch((function(e){return console.log(e.status)})),v(!1),r.a.createElement(f.a,{to:"login"})},register:x,appleLogin:function(){},googleLogin:function(){},updateUser:function(e){j(e).then((function(e){return N(e)})).catch((function(e){return console.log(e)}))},deleteUser:function(){},user:l,authenticated:p,error:w}},t)},C=function(){return Object(a.useContext)(k)},N=n(130),x="".concat(b.API_URL,"/players"),S=function(){var e=Object(s.a)(i.a.mark((function e(t,n){var a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.put("".concat(x,"/").concat(t.id),t);case 2:return 200===e.sent.status&&(a=n.map((function(e){return e.id===t.id?t:e}))),e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),P=function(){var e=Object(s.a)(i.a.mark((function e(t,n,a){var r,c;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.post("".concat(x,"/").concat(a),t);case 2:return r=e.sent,c=[].concat(Object(N.a)(n),[r.data[0]]),e.abrupt("return",c);case 5:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}(),R=function(){var e=Object(s.a)(i.a.mark((function e(t,n){var a,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.delete("".concat(x,"/").concat(t));case 2:return a=e.sent,r=n.filter((function(e){return e.id!==a.data[0].id})),e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),A=function(){var e=Object(s.a)(i.a.mark((function e(t){var n,a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.a.get("".concat(x,"/").concat(t));case 2:return n=e.sent,a=n.data.map((function(e){return e})),e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),F=function(e){var t=_(e),n=t.tanks>0,a=t.dps>=3,r=t.healers>0,c=n&&a&&r;return!0===(e?e.length>=6:0)&&!0===c},_=function(e){var t=e||L;return{tanks:t.reduce((function(e,t){return e+(!0===t.tank&&!0===t.in?1:0)}),0),healers:t.reduce((function(e,t){return e+(!0===t.healer&&!0===t.in?1:0)}),0),dps:t.reduce((function(e,t){return e+(!0===t.dps&&!0===t.in?1:0)}),0)}};var L=[{name:"",tank:!1,dps:!1,healer:!1,locked:!1,in:!1,id:0}],I=Object(a.createContext)(void 0);function T(e){var t=e.children,n=C(),c=n.authenticated,l=n.user,o=Object(a.useState)(void 0),u=Object(m.a)(o,2),i=u[0],s=u[1],f=Object(a.useState)(void 0),d=Object(m.a)(f,2),p=d[0],v=d[1],b=Object(a.useState)(!0),E=Object(m.a)(b,2),h=E[0],g=E[1],O=p?p.length:0;return Object(a.useEffect)((function(){c&&A(l.id).then((function(e){v(e.filter((function(e){return!0===e.in}))),s(e)})).catch((function(e){return console.log(e)}))}),[c,l]),r.a.createElement(I.Provider,{value:{players:i,setPlayers:s,blankPlayer:{name:"",tank:!1,healer:!1,dps:!1,locked:!1,in:!1},inGroup:p,setInGroup:v,removePlayer:function(e){R(e,i).then((function(e){return s(e)})).catch((function(e){return console.log(e)}))},updatePlayer:function(e){S(e,i).then((function(e){return s(e)})).catch((function(e){return console.log(e)}))},addPlayer:function(e){P(e,i,l.id).then((function(e){return s(e)})).catch((function(e){return console.log(e)}))},inGroupCount:O,showPlayers:h,toggleShowPlayers:function(){g(!h)}}},t)}var z=function(){return Object(a.useContext)(I)},D={dark:{primary:"#1a1a2e",secondary:"#16213e",accent:"#0f3460",textColor:"white",textAccent:"orange",backgroundColor:"#e94560",headerBackgroundColor:"#16213e",blockquoteColor:"#aaa"},light:{primary:"#1ca086",secondary:"rgba(0,0,0,0.08)",accent:"rgba(0,0,0,0.08)",textColor:"black",textAccent:"black",backgroundColor:"white",headerBackgroundColor:"#f6f6f6",blockquoteColor:"rgba(0,0,0,0.80)"},horde:{primary:"#781414",secondary:"#a2c6c9",accent:"#a2c6c9",textColor:"#303030",textAccent:"#303030",backgroundColor:"maroon",headerBackgroundColor:"#f6f6f6",blockquoteColor:"rgba(0,0,0,0.80)"},allience:{primary:"#1c3661",accent:"#1c3661",secondary:"#a2c6c9",textColor:"#303030",textAccent:"#303030",backgroundColor:"maroon",headerBackgroundColor:"#f6f6f6",blockquoteColor:"rgba(0,0,0,0.80)"}},H=function(e,t){e(t),function(e){for(var t in e)document.documentElement.style.setProperty("--".concat(t),e[t])}(t)},B=Object(a.createContext)(void 0),M=function(e){var t=e.children,n=Object(a.useState)("dark"),c=Object(m.a)(n,2),l=c[0],o=c[1],u=Object(a.useState)(D.dark),i=Object(m.a)(u,2),s=i[0],f=i[1];return Object(a.useEffect)((function(){H(f,D[l])}),[l]),r.a.createElement(B.Provider,{value:{themeName:l,setThemeName:o,theme:s}},t)},U=function(e){var t=e.component,n=e.path;return C().authenticated?r.a.createElement(f.b,{exact:!0,path:n,component:t}):r.a.createElement(f.a,{to:"/login"})};function V(){var e=C().logout,t=Object(f.g)();return r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"Are you sure you would like to log out?"),r.a.createElement("button",null,"No"),r.a.createElement("button",{onClick:function(){t.push("/"),e()}},"Yes"))}var q=function(){var e=Object(a.useState)(""),t=Object(m.a)(e,2),n=t[0],c=t[1],l=Object(a.useState)(""),o=Object(m.a)(l,2),u=o[0],i=o[1],s=Object(a.useState)(""),d=Object(m.a)(s,2),p=d[0],v=d[1],b=Object(a.useState)(!1),E=Object(m.a)(b,2),h=E[0],g=E[1],O=Object(a.useState)(!0),y=Object(m.a)(O,2),j=y[0],k=y[1],w=C(),N=w.login,x=w.register,S=w.error,P=w.authenticated;var R=function(){return r.a.createElement("div",{className:"form-errors"},r.a.createElement("div",null,S),r.a.createElement("div",null,!j&&h?"Passwords don't match":null))};return Object(a.useEffect)((function(){g(u===p)}),[u,p]),P?r.a.createElement(f.a,{to:"/"}):r.a.createElement("form",{className:"authenticate-form"},r.a.createElement("div",{className:"form-select"},r.a.createElement("div",{className:j?"selected":"not-selected",id:"login",onClick:function(){return k(!0)}},"Login"),r.a.createElement("div",{className:j?"not-selected":"selected",id:"register",onClick:function(){return k(!1)}},"Reigster")),r.a.createElement("div",{className:"form-item"},r.a.createElement("input",{className:"form-input",name:"email",value:n,type:"email",placeholder:"Email",required:!0,onChange:function(e){c(e.target.value)}})),r.a.createElement("div",{className:"form-item"},r.a.createElement("input",{className:"form-input",name:"password",value:u,type:"password",placeholder:"Password",required:!0,onChange:function(e){e.preventDefault(),i(e.target.value)}})),j?null:r.a.createElement("div",{className:"form-item"},r.a.createElement("input",{className:"form-input",name:"passwordConfirm",type:"password",autoComplete:"off",onChange:function(e){return v(e.target.value)},placeholder:"Confirm Password"})),r.a.createElement(R,null),r.a.createElement("div",{onClick:function(e){return e.preventDefault(),j?(N({email:n,password:u}),r.a.createElement(f.a,{to:"index"})):(x({email:n,password:u}),r.a.createElement(f.a,{to:"index"}))},className:"form-button"},"Submit"))};var G=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"404 not Found"),r.a.createElement("p",null,"Error: The Page you were looking for was not found"))},W=n(53),Y=n(47);function K(){return(K=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function J(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var $=r.a.createElement("path",{fill:"currentColor",d:"M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"}),Q=function(e){var t=e.svgRef,n=e.title,a=J(e,["svgRef","title"]);return r.a.createElement("svg",K({"aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"lock",className:"svg-inline--fa fa-lock fa-w-14",role:"img",viewBox:"0 0 448 512",ref:t},a),n?r.a.createElement("title",null,n):null,$)},X=r.a.forwardRef((function(e,t){return r.a.createElement(Q,K({svgRef:t},e))}));n.p;function Z(){return(Z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function ee(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var te=r.a.createElement("path",{fill:"currentColor",d:"M423.5 0C339.5.3 272 69.5 272 153.5V224H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48h-48v-71.1c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v80c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-80C576 68 507.5-.3 423.5 0z"}),ne=function(e){var t=e.svgRef,n=e.title,a=ee(e,["svgRef","title"]);return r.a.createElement("svg",Z({"aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"lock-open",className:"svg-inline--fa fa-lock-open fa-w-18",role:"img",viewBox:"0 0 576 512",ref:t},a),n?r.a.createElement("title",null,n):null,te)},ae=r.a.forwardRef((function(e,t){return r.a.createElement(ne,Z({svgRef:t},e))}));n.p;function re(){return(re=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function ce(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var le=r.a.createElement("path",{fill:"currentColor",d:"M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"}),oe=function(e){var t=e.svgRef,n=e.title,a=ce(e,["svgRef","title"]);return r.a.createElement("svg",re({"aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"dice",className:"svg-inline--fa fa-dice fa-w-20",role:"img",viewBox:"0 0 640 512",ref:t},a),n?r.a.createElement("title",null,n):null,le)},ue=r.a.forwardRef((function(e,t){return r.a.createElement(oe,re({svgRef:t},e))}));n.p;function ie(){return(ie=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function se(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var me=r.a.createElement("path",{fill:"currentColor",d:"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"}),fe=function(e){var t=e.svgRef,n=e.title,a=se(e,["svgRef","title"]);return r.a.createElement("svg",ie({"aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"trash",className:"delete-icon",role:"img",viewBox:"0 0 448 512",ref:t},a),n?r.a.createElement("title",null,n):null,me)},de=r.a.forwardRef((function(e,t){return r.a.createElement(fe,ie({svgRef:t},e))})),pe=(n.p,n(69)),ve=n.n(pe),be=n(70),Ee=n.n(be),he=n(71),ge=n.n(he),Oe=function(e){var t=e.player,n=z(),c=n.updatePlayer,l=n.removePlayer,o=Object(a.useState)(t),u=Object(m.a)(o,2),i=u[0],s=u[1],f=function(e,t){var n=Object(Y.a)(Object(Y.a)({},i),{},Object(W.a)({},e,t));s(n),c(n)},d=function(e){var t=e.active,n=e.source,a=e.type;return r.a.createElement(r.a.Fragment,null,r.a.createElement("img",{className:"image ".concat(t?"roles_active":"roles_inactive"),src:n,alt:"".concat(a," logo"),onClick:function(){f(a,!t)}}))};return Object(a.useEffect)((function(){s(t)}),[t]),r.a.createElement("div",{className:i.locked?"card-locked":"card"},r.a.createElement("div",{className:"card-locked-area",onClick:function(){return f("locked",!i.locked)}},i.locked?r.a.createElement(X,{className:"image locked"}):r.a.createElement(ae,{className:"image unlocked"})),r.a.createElement("div",{className:"card-head"},r.a.createElement("div",{className:"name"},i.name),r.a.createElement(de,{className:"image delete-icon",onClick:function(){return l(i.id)}})),r.a.createElement("div",{className:"card-body"},r.a.createElement(d,{active:i.tank,source:ve.a,type:"tank"}),r.a.createElement(d,{active:i.healer,source:ge.a,type:"healer"}),r.a.createElement(d,{active:i.dps,source:Ee.a,type:"dps"}),r.a.createElement(ue,{className:"image ".concat(i.in?"in-the-roll-active":"in-the-roll"),onClick:function(){return f("in",!i.in)}})))},ye=n(260),je=n(261),ke=function(){var e=z(),t=e.addPlayer,n=e.blankPlayer,c=Object(a.useState)(n),l=Object(m.a)(c,2),o=l[0],u=l[1],i=Object(a.useState)(!1),s=Object(m.a)(i,2),f=s[0],d=s[1],p=function(e,t){var n=Object(Y.a)(Object(Y.a)({},o),{},Object(W.a)({},e,t));u(n)};function v(){d(!f)}var b=function(e){var t=e.active,n=e.source,a=e.type;return r.a.createElement(r.a.Fragment,null,r.a.createElement("img",{className:"image ".concat(t?"roles_active":"roles_inactive"),src:n,alt:"".concat(a," logo"),onClick:function(){p(a,!t)}}))};return f?r.a.createElement("div",{className:"card"},"New Player",r.a.createElement("button",{onClick:function(){return v()}},"Cancel"),r.a.createElement("button",{onClick:function(){v(),t(o)}},"Save"),r.a.createElement("div",{className:"card-locked-area",onClick:function(){return p("locked",!o.locked)}},o.locked?r.a.createElement(X,{className:"image locked"}):r.a.createElement(ae,{className:"image unlocked"})),r.a.createElement("div",{className:"card-head"},r.a.createElement(ye.a,null,r.a.createElement(ye.a.Item,{label:"name",name:"name",rules:[{required:!0,message:"Please input this player's name."}]},r.a.createElement(je.a,{value:o.name,onChange:function(e){return u(Object(Y.a)(Object(Y.a)({},o),{},{name:e.target.value}))}})))),r.a.createElement("div",{className:"card-body"},r.a.createElement(b,{active:o.tank,source:ve.a,type:"tank"}),r.a.createElement(b,{active:o.healer,source:ge.a,type:"healer"}),r.a.createElement(b,{active:o.dps,source:Ee.a,type:"dps"}),r.a.createElement(ue,{className:"image ".concat(o.in?"in-the-roll-active":"in-the-roll"),onClick:function(){return p("in",!o.in)}}))):r.a.createElement("div",{className:"add-player",onClick:v,style:{height:"150px"}},r.a.createElement("div",{className:"add-player-button"},"Add Player"))},we=function(){var e=z(),t=e.players,n=e.showPlayers,a=function(){return t?r.a.createElement(r.a.Fragment,null,t.map((function(e){return r.a.createElement(Oe,{key:e.id.toString(),player:e})}))):null};return r.a.createElement("div",{className:n?"player-cards-open":"player-cards"},r.a.createElement(a,null),r.a.createElement(ke,null))},Ce=function(e,t){var n=t.filter((function(t){return!0===t[e]}));return Ne(n)},Ne=function(e){var t=e.filter((function(e){return!0===e.locked})),n=e.filter((function(e){return!1===e.locked}));return t.length>0?xe(t):xe(n)},xe=function(e){return e[Math.floor(Math.random()*e.length)]},Se=function(e,t){return t.filter((function(t){return t.id!==e.id}))},Pe=function(e){for(var t=e,n=[],a=1;a<=5;a++){var r=Ne(t);n.push(r),t=Se(r,t)}return{players:n,remaining:t}},Re=function(e){var t=e,n=Ce("tank",t);t=Se(n,t);var a=Ce("healer",t),r=function(e){for(var t=e,n=[],a=1;a<4;a++){var r=Ce("dps",t);n.push(r),t=Se(r,t)}return{players:t,newDPS:n}}(t=Se(a,t));return{tank:n,healer:a,dps:r.newDPS,remainder:r.players}},Ae=function(e){var t=e.players,n=e.header;return void 0===t?null:r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,n),t.map((function(e){return r.a.createElement("div",{key:e.name+10+e.id},e.name,", ")})))},Fe=function(){var e=Object(a.useState)(),t=Object(m.a)(e,2),n=t[0],c=t[1],l=Object(a.useState)(),o=Object(m.a)(l,2),u=o[0],i=o[1],s=Object(a.useState)(),f=Object(m.a)(s,2),d=f[0],p=f[1],v=Object(a.useState)(),b=Object(m.a)(v,2),E=b[0],h=b[1],g=Object(a.useState)(!1),O=Object(m.a)(g,2),y=O[0],j=O[1],k=z().inGroup,w=function(){var e=Re(k);c(e.tank),i(e.healer),h(e.dps),p(e.remainder)};return Object(a.useEffect)((function(){j(F(k))}),[k]),void 0===d?r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{disabled:!y,onClick:w},"Roll by Role!")):r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{disabled:!y,onClick:w},"Roll!"),r.a.createElement("div",null,void 0===n?null:r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"Tank: "),n.name),void 0===u?null:r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"Healer:"),u.name),r.a.createElement(Ae,{players:E,header:"Dps"}),r.a.createElement(Ae,{players:d,header:"Out of Current Roll"})))},_e=function(){var e=Object(a.useState)(),t=Object(m.a)(e,2),n=t[0],c=t[1],l=Object(a.useState)(),o=Object(m.a)(l,2),u=o[0],f=o[1],d=Object(a.useState)(!1),p=Object(m.a)(d,2),v=p[0],b=p[1],E=z(),h=E.inGroup,g=E.inGroupCount,O=function(){var e=Object(s.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Pe(h);case 2:t=e.sent,c(t.players),f(t.remaining);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){var e=g>=6;b(e)}),[h,g]),r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{disabled:!1===v,onClick:O},"FFA Roll!"),r.a.createElement(Ae,{players:n,header:"Players"}),r.a.createElement(Ae,{players:u,header:"Not in the roll"}))},Le=function(){var e=z(),t=e.inGroup,n=e.players,c=Object(a.useState)(0),l=Object(m.a)(c,2),o=l[0],u=l[1],i=Object(a.useState)(0),s=Object(m.a)(i,2),f=s[0],d=s[1],p=Object(a.useState)(0),v=Object(m.a)(p,2),b=v[0],E=v[1],h=Object(a.useState)(!1),g=Object(m.a)(h,2),O=g[0],y=g[1],j=function(){return t?r.a.createElement(r.a.Fragment,null,t.length>=6?null:r.a.createElement("li",null,"You must have at least 6 players or rolling is pointless")):null};return Object(a.useEffect)((function(){var e=_(n);u(e.tanks),d(e.dps),E(e.healers)}),[n]),Object(a.useEffect)((function(){y(F(t))}),[t]),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,"Number of Tanks: ",o),r.a.createElement("div",null,"Number of DPS: ",f),r.a.createElement("div",null,"Number of Healers: ",b),r.a.createElement("div",null,"This group is ",O?"valid":"invalid"),r.a.createElement("div",null,r.a.createElement(j,null),o>0?null:r.a.createElement("li",null,"You must have at least 1 tank"),b>0?null:r.a.createElement("li",null,"You must have at least 1 healer"),f>2?null:r.a.createElement("li",null,"You must have at least 3 DPS")))},Ie=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(Le,null),r.a.createElement(Fe,null),r.a.createElement(_e,null))},Te=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(we,null),r.a.createElement(Ie,null))};function ze(){return r.a.createElement("div",{className:"content"},r.a.createElement(f.d,null,r.a.createElement(U,{path:"/logout",component:V}),r.a.createElement(f.b,{path:"/login",component:q}),r.a.createElement(U,{path:"/",component:Te}),r.a.createElement(f.b,{path:"/options"}),r.a.createElement(f.b,{component:G})))}var De=function(e){var t=e.route,n=e.name;return r.a.createElement(o.b,{exact:!0,to:t,isActive:function(){return e=t,window.location.pathname==="".concat(e);var e},className:"li Nav-Item",activeClassName:"li Nav-Item-Active"},n)},He=function(){var e=C().authenticated,t=z().toggleShowPlayers,n=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",{className:"Title"},e?r.a.createElement(De,{route:"/",name:"Roll Me In"}):"Roll Me In"),r.a.createElement("div",{className:"players-button",onClick:t},"Players"))},a=function(){return e?r.a.createElement(r.a.Fragment,null,r.a.createElement(De,{route:"/options",name:"Options"}),r.a.createElement(De,{route:"/logout",name:"Logout"})):r.a.createElement(r.a.Fragment,null,r.a.createElement(De,{route:"/login",name:"Login"}))};return r.a.createElement("div",{className:"Nav-Bar"},r.a.createElement("div",{className:"Left"},r.a.createElement(n,null)),r.a.createElement("div",{className:"Right"},r.a.createElement(a,null)))};function Be(){return r.a.createElement("p",null,"Footer")}var Me=function(){return r.a.createElement(M,null,r.a.createElement("div",{className:"app"},r.a.createElement(o.a,null,r.a.createElement(w,null,r.a.createElement(T,null,r.a.createElement(He,null),r.a.createElement(ze,null),r.a.createElement(Be,null))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(256),n(257);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Me,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},69:function(e,t,n){e.exports=n.p+"static/media/TANK.5a9eb1ec.png"},70:function(e,t,n){e.exports=n.p+"static/media/DPS.9346b097.png"},71:function(e,t,n){e.exports=n.p+"static/media/HEALER.8126c603.png"}},[[132,1,2]]]);
//# sourceMappingURL=main.3d37db29.chunk.js.map