const methods_obj = {
    hoveringElements: [],
    getElementFromDom: function() {
    
        let elementDomSelector = null; // query selector value
        let dragElement = null; // DOM element
        var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
        // Previous dom, that we want to track, so we can remove the previous styling.
        var prevDOM = null;
    
    
        document.addEventListener('click', handleUserClick);
        document.addEventListener('mousemove', handleUserSelectionMove, false);
    
    
        function handleUserClick(e) {
            // console.log("path: ", cssFinder(e.target, {
            //     seedMinLength: 3,
            //     optimizedMinLength: 1,
            // }));
            
            elementDomSelector = cssFinder(e.target, {
                seedMinLength: 3,
                optimizedMinLength: 1,
            })

            dragElement = document.querySelector(elementDomSelector);
    
            chrome.runtime.sendMessage({'userElement': elementDomSelector}, (response) => {
                if (chrome.runtime.lastError) {
                    // lastError needs to be checked, otherwise Chrome may throw an error
                    console.log(chrome.runtime.lastError);
                }
                // console.log("response ", response);
            });

            prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);

            methods_obj.hoveringElements.push(dragElement);
            methods_obj.floatAllElements();

            document.removeEventListener('click', handleUserClick);
            document.removeEventListener('mousemove', handleUserSelectionMove, false);
        }
    
    
        function handleUserSelectionMove(e) {
            let srcElement = e.target;
    
            // For NPE checking, we check safely. We need to remove the class name
            // Since we will be styling the new one after.
            if (prevDOM != null) {
                prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
            }
    
            // Add a visited class name to the element. So we can style it.
            srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
    
            // The current element is now the previous. So we can remove the class
            // during the next iteration.
            prevDOM = srcElement;
        }
    },
    floatAllElements: function() {
        for(let i = 0; i < methods_obj.hoveringElements.length; i++){
            methods_obj.floatElement(methods_obj.hoveringElements[i]);
        }
    },
    floatElement: function(elem) {

        let bodyElement = document.querySelector('body');
        // let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // making element direct child of body to get rid of any positioning problems
        methods_obj.moveElemUnderAnotherParent(bodyElement, elem);

        elem.addEventListener('mousedown', handleElemMouseDown);
        document.addEventListener('mouseup', handleDocMouseUp);

        function handleElemMouseDown(e) {
            e = e || window.event;
            // pos3 = e.clientX;
            // pos4 = e.clientY;
            document.addEventListener('mousemove', handleDocMouseMove);
        }

        function handleDocMouseMove(e){
            e = e || window.event;
            bodyElement.classList.add('disable-text-select')
            let x = e.pageX;
            let y = e.pageY;
            elem.style.left = (x) + "px";
            elem.style.top = (y) + "px";
        }


        function handleDocMouseUp(e){
            e = e || window.event;
            bodyElement.classList.remove('disable-text-select')
            document.removeEventListener('mousemove', handleDocMouseMove);
        }
    },
    moveElemUnderAnotherParent: function(newParent, elem) {

        prevPosX = methods_obj.getOffset(elem).left;
        prevPosY = methods_obj.getOffset(elem).top;
        
        newParent.prepend(elem);
        elem.style.position = "absolute";
        elem.style.top = prevPosY + "px";
        elem.style.left = prevPosX + "px";
        elem.style.boxShadow = "15px 15px 20px rgba(0, 0, 0, 0.2)";
        elem.style.border = "1px solid black";
        elem.style.background = "rgba(250, 250, 255, 0.5)";
        elem.style.zIndex = "99999";
        
    },
    getOffset: function ( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    },
}

const cssFinder = function() {function e(e,t){if(e.nodeType!==Node.ELEMENT_NODE)throw new Error("Can't generate CSS selector for non-element node type.");if("html"===e.tagName.toLowerCase())return e.tagName.toLowerCase();var o={root:document.body,className:function(e){return!0},tagName:function(e){return!0},seedMinLength:1,optimizedMinLength:2,threshold:1e3};T=b({},o,t);var a=n(e,x.All,function(){return n(e,x.Two,function(){return n(e,x.One)})});if(a){var i=g(m(a,e));return i.length>0&&(a=i[0]),r(a)}throw new Error("Selector was not found.")}function n(e,n,r){for(var o=null,a=[],v=e,d=0,g=function(){var e=p(i(v))||p.apply(void 0,l(v))||p(u(v))||[c()],g=s(v);if(n===x.All)g&&(e=e.concat(e.filter(h).map(function(e){return f(e,g)})));else if(n===x.Two)e=e.slice(0,1),g&&(e=e.concat(e.filter(h).map(function(e){return f(e,g)})));else if(n===x.One){var m=(e=e.slice(0,1))[0];g&&h(m)&&(e=[f(m,g)])}for(var y=0,b=e;y<b.length;y++){var m=b[y];m.level=d}return a.push(e),a.length>=T.seedMinLength&&(o=t(a,r))?"break":(v=v.parentElement,void d++)};v&&v!==T.root.parentElement;){var m=g();if("break"===m)break}return o||(o=t(a,r)),o}function t(e,n){var t=g(d(e));if(t.length>T.threshold)return n?n():null;for(var r=0,o=t;r<o.length;r++){var i=o[r];if(a(i))return i}return null}function r(e){for(var n=e[0],t=n.name,r=1;r<e.length;r++){var o=e[r].level||0;t=n.level===o-1?e[r].name+" > "+t:e[r].name+" "+t,n=e[r]}return t}function o(e){return e.map(function(e){return e.penalty}).reduce(function(e,n){return e+n},0)}function a(e){switch(document.querySelectorAll(r(e)).length){case 0:throw new Error("Can't select any node with this selector: "+r(e));case 1:return!0;default:return!1}}function i(e){return""!==e.id?{name:"#"+_(e.id,{isIdentifier:!0}),penalty:0}:null}function l(e){var n=Array.from(e.classList).filter(T.className);return n.map(function(e){return{name:"."+_(e,{isIdentifier:!0}),penalty:1}})}function u(e){var n=e.tagName.toLowerCase();return T.tagName(n)?{name:n,penalty:2}:null}function c(){return{name:"*",penalty:3}}function s(e){var n=e.parentNode;if(!n)return null;var t=n.firstChild;if(!t)return null;for(var r=0;;){if(t.nodeType===Node.ELEMENT_NODE&&r++,t===e||!t.nextSibling)break;t=t.nextSibling}return r}function f(e,n){return{name:e.name+(":nth-child("+n+")"),penalty:e.penalty+1}}function h(e){return"html"!==e.name&&!e.name.startsWith("#")}function p(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=e.filter(v);return t.length>0?t:null}function v(e){return null!==e&&void 0!==e}function d(e,n){void 0===n&&(n=[]);var t,r,o;return w(this,function(a){switch(a.label){case 0:if(!(e.length>0))return[3,5];t=0,r=e[0],a.label=1;case 1:return t<r.length?(o=r[t],[5,E(d(e.slice(1,e.length),n.concat(o)))]):[3,4];case 2:a.sent(),a.label=3;case 3:return t++,[3,1];case 4:return[3,7];case 5:return[4,n];case 6:a.sent(),a.label=7;case 7:return[2]}})}function g(e){return Array.from(e).sort(function(e,n){return o(e)-o(n)})}function m(e,n){var t,r;return w(this,function(o){switch(o.label){case 0:if(!(e.length>2&&e.length>T.optimizedMinLength))return[3,5];t=1,o.label=1;case 1:return t<e.length-1?(r=e.slice(),r.splice(t,1),a(r)&&y(r,n)?[4,r]:[3,4]):[3,5];case 2:return o.sent(),[5,E(m(r,n))];case 3:o.sent(),o.label=4;case 4:return t++,[3,1];case 5:return[2]}})}function y(e,n){return document.querySelector(r(e))===n}var b=this&&this.__assign||Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++){n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},w=this&&this.__generator||function(e,n){function t(e){return function(n){return r([e,n])}}function r(t){if(o)throw new TypeError("Generator is already executing.");for(;u;)try{if(o=1,a&&(i=a[2&t[0]?"return":t[0]?"throw":"next"])&&!(i=i.call(a,t[1])).done)return i;switch(a=0,i&&(t=[0,i.value]),t[0]){case 0:case 1:i=t;break;case 4:return u.label++,{value:t[1],done:!1};case 5:u.label++,a=t[1],t=[0];continue;case 7:t=u.ops.pop(),u.trys.pop();continue;default:if(i=u.trys,!(i=i.length>0&&i[i.length-1])&&(6===t[0]||2===t[0])){u=0;continue}if(3===t[0]&&(!i||t[1]>i[0]&&t[1]<i[3])){u.label=t[1];break}if(6===t[0]&&u.label<i[1]){u.label=i[1],i=t;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(t);break}i[2]&&u.ops.pop(),u.trys.pop();continue}t=n.call(e,u)}catch(e){t=[6,e],a=0}finally{o=i=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}var o,a,i,l,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return l={next:t(0),throw:t(1),return:t(2)},"function"==typeof Symbol&&(l[Symbol.iterator]=function(){return this}),l},E=this&&this.__values||function(e){var n="function"==typeof Symbol&&e[Symbol.iterator],t=0;return n?n.call(e):{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}}},N={},S=N.hasOwnProperty,A=function(e,n){if(!e)return n;var t={};for(var r in n)t[r]=S.call(e,r)?e[r]:n[r];return t},C=/[ -,\.\/;-@\[-\^`\{-~]/,L=/[ -,\.\/;-@\[\]\^`\{-~]/,O=/(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,_=function e(n,t){t=A(t,e.options),"single"!=t.quotes&&"double"!=t.quotes&&(t.quotes="single");for(var r="double"==t.quotes?'"':"'",o=t.isIdentifier,a=n.charAt(0),i="",l=0,u=n.length;l<u;){var c=n.charAt(l++),s=c.charCodeAt(),f=void 0;if(s<32||s>126){if(s>=55296&&s<=56319&&l<u){var h=n.charCodeAt(l++);56320==(64512&h)?s=((1023&s)<<10)+(1023&h)+65536:l--}f="\\"+s.toString(16).toUpperCase()+" "}else f=t.escapeEverything?C.test(c)?"\\"+c:"\\"+s.toString(16).toUpperCase()+" ":/[\t\n\f\r\x0B:]/.test(c)?o||":"!=c?"\\"+s.toString(16).toUpperCase()+" ":c:"\\"==c||!o&&('"'==c&&r==c||"'"==c&&r==c)||o&&L.test(c)?"\\"+c:c;i+=f}return o&&(/^_/.test(i)?i="\\_"+i.slice(1):/^-[-\d]/.test(i)?i="\\-"+i.slice(1):/\d/.test(a)&&(i="\\3"+a+" "+i.slice(1))),i=i.replace(O,function(e,n,t){return n&&n.length%2?e:(n||"")+t}),!o&&t.wrap?r+i+r:i};_.options={escapeEverything:!1,isIdentifier:!1,quotes:"single",wrap:!1},_.version="1.0.1";var x;!function(e){e[e.All=0]="All",e[e.Two=1]="Two",e[e.One=2]="One"}(x||(x={}));var T;return e}();