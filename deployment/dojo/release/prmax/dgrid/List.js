//>>built
define("dgrid/List",["dojo/_base/kernel","dojo/_base/declare","dojo/dom","dojo/on","dojo/has","./util/misc","dojo/has!touch?./TouchScroll","xstyle/has-class","put-selector/put","dojo/_base/sniff","xstyle/css!./css/dgrid.css"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){_8("mozilla","opera","webkit","ie","ie-6","ie-6-7","quirks","no-quirks","touch");var _a="dgrid-row-odd",_b="dgrid-row-even",_c,_d;function _e(id){return document.getElementById(id);};function _f(_10){_10.className="";document.body.removeChild(_10);};function _11(_12,_13){_9(document.body,_12,".dgrid-scrollbar-measure");var _14=_12["offset"+_13]-_12["client"+_13];_f(_12);return _14;};_5.add("dom-scrollbar-width",function(_15,doc,_16){return _11(_16,"Width");});_5.add("dom-scrollbar-height",function(_17,doc,_18){return _11(_18,"Height");});_5.add("dom-rtl-scrollbar-left",function(_19,doc,_1a){var div=_9("div"),_1b;_9(document.body,_1a,".dgrid-scrollbar-measure[dir=rtl]");_9(_1a,div);_1b=!!_5("ie")||!!_5("trident")||div.offsetLeft>=_5("dom-scrollbar-width");_f(_1a);_9(div,"!");_1a.removeAttribute("dir");return _1b;});var _1c=0;function _1d(){return "dgrid_"+_1c++;};var _1e=/ +/g;function _1f(cls){var _20=cls?"."+cls.replace(_1e,"."):"";if(this._class){_20="!"+this._class.replace(_1e,"!")+_20;}_9(this.domNode,_20);this._class=cls;};function _21(){return this._class;};var _22=_5("ie")<7&&!_5("quirks")?function(){var _23,w,h,_24;if(!this._started){return;}_23=document.documentElement;w=_23.clientWidth;h=_23.clientHeight;_24=this._prevWinDims||[];if(_24[0]!==w||_24[1]!==h){this.resize();this._prevWinDims=[w,h];}}:function(){if(this._started){this.resize();}};function _25(){return {x:this.bodyNode.scrollLeft,y:this.bodyNode.scrollTop};};function _26(_27){if(typeof _27.x!=="undefined"){this.bodyNode.scrollLeft=_27.x;}if(typeof _27.y!=="undefined"){this.bodyNode.scrollTop=_27.y;}};return _2(_5("touch")?_7:null,{tabableHeader:false,showHeader:false,showFooter:false,maintainOddEven:true,cleanAddedRules:true,useTouchScroll:null,addUiClasses:true,cleanEmptyObservers:true,highlightDuration:250,postscript:function(_28,_29){var _2a=this;(this._Row=function(id,_2b,_2c){this.id=id;this.data=_2b;this.element=_2c;}).prototype.remove=function(){_2a.removeRow(this.element);};if(_29){this.srcNodeRef=_29=_29.nodeType?_29:_e(_29);}this.create(_28,_29);},listType:"list",create:function(_2d,_2e){var _2f=this.domNode=_2e||_9("div"),cls;if(_2d){this.params=_2d;_2.safeMixin(this,_2d);cls=_2d["class"]||_2d.className||_2f.className;this._sort=_2d.sort||[];delete this.sort;}else{this._sort=[];}this.observers=[];this._numObservers=0;this._listeners=[];this._rowIdToObject={};this.postMixInProperties&&this.postMixInProperties();this.id=_2f.id=_2f.id||this.id||_1d();if(this.useTouchScroll===null){this.useTouchScroll=!_5("dom-scrollbar-width");}this.buildRendering();if(cls){_1f.call(this,cls);}this.postCreate();delete this.srcNodeRef;if(this.domNode.offsetHeight){this.startup();}},buildRendering:function(){var _30=this.domNode,_31=this.addUiClasses,_32=this,_33,_34,_35,_36,_37;_37=this.isRTL=(document.body.dir||document.documentElement.dir||document.body.style.direction).toLowerCase()=="rtl";_30.className="";_9(_30,"[role=grid].dgrid.dgrid-"+this.listType+(_31?".ui-widget":""));_33=this.headerNode=_9(_30,"div.dgrid-header.dgrid-header-row"+(_31?".ui-widget-header":"")+(this.showHeader?"":".dgrid-header-hidden"));if(_5("quirks")||_5("ie")<8){_34=_9(_30,"div.dgrid-spacer");}_35=this.bodyNode=_9(_30,"div.dgrid-scroller");if(_5("ff")){_35.tabIndex=-1;}this.headerScrollNode=_9(_30,"div.dgrid-header.dgrid-header-scroll.dgrid-scrollbar-width"+(_31?".ui-widget-header":""));_36=this.footerNode=_9("div.dgrid-footer"+(this.showFooter?"":".dgrid-footer-hidden"));_9(_30,_36);if(_37){_30.className+=" dgrid-rtl"+(_5("dom-rtl-scrollbar-left")?" dgrid-rtl-swap":"");}_4(_35,"scroll",function(_38){if(_32.showHeader){_33.scrollLeft=_38.scrollLeft||_35.scrollLeft;}_38.stopPropagation();_4.emit(_30,"scroll",{scrollTarget:_35});});this.configStructure();this.renderHeader();this.contentNode=this.touchNode=_9(this.bodyNode,"div.dgrid-content"+(_31?".ui-widget-content":""));this._listeners.push(this._resizeHandle=_4(window,"resize",_6.throttleDelayed(_22,this)));},postCreate:_5("touch")?function(){if(this.useTouchScroll){this.inherited(arguments);}}:function(){},startup:function(){if(this._started){return;}this.inherited(arguments);this._started=true;this.resize();this.set("sort",this._sort);},configStructure:function(){},resize:function(){var _39=this.bodyNode,_3a=this.headerNode,_3b=this.footerNode,_3c=_3a.offsetHeight,_3d=this.showFooter?_3b.offsetHeight:0,_3e=_5("quirks")||_5("ie")<7;this.headerScrollNode.style.height=_39.style.marginTop=_3c+"px";_39.style.marginBottom=_3d+"px";if(_3e){_39.style.height="";_39.style.height=Math.max((this.domNode.offsetHeight-_3c-_3d),0)+"px";if(_3d){_3b.style.bottom="1px";setTimeout(function(){_3b.style.bottom="";},0);}}if(!_c){_c=_5("dom-scrollbar-width");_d=_5("dom-scrollbar-height");if(_5("ie")){_c++;_d++;}_6.addCssRule(".dgrid-scrollbar-width","width: "+_c+"px");_6.addCssRule(".dgrid-scrollbar-height","height: "+_d+"px");if(_c!=17&&!_3e){_6.addCssRule(".dgrid-header-row","right: "+_c+"px");_6.addCssRule(".dgrid-rtl-swap .dgrid-header-row","left: "+_c+"px");}}if(_3e){_3a.style.width=_39.clientWidth+"px";setTimeout(function(){_3a.scrollLeft=_39.scrollLeft;},0);}},addCssRule:function(_3f,css){var _40=_6.addCssRule(_3f,css);if(this.cleanAddedRules){this._listeners.push(_40);}return _40;},on:function(_41,_42){var _43=_4(this.domNode,_41,_42);if(!_5("dom-addeventlistener")){this._listeners.push(_43);}return _43;},cleanup:function(){var _44=this.observers,i;for(i in this._rowIdToObject){if(this._rowIdToObject[i]!=this.columns){var _45=_e(i);if(_45){this.removeRow(_45,true);}}}for(i=0;i<_44.length;i++){var _46=_44[i];_46&&_46.cancel();}this.observers=[];this._numObservers=0;this.preload=null;},destroy:function(){if(this._listeners){for(var i=this._listeners.length;i--;){this._listeners[i].remove();}delete this._listeners;}this._started=false;this.cleanup();_9(this.domNode,"!");if(this.useTouchScroll){this.inherited(arguments);}},refresh:function(){this.cleanup();this._rowIdToObject={};this._autoId=0;this.contentNode.innerHTML="";this.scrollTo({x:0,y:0});},newRow:function(_47,_48,_49,i,_4a){if(_48){var row=this.insertRow(_47,_48,_49,i,_4a);_9(row,".dgrid-highlight"+(this.addUiClasses?".ui-state-highlight":""));setTimeout(function(){_9(row,"!dgrid-highlight!ui-state-highlight");},this.highlightDuration);return row;}},adjustRowIndices:function(_4b){var _4c=_4b;var _4d=_4c.rowIndex;if(_4d>-1){do{if(_4c.rowIndex>-1){if(this.maintainOddEven){if((_4c.className+" ").indexOf("dgrid-row ")>-1){_9(_4c,"."+(_4d%2==1?_a:_b)+"!"+(_4d%2==0?_a:_b));}}_4c.rowIndex=_4d++;}}while((_4c=_4c.nextSibling)&&_4c.rowIndex!=_4d);}},renderArray:function(_4e,_4f,_50){_50=_50||{};var _51=this,_52=_50.start||0,_53=this.observers,_54,_55,_56;if(!_4f){this._lastCollection=_4e;}if(_4e.observe){_51._numObservers++;var _57=_4e.observe(function(_58,_59,to){var row,_5a,_5b,_5c;function _5d(){_5b=(_5b.connected||_5b).nextSibling;};if(_59>-1&&_54[_59]){row=_54.splice(_59,1)[0];if(row.parentNode==_55){_5a=row.nextSibling;if(_5a){if(_59!=to){_5a.rowIndex--;}}_51.removeRow(row);}_50.count--;if(_51._processScroll){_51._processScroll();}}if(to>-1){if(_54.length){if(to===0){_5b=_54[to];_5b=_5b&&_5e(_5b);}else{_5b=_54[to-1];if(_5b){_5b=_5e(_5b);_5d();}}}else{_5b=_51._getFirstRowSibling&&_51._getFirstRowSibling(_55);}if(row&&_5b&&row.id===_5b.id){_5d();}if(_5b&&!_5b.parentNode){_5b=_e(_5b.id);}_5c=(_4f&&_4f.parentNode)||(_5b&&_5b.parentNode)||_51.contentNode;row=_51.newRow(_58,_5c,_5b,_50.start+to,_50);if(row){row.observerIndex=_56;_54.splice(to,0,row);if(!_5a||to<_59){var _5f=row.previousSibling;_5a=!_5f||_5f.rowIndex+1==row.rowIndex||row.rowIndex==0?row:_5f;}}_50.count++;}if(_59===0){_60(1,1);}else{if(_59===_4e.length-(to===-1?0:1)){_60(0,0);}}_59!=to&&_5a&&_51.adjustRowIndices(_5a);_51._onNotification(_54,_58,_59,to);},true);_56=_53.push(_57)-1;}var _61=document.createDocumentFragment(),_62;function _60(){var _63=arguments;if(_56>-1){for(var i=0;i<_63.length;i++){var top=_63[i];var _64=_54[top?0:_54.length-1];_64=_64&&_5e(_64);if(_64){var row=_64[top?"previousSibling":"nextSibling"];if(row){row=_51.row(row);}if(row&&row.element!=_64){var _65=top?"unshift":"push";_4e[_65](row.data);_54[_65](row.element);_50.count++;}}}}};function _5e(row){if(!_3.isDescendant(row,_51.domNode)&&_e(row.id)){return _51.row(row.id.slice(_51.id.length+5)).element;}return row;};function _66(_67){_62=_51.insertRow(_67,_61,null,_52++,_50);_62.observerIndex=_56;return _62;};function _68(_69){if(typeof _56!=="undefined"){_53[_56].cancel();_53[_56]=0;_51._numObservers--;}if(_69){throw _69;}};var _6a;function _6b(_6c){_6a=_6c.slice(0);_55=_4f?_4f.parentNode:_51.contentNode;if(_55&&_55.parentNode&&(_55!==_51.contentNode||_6c.length)){_55.insertBefore(_61,_4f||null);_62=_6c[_6c.length-1];_62&&_51.adjustRowIndices(_62);}else{if(_53[_56]&&_51.cleanEmptyObservers){_68();}}_54=_6c;if(_57){_57.rows=_54;}};if(_4e.map){_54=_4e.map(_66,console.error);if(_54.then){return _4e.then(function(_6d){_4e=_6d;return _54.then(function(_6e){_6b(_6e);_60(1,1,0,0);return _6a;});});}}else{_54=[];for(var i=0,l=_4e.length;i<l;i++){_54[i]=_66(_4e[i]);}}_6b(_54);_60(1,1,0,0);return _6a;},_onNotification:function(_6f,_70,_71,to){},renderHeader:function(){},_autoId:0,insertRow:function(_72,_73,_74,i,_75){var _76=_75.parentId,id=this.id+"-row-"+(_76?_76+"-":"")+((this.store&&this.store.getIdentity)?this.store.getIdentity(_72):this._autoId++),row=_e(id),_77=row&&row.previousSibling;if(row){if(row===_74){_74=(_74.connected||_74).nextSibling;}this.removeRow(row);}row=this.renderRow(_72,_75);row.className=(row.className||"")+" dgrid-row "+(i%2==1?_a:_b)+(this.addUiClasses?" ui-state-default":"");this._rowIdToObject[row.id=id]=_72;_73.insertBefore(row,_74||null);if(_77){this.adjustRowIndices(_77);}row.rowIndex=i;return row;},renderRow:function(_78,_79){return _9("div",""+_78);},removeRow:function(_7a,_7b){_7a=_7a.element||_7a;delete this._rowIdToObject[_7a.id];if(!_7b){_9(_7a,"!");}},row:function(_7c){var id;if(_7c instanceof this._Row){return _7c;}if(_7c.target&&_7c.target.nodeType){_7c=_7c.target;}if(_7c.nodeType){var _7d;do{var _7e=_7c.id;if((_7d=this._rowIdToObject[_7e])){return new this._Row(_7e.substring(this.id.length+5),_7d,_7c);}_7c=_7c.parentNode;}while(_7c&&_7c!=this.domNode);return;}if(typeof _7c=="object"){id=this.store.getIdentity(_7c);}else{id=_7c;_7c=this._rowIdToObject[this.id+"-row-"+id];}return new this._Row(id,_7c,_e(this.id+"-row-"+id));},cell:function(_7f){return {row:this.row(_7f)};},_move:function(_80,_81,_82,_83){var _84,_85,_86;_86=_85=_80.element;_81=_81||1;do{if((_84=_85[_81<0?"previousSibling":"nextSibling"])){do{_85=_84;if(_85&&(_85.className+" ").indexOf(_82+" ")>-1){_86=_85;_81+=_81<0?1:-1;break;}}while((_84=(!_83||!_85.hidden)&&_85[_81<0?"lastChild":"firstChild"]));}else{_85=_85.parentNode;if(!_85||_85===this.bodyNode||_85===this.headerNode){break;}}}while(_81);return _86;},up:function(row,_87,_88){if(!row.element){row=this.row(row);}return this.row(this._move(row,-(_87||1),"dgrid-row",_88));},down:function(row,_89,_8a){if(!row.element){row=this.row(row);}return this.row(this._move(row,_89||1,"dgrid-row",_8a));},scrollTo:_5("touch")?function(_8b){return this.useTouchScroll?this.inherited(arguments):_26.call(this,_8b);}:_26,getScrollPosition:_5("touch")?function(){return this.useTouchScroll?this.inherited(arguments):_25.call(this);}:_25,get:function(_8c){var fn="_get"+_8c.charAt(0).toUpperCase()+_8c.slice(1);if(typeof this[fn]==="function"){return this[fn].apply(this,[].slice.call(arguments,1));}if(!1&&typeof this[fn+"Attr"]==="function"){}return this[_8c];},set:function(_8d,_8e){if(typeof _8d==="object"){for(var k in _8d){this.set(k,_8d[k]);}}else{var fn="_set"+_8d.charAt(0).toUpperCase()+_8d.slice(1);if(typeof this[fn]==="function"){this[fn].apply(this,[].slice.call(arguments,1));}else{if(!1&&typeof this[fn+"Attr"]==="function"){}this[_8d]=_8e;}}return this;},_getClass:_21,_setClass:_1f,_getClassName:_21,_setClassName:_1f,_setSort:function(_8f,_90){this._sort=typeof _8f!="string"?_8f:[{attribute:_8f,descending:_90}];this.refresh();if(this._lastCollection){if(_8f.length){if(typeof _8f!="string"){_90=_8f[0].descending;_8f=_8f[0].attribute;}this._lastCollection.sort(function(a,b){var _91=a[_8f],_92=b[_8f];if(_91===undefined){_91="";}if(_92===undefined){_92="";}return _91==_92?0:(_91>_92==!_90?1:-1);});}this.renderArray(this._lastCollection);}},sort:function(_93,_94){_1.deprecated("sort(...)","use set(\"sort\", ...) instead","dgrid 0.4");this.set("sort",_93,_94);},_getSort:function(){return this._sort;},_setShowHeader:function(_95){var _96=this.headerNode;this.showHeader=_95;_9(_96,(_95?"!":".")+"dgrid-header-hidden");this.renderHeader();this.resize();if(_95){_96.scrollLeft=this.getScrollPosition().x;}},setShowHeader:function(_97){_1.deprecated("setShowHeader(...)","use set(\"showHeader\", ...) instead","dgrid 0.4");this.set("showHeader",_97);},_setShowFooter:function(_98){this.showFooter=_98;_9(this.footerNode,(_98?"!":".")+"dgrid-footer-hidden");this.resize();}});});