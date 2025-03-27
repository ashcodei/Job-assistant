/*! For license information please see content.js.LICENSE.txt */
(()=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function n(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?t(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):t(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function r(t,n,r){return(n=function(t){var n=function(t){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!=e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(n)?n:n+""}(n))in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t}function o(){"use strict";o=function(){return n};var t,n={},r=Object.prototype,i=r.hasOwnProperty,a=Object.defineProperty||function(e,t,n){e[t]=n.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",l=s.asyncIterator||"@@asyncIterator",u=s.toStringTag||"@@toStringTag";function d(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{d({},"")}catch(t){d=function(e,t,n){return e[t]=n}}function f(e,t,n,r){var o=t&&t.prototype instanceof y?t:y,i=Object.create(o.prototype),s=new B(r||[]);return a(i,"_invoke",{value:I(e,n,s)}),i}function h(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}n.wrap=f;var p="suspendedStart",v="suspendedYield",b="executing",m="completed",g={};function y(){}function w(){}function j(){}var L={};d(L,c,(function(){return this}));var x=Object.getPrototypeOf,E=x&&x(x(N([])));E&&E!==r&&i.call(E,c)&&(L=E);var k=j.prototype=y.prototype=Object.create(L);function O(e){["next","throw","return"].forEach((function(t){d(e,t,(function(e){return this._invoke(t,e)}))}))}function S(t,n){function r(o,a,s,c){var l=h(t[o],t,a);if("throw"!==l.type){var u=l.arg,d=u.value;return d&&"object"==e(d)&&i.call(d,"__await")?n.resolve(d.__await).then((function(e){r("next",e,s,c)}),(function(e){r("throw",e,s,c)})):n.resolve(d).then((function(e){u.value=e,s(u)}),(function(e){return r("throw",e,s,c)}))}c(l.arg)}var o;a(this,"_invoke",{value:function(e,t){function i(){return new n((function(n,o){r(e,t,n,o)}))}return o=o?o.then(i,i):i()}})}function I(e,n,r){var o=p;return function(i,a){if(o===b)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(r.method=i,r.arg=a;;){var s=r.delegate;if(s){var c=P(s,r);if(c){if(c===g)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===p)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=b;var l=h(e,n,r);if("normal"===l.type){if(o=r.done?m:v,l.arg===g)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=m,r.method="throw",r.arg=l.arg)}}}function P(e,n){var r=n.method,o=e.iterator[r];if(o===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,P(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=h(o,e.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,g;var a=i.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function T(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function A(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function B(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(T,this),this.reset(!0)}function N(n){if(n||""===n){var r=n[c];if(r)return r.call(n);if("function"==typeof n.next)return n;if(!isNaN(n.length)){var o=-1,a=function e(){for(;++o<n.length;)if(i.call(n,o))return e.value=n[o],e.done=!1,e;return e.value=t,e.done=!0,e};return a.next=a}}throw new TypeError(e(n)+" is not iterable")}return w.prototype=j,a(k,"constructor",{value:j,configurable:!0}),a(j,"constructor",{value:w,configurable:!0}),w.displayName=d(j,u,"GeneratorFunction"),n.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,j):(e.__proto__=j,d(e,u,"GeneratorFunction")),e.prototype=Object.create(k),e},n.awrap=function(e){return{__await:e}},O(S.prototype),d(S.prototype,l,(function(){return this})),n.AsyncIterator=S,n.async=function(e,t,r,o,i){void 0===i&&(i=Promise);var a=new S(f(e,t,r,o),i);return n.isGeneratorFunction(t)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},O(k),d(k,u,"Generator"),d(k,c,(function(){return this})),d(k,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},n.values=N,B.prototype={constructor:B,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(A),!e)for(var n in this)"t"===n.charAt(0)&&i.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function r(r,o){return s.type="throw",s.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=e,a.arg=t,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),A(n),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;A(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:N(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},n}function i(e,t,n,r,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void n(e)}s.done?t(c):Promise.resolve(c).then(r,o)}function a(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function s(e){i(a,r,o,s,c,"next",e)}function c(e){i(a,r,o,s,c,"throw",e)}s(void 0)}))}}var s=!1,c=null,l=[],u=!1,d={x:20,y:100},f=function(){var e=a(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,chrome.storage.local.get(["isAuthenticated","userProfile"]);case 3:t=e.sent,s=t.isAuthenticated||!1,c=t.userProfile||null,s&&h(),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.error("Error loading auth status:",e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),h=function(){p()>60&&(console.log("Job application form detected!"),b(),g())},p=function(){var e=0;document.querySelectorAll("form").length>0&&(e+=20);var t=document.body.innerText.toLowerCase(),n=window.location.href.toLowerCase();["application","apply","job","career","employment","resume","cv","work history","experience","education","skills"].forEach((function(r){n.includes(r)&&(e+=5),t.includes(r)&&(e+=2)}));var r=0;return Object.values({name:["name","full name","first name","last name"],email:["email","e-mail"],phone:["phone","telephone","mobile"],education:["education","degree","university","college","school"],experience:["experience","work history","employment"]}).forEach((function(e){var t=Array.from(document.querySelectorAll("input, textarea, select"));e.forEach((function(e){t.some((function(t){var n,o,i,a,s=(null===(n=v(t))||void 0===n?void 0:n.toLowerCase())||"",c=(null===(o=t.placeholder)||void 0===o?void 0:o.toLowerCase())||"",l=(null===(i=t.id)||void 0===i?void 0:i.toLowerCase())||"",u=(null===(a=t.name)||void 0===a?void 0:a.toLowerCase())||"";return!!(s.includes(e)||c.includes(e)||l.includes(e)||u.includes(e))&&(r++,!0)}))}))})),e+=5*r},v=function(e){if(e.id){var t=document.querySelector('label[for="'.concat(e.id,'"]'));if(t)return t.textContent}var n=e.parentElement;if(n&&"LABEL"===n.tagName)return n.textContent;var r=e.previousElementSibling;return r&&"LABEL"===r.tagName?r.textContent:null},b=function(){var e=a(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select')),(l=t.map((function(e,t){var n,r=(null===(n=v(e))||void 0===n?void 0:n.trim())||"",o=e.placeholder||"",i=e.id||"",a=e.name||"",s=e.type||e.tagName.toLowerCase();return{id:t,element:e,elementId:i,elementName:a,fieldType:s,label:r,placeholder:o,fieldName:r||o||a||i,value:e.value||"",aiSuggestion:"",confidenceLevel:"red",requiredField:e.required}})).filter((function(e){return e.fieldName}))).length>0&&s&&m();case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),m=function(){var e=a(o().mark((function e(){var t,r,i,a,s;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={url:window.location.href,title:document.title,fields:l.map((function(e){return{fieldId:e.id,fieldName:e.fieldName,fieldType:e.fieldType,label:e.label,placeholder:e.placeholder,required:e.requiredField}}))},e.next=4,chrome.storage.local.get(["authToken"]);case 4:if(r=e.sent,i=r.authToken){e.next=8;break}throw new Error("Authentication token not found");case 8:return e.next=10,fetch("http://localhost:3000/api/suggestions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(i)},body:JSON.stringify(t)});case 10:if((a=e.sent).ok){e.next=13;break}throw new Error("Failed to get AI suggestions");case 13:return e.next=15,a.json();case 15:s=e.sent,l=l.map((function(e){var t=s.fields.find((function(t){return t.fieldId===e.id}));return t?n(n({},e),{},{aiSuggestion:t.value||"",confidenceLevel:t.confidence||"red"}):e})),u&&x(),e.next=23;break;case 20:e.prev=20,e.t0=e.catch(0),console.error("Error getting AI suggestions:",e.t0);case 23:case"end":return e.stop()}}),e,null,[[0,20]])})));return function(){return e.apply(this,arguments)}}(),g=function(){if(!document.getElementById("jobsai-bubble")){var e=chrome.runtime.getURL("sidebar/sidebar.html");fetch(e).then((function(e){return e.text()})).then((function(e){var t=(new DOMParser).parseFromString(e,"text/html").getElementById("jobsai-bubble-template");if(t){var n=t.querySelector(".jobsai-bubble").cloneNode(!0);n.id="jobsai-bubble",chrome.storage.sync.get("settings",(function(e){var t=e.settings||{};chrome.storage.local.get(["bubblePosition"],(function(e){var r=y(t.bubblePosition||"bottom-left"),o=e.bubblePosition||r;n.style.left="".concat(o.x,"px"),n.style.top="".concat(o.y,"px"),n.addEventListener("click",j),w(n),document.body.appendChild(n)}))}))}})).catch((function(e){console.error("Error loading sidebar template:",e);var t=document.createElement("div");t.id="jobsai-bubble",t.classList.add("jobsai-bubble"),chrome.storage.local.get(["bubblePosition"],(function(e){var n=e.bubblePosition||d;t.style.left="".concat(n.x,"px"),t.style.top="".concat(n.y,"px")})),t.innerHTML='\n        <div class="jobsai-bubble-icon">\n          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFF" />\n          </svg>\n        </div>\n        <div class="jobsai-bubble-tooltip">JobsAI Assistant</div>\n      ',t.addEventListener("click",j),w(t),document.body.appendChild(t)}))}},y=function(e){var t=window.innerWidth,n=window.innerHeight;switch(e){case"top-left":return{x:20,y:20};case"top-right":return{x:t-70,y:20};case"bottom-right":return{x:t-70,y:n-70};default:return{x:20,y:n-70}}},w=function(e){var t=0,n=0,r=0,o=0;function i(i){i.preventDefault(),t=r-i.clientX,n=o-i.clientY,r=i.clientX,o=i.clientY,e.style.top=e.offsetTop-n+"px",e.style.left=e.offsetLeft-t+"px"}function a(){document.onmouseup=null,document.onmousemove=null,e.classList.remove("dragging");var t={x:parseInt(e.style.left),y:parseInt(e.style.top)};chrome.storage.local.set({bubblePosition:t})}e.onmousedown=function(t){t.preventDefault(),r=t.clientX,o=t.clientY,document.onmouseup=a,document.onmousemove=i,e.classList.add("dragging")}},j=function(){var e=document.getElementById("jobsai-sidebar");e?e.classList.contains("open")?(e.classList.remove("open"),setTimeout((function(){e.remove(),u=!1}),300)):(e.classList.add("open"),u=!0,x()):chrome.storage.sync.get("settings",(function(e){var t=(e.settings||{}).sidebarWidth||320,n=chrome.runtime.getURL("sidebar/sidebar.html");fetch(n).then((function(e){return e.text()})).then((function(e){var n=(new DOMParser).parseFromString(e,"text/html").getElementById("jobsai-sidebar-template");if(n){var r=n.querySelector(".jobsai-sidebar").cloneNode(!0);r.id="jobsai-sidebar",r.style.width="".concat(t,"px"),document.body.appendChild(r),document.getElementById("jobsai-sidebar-close").addEventListener("click",j),setTimeout((function(){r.classList.add("open")}),10),u=!0,x()}})).catch((function(e){console.error("Error loading sidebar template:",e),L()}))}))},L=function(){var e=document.createElement("div");e.id="jobsai-sidebar",e.classList.add("jobsai-sidebar"),e.innerHTML='\n    <div class="jobsai-sidebar-header">\n      <div class="jobsai-sidebar-title">\n        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4F46E5" />\n        </svg>\n        <h2>JobsAI Assistant</h2>\n      </div>\n      <button id="jobsai-sidebar-close" class="jobsai-sidebar-close-btn">\n        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n          <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n        </svg>\n      </button>\n    </div>\n    <div class="jobsai-sidebar-content">\n      <div class="jobsai-loading">\n        <div class="jobsai-spinner"></div>\n        <p>Analyzing form fields...</p>\n      </div>\n    </div>\n  ',document.body.appendChild(e),document.getElementById("jobsai-sidebar-close").addEventListener("click",j),setTimeout((function(){e.classList.add("open")}),10),u=!0,x()},x=function(){var e,t,n,r=document.getElementById("jobsai-sidebar");if(r){var o=r.querySelector(".jobsai-sidebar-content");if(0!==l.length){if(!s)return o.innerHTML='\n      <div class="jobsai-message">\n        <p>Please sign in to use JobsAI Assistant</p>\n        <button id="jobsai-login-btn" class="jobsai-btn">Sign In</button>\n      </div>\n    ',void document.getElementById("jobsai-login-btn").addEventListener("click",(function(){chrome.runtime.sendMessage({action:"openLogin"})}));var i="";l.forEach((function(e){var t="";switch(e.confidenceLevel){case"green":t='<span class="confidence-indicator high">✓</span>';break;case"yellow":t='<span class="confidence-indicator medium">⚠️</span>';break;default:t='<span class="confidence-indicator low">✗</span>'}i+='\n      <div class="jobsai-field-item" data-field-id="'.concat(e.id,'">\n        <div class="jobsai-field-header">\n          <div class="jobsai-field-title">\n            ').concat(t,"\n            <h3>").concat(e.fieldName,"</h3>\n            ").concat(e.requiredField?'<span class="required-badge">Required</span>':"",'\n          </div>\n          <div class="jobsai-field-actions">\n            <button class="jobsai-goto-btn" data-field-id="').concat(e.id,'">\n              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M8 2V14M8 2L4 6M8 2L12 6" stroke="#4F46E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n              </svg>\n            </button>\n          </div>\n        </div>\n        <div class="jobsai-field-content">\n          <div class="jobsai-suggestion-input">\n            <textarea class="jobsai-suggestion-textarea" data-field-id="').concat(e.id,'">').concat(e.aiSuggestion||"",'</textarea>\n            <div class="jobsai-suggestion-actions">\n              <button class="jobsai-apply-btn" data-field-id="').concat(e.id,'">Apply</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ')}));var a=l.filter((function(e){return"green"===e.confidenceLevel})).length,u=l.filter((function(e){return"yellow"===e.confidenceLevel})).length,d=l.filter((function(e){return"red"===e.confidenceLevel})).length,f='\n    <div class="jobsai-stats">\n      <div class="jobsai-stats-item green">\n        <span class="jobsai-stats-count">'.concat(a,'</span>\n        <span class="jobsai-stats-label">Auto-filled</span>\n      </div>\n      <div class="jobsai-stats-item yellow">\n        <span class="jobsai-stats-count">').concat(u,'</span>\n        <span class="jobsai-stats-label">Needs review</span>\n      </div>\n      <div class="jobsai-stats-item red">\n        <span class="jobsai-stats-count">').concat(d,'</span>\n        <span class="jobsai-stats-label">Manual input</span>\n      </div>\n    </div>\n  ');o.innerHTML='\n    <div class="jobsai-user-info">\n      <div class="jobsai-user-avatar">\n        '.concat((null===(e=c)||void 0===e||null===(e=e.name)||void 0===e?void 0:e.charAt(0))||"U",'\n      </div>\n      <div class="jobsai-user-details">\n        <p class="jobsai-user-name">').concat((null===(t=c)||void 0===t?void 0:t.name)||"User",'</p>\n        <p class="jobsai-user-email">').concat((null===(n=c)||void 0===n?void 0:n.email)||"","</p>\n      </div>\n    </div>\n    \n    ").concat(f,'\n    \n    <div class="jobsai-field-list">\n      ').concat(i,'\n    </div>\n    \n    <div class="jobsai-footer">\n      <button id="jobsai-apply-all-btn" class="jobsai-btn jobsai-btn-primary">Apply All</button>\n    </div>\n  '),document.querySelectorAll(".jobsai-goto-btn").forEach((function(e){e.addEventListener("click",(function(e){var t=parseInt(e.currentTarget.dataset.fieldId);E(t)}))})),document.querySelectorAll(".jobsai-apply-btn").forEach((function(e){e.addEventListener("click",(function(e){var t=parseInt(e.currentTarget.dataset.fieldId);k(t)}))})),document.querySelectorAll(".jobsai-suggestion-textarea").forEach((function(e){e.addEventListener("input",(function(e){var t=parseInt(e.target.dataset.fieldId);O(t,e.target.value)}))})),document.getElementById("jobsai-apply-all-btn").addEventListener("click",S)}else o.innerHTML='\n      <div class="jobsai-message">\n        <p>No form fields detected on this page.</p>\n      </div>\n    '}},E=function(e){var t=l.find((function(t){return t.id===e}));t&&t.element&&(t.element.scrollIntoView({behavior:"smooth",block:"center"}),t.element.classList.add("jobsai-highlight"),setTimeout((function(){t.element.classList.remove("jobsai-highlight")}),2e3),t.element.focus())},k=function(e){var t=l.find((function(t){return t.id===e}));if(t&&t.element){t.element.value=t.aiSuggestion;var n=new Event("input",{bubbles:!0});t.element.dispatchEvent(n);var r=new Event("change",{bubbles:!0});t.element.dispatchEvent(r),t.element.classList.add("jobsai-applied"),setTimeout((function(){t.element.classList.remove("jobsai-applied")}),2e3)}},O=function(e,t){var n=l.findIndex((function(t){return t.id===e}));-1!==n&&(l[n].aiSuggestion=t,I(e,t))},S=function(){l.forEach((function(e){if(e.aiSuggestion){e.element.value=e.aiSuggestion;var t=new Event("input",{bubbles:!0});e.element.dispatchEvent(t);var n=new Event("change",{bubbles:!0});e.element.dispatchEvent(n)}}));var e=document.getElementById("jobsai-sidebar");if(e){var t=document.createElement("div");t.classList.add("jobsai-success-message"),t.textContent="All fields applied successfully!",e.appendChild(t),setTimeout((function(){t.classList.add("show")}),10),setTimeout((function(){t.classList.remove("show"),setTimeout((function(){t.remove()}),300)}),3e3)}},I=function(){var e=a(o().mark((function e(t,n){var r,i,a;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,r=l.find((function(e){return e.id===t}))){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,chrome.storage.local.get(["authToken"]);case 6:if(i=e.sent,a=i.authToken){e.next=10;break}throw new Error("Authentication token not found");case 10:return e.next=12,fetch("http://localhost:3000/api/feedback",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(a)},body:JSON.stringify({url:window.location.href,fieldId:t,fieldName:r.fieldName,originalSuggestion:r.aiSuggestion,userCorrection:n})});case 12:if(e.sent.ok){e.next=15;break}throw new Error("Failed to send feedback");case 15:e.next=20;break;case 17:e.prev=17,e.t0=e.catch(0),console.error("Error sending feedback:",e.t0);case 20:case"end":return e.stop()}}),e,null,[[0,17]])})));return function(t,n){return e.apply(this,arguments)}}();chrome.runtime.onMessage.addListener((function(e,t,n){switch(e.action){case"authStatusChanged":f(),n({success:!0});break;case"settingsUpdated":P(e.settings),n({success:!0})}return!0}));var P=function(e){if(e&&e.hasOwnProperty("enableExtension")&&!e.enableExtension){var t=document.getElementById("jobsai-bubble");t&&t.remove();var n=document.getElementById("jobsai-sidebar");return n&&n.remove(),void(u=!1)}if(e&&e.hasOwnProperty("sidebarWidth")){var r=document.getElementById("jobsai-sidebar");r&&(r.style.width="".concat(e.sidebarWidth,"px"))}if(e&&e.hasOwnProperty("showBubble")){var o=document.getElementById("jobsai-bubble");e.showBubble&&!o&&s?g():!e.showBubble&&o&&o.remove()}};document.addEventListener("DOMContentLoaded",(function(){f()})),f()})();