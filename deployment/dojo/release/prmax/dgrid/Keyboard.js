//>>built
define("dgrid/Keyboard",["dojo/_base/declare","dojo/aspect","dojo/on","dojo/_base/lang","dojo/has","put-selector/put","./util/misc","dojo/_base/Deferred","dojo/_base/sniff"],function(_1,_2,on,_3,_4,_5,_6,_7){var _8={checkbox:1,radio:1,button:1},_9=/\bdgrid-cell\b/,_a=/\bdgrid-row\b/;var _b=_1(null,{pageSkip:10,tabIndex:0,keyMap:null,headerKeyMap:null,postMixInProperties:function(){this.inherited(arguments);if(!this.keyMap){this.keyMap=_3.mixin({},_b.defaultKeyMap);}if(!this.headerKeyMap){this.headerKeyMap=_3.mixin({},_b.defaultHeaderKeyMap);}},postCreate:function(){this.inherited(arguments);var _c=this;function _d(_e){var _f=_e.target;return _f.type&&(!_8[_f.type]||_e.keyCode==32);};function _10(_11){var _12=_c.cellNavigation,_13=_12?_9:_a,_14=_11===_c.headerNode,_15=_11;function _16(){if(_c._focusedHeaderNode){_c._focusedHeaderNode.tabIndex=-1;}if(_c.showHeader){if(_12){for(var i=0,_17,_18=_c.headerNode.getElementsByTagName("th");(_17=_18[i]);++i){if(_13.test(_17.className)){_c._focusedHeaderNode=_15=_17;break;}}}else{_c._focusedHeaderNode=_15=_c.headerNode;}if(_15){_15.tabIndex=_c.tabIndex;}}};if(_14){_16();_2.after(_c,"renderHeader",_16,true);}else{_2.after(_c,"renderArray",function(ret){return _7.when(ret,function(ret){var _19=_c._focusedNode||_15;if(_13.test(_19.className)&&_6.contains(_11,_19)){return ret;}for(var i=0,_1a=_11.getElementsByTagName("*"),_1b;(_1b=_1a[i]);++i){if(_13.test(_1b.className)){_19=_c._focusedNode=_1b;break;}}_19.tabIndex=_c.tabIndex;return ret;});});}_c._listeners.push(on(_11,"mousedown",function(_1c){if(!_d(_1c)){_c._focusOnNode(_1c.target,_14,_1c);}}));_c._listeners.push(on(_11,"keydown",function(_1d){if(_1d.metaKey||_1d.altKey){return;}var _1e=_c[_14?"headerKeyMap":"keyMap"][_1d.keyCode];if(_1e&&!_d(_1d)){_1e.call(_c,_1d);}}));};if(this.tabableHeader){_10(this.headerNode);on(this.headerNode,"dgrid-cellfocusin",function(){_c.scrollTo({x:this.scrollLeft});});}_10(this.contentNode);},removeRow:function(_1f){if(!this._focusedNode){return this.inherited(arguments);}var _20=this,_21=document.activeElement===this._focusedNode,_22=this[this.cellNavigation?"cell":"row"](this._focusedNode),_23=_22.row||_22,_24;_1f=_1f.element||_1f;if(_1f===_23.element){_24=this.down(_23,true);if(!_24||_24.element===_1f){_24=this.up(_23,true);}this._removedFocus={active:_21,rowId:_23.id,columnId:_22.column&&_22.column.id,siblingId:!_24||_24.element===_1f?undefined:_24.id};setTimeout(function(){if(_20._removedFocus){_20._restoreFocus(_23.id);}},0);this._focusedNode=null;}this.inherited(arguments);},insertRow:function(_25){var _26=this.inherited(arguments);if(this._removedFocus&&!this._removedFocus.wait){this._restoreFocus(_26);}return _26;},_restoreFocus:function(row){var _27=this._removedFocus,_28,_29;row=row&&this.row(row);_28=row&&row.element&&row.id===_27.rowId?row:typeof _27.siblingId!=="undefined"&&this.row(_27.siblingId);if(_28&&_28.element){if(!_28.element.parentNode.parentNode){_27.wait=true;return;}if(typeof _27.columnId!=="undefined"){_29=this.cell(_28,_27.columnId);if(_29&&_29.element){_28=_29;}}if(_27.active&&_28.element.offsetHeight!==0){this._focusOnNode(_28,false,null);}else{_5(_28.element,".dgrid-focus");_28.element.tabIndex=this.tabIndex;this._focusedNode=_28.element;}}delete this._removedFocus;},addKeyHandler:function(key,_2a,_2b){return _2.after(this[_2b?"headerKeyMap":"keyMap"],key,_2a,true);},_focusOnNode:function(_2c,_2d,_2e){var _2f="_focused"+(_2d?"Header":"")+"Node",_30=this[_2f],_31=this.cellNavigation?"cell":"row",_32=this[_31](_2c),_33,_34,_35,_36,i;_2c=_32&&_32.element;if(!_2c){return;}if(this.cellNavigation){_33=_2c.getElementsByTagName("input");for(i=0,_35=_33.length;i<_35;i++){_34=_33[i];if((_34.tabIndex!=-1||"_dgridLastValue" in _34)&&!_34.disabled){if(_4("ie")<8){_34.style.position="relative";}_34.focus();if(_4("ie")<8){_34.style.position="";}_36=true;break;}}}if(_2e!==null){_2e=_3.mixin({grid:this},_2e);if(_2e.type){_2e.parentType=_2e.type;}if(!_2e.bubbles){_2e.bubbles=true;}}if(_30){_5(_30,"!dgrid-focus[!tabIndex]");if(_4("ie")<8){_30.style.position="";}if(_2e){_2e[_31]=this[_31](_30);on.emit(_30,"dgrid-cellfocusout",_2e);}}_30=this[_2f]=_2c;if(_2e){_2e[_31]=_32;}var _37=this.cellNavigation?_9:_a;if(!_36&&_37.test(_2c.className)){if(_4("ie")<8){_2c.style.position="relative";}_2c.tabIndex=this.tabIndex;_2c.focus();}_5(_2c,".dgrid-focus");if(_2e){on.emit(_30,"dgrid-cellfocusin",_2e);}},focusHeader:function(_38){this._focusOnNode(_38||this._focusedHeaderNode,true);},focus:function(_39){var _3a=_39||this._focusedNode;if(_3a){this._focusOnNode(_3a,false);}else{this.contentNode.focus();}}});var _3b=_b.moveFocusVertical=function(_3c,_3d){var _3e=this.cellNavigation,_3f=this[_3e?"cell":"row"](_3c),_40=_3e&&_3f.column.id,_41=this.down(this._focusedNode,_3d,true);if(_3e){_41=this.cell(_41,_40);}this._focusOnNode(_41,false,_3c);_3c.preventDefault();};var _42=_b.moveFocusUp=function(_43){_3b.call(this,_43,-1);};var _44=_b.moveFocusDown=function(_45){_3b.call(this,_45,1);};var _46=_b.moveFocusPageUp=function(_47){_3b.call(this,_47,-this.pageSkip);};var _48=_b.moveFocusPageDown=function(_49){_3b.call(this,_49,this.pageSkip);};var _4a=_b.moveFocusHorizontal=function(_4b,_4c){if(!this.cellNavigation){return;}var _4d=!this.row(_4b),_4e=this["_focused"+(_4d?"Header":"")+"Node"];this._focusOnNode(this.right(_4e,_4c),_4d,_4b);_4b.preventDefault();};var _4f=_b.moveFocusLeft=function(_50){_4a.call(this,_50,-1);};var _51=_b.moveFocusRight=function(_52){_4a.call(this,_52,1);};var _53=_b.moveHeaderFocusEnd=function(_54,_55){var _56;if(this.cellNavigation){_56=this.headerNode.getElementsByTagName("th");this._focusOnNode(_56[_55?0:_56.length-1],true,_54);}_54.preventDefault();};var _57=_b.moveHeaderFocusHome=function(_58){_53.call(this,_58,true);};var _59=_b.moveFocusEnd=function(_5a,_5b){var _5c=this,_5d=this.cellNavigation,_5e=this.contentNode,_5f=_5b?0:_5e.scrollHeight,_60=_5e.scrollTop+_5f,_61=_5e[_5b?"firstChild":"lastChild"],_62=_61.className.indexOf("dgrid-preload")>-1,_63=_62?_61[(_5b?"next":"previous")+"Sibling"]:_61,_64=_63.offsetTop+(_5b?0:_63.offsetHeight),_65;if(_62){while(_63&&_63.className.indexOf("dgrid-row")<0){_63=_63[(_5b?"next":"previous")+"Sibling"];}if(!_63){return;}}if(!_62||_61.offsetHeight<1){if(_5d){_63=this.cell(_63,this.cell(_5a).column.id);}this._focusOnNode(_63,false,_5a);}else{if(!_4("dom-addeventlistener")){_5a=_3.mixin({},_5a);}_65=_2.after(this,"renderArray",function(_66){_65.remove();return _7.when(_66,function(_67){var _68=_67[_5b?0:_67.length-1];if(_5d){_68=_5c.cell(_68,_5c.cell(_5a).column.id);}_5c._focusOnNode(_68,false,_5a);});});}if(_60===_64){_5a.preventDefault();}};var _69=_b.moveFocusHome=function(_6a){_59.call(this,_6a,true);};function _6b(_6c){_6c.preventDefault();};_b.defaultKeyMap={32:_6b,33:_46,34:_48,35:_59,36:_69,37:_4f,38:_42,39:_51,40:_44};_b.defaultHeaderKeyMap={32:_6b,35:_53,36:_57,37:_4f,39:_51};return _b;});