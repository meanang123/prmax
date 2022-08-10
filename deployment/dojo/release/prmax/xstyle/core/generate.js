//>>built
define("xstyle/core/generate",["xstyle/core/elemental","put-selector/put","xstyle/core/utils","xstyle/core/expression","xstyle/core/base"],function(_1,_2,_3,_4,_5){var _6={TABLE:"tr",TBODY:"tr",TR:"td",UL:"li",OL:"li",SELECT:"option"};var _7={INPUT:1,TEXTAREA:1,SELECT:1};var _8=document;var _9=1;function _a(_b,_c){_b=_b.sort?_b:[_b];return function(_d,_e,_f){var _10=_d;var _11;if(!("content" in _d)){_d.content=undefined;}if(_f===undefined){var _12=(_d._contentNode||_d).childNodes||0;var _13=_12[0];if(_13){var _14=_8.createDocumentFragment();do{_14.appendChild(_13);}while((_13=_12[0]));_d.content=_14;}if(_d._contentNode){_d._contentNode=undefined;try{_d.innerHTML="";}catch(e){}}}var _15=0;var _16=[_d];var _17=[];for(var i=0,l=_b.length;i<l;i++){var _18=_19,_19=_b[i];try{if(_19.eachProperty){if(_19.args){if(_19.operator=="("){var _1a=_b[i+1];_3d(_19,_1a,_10,function(_1b,_1c,_1d){_58(_1b,_1c,_1d,_c);});}else{var _1e=_19.args[0];if(typeof _1e==="string"){var _1f=_1e.split("=");try{_10.setAttribute(_1f[0],_1f[1]);}catch(e){}}else{var _20=_1e[0].replace(/=$/,"");var _21=_1e[1];if(_21.operator=="("){_3d(_1e[1],_20,_10,function(_22,_23,_24){_52(_22,_23,_24,_c);});}else{_10.setAttribute(_20,_21.value);}}}}}else{if(typeof _19=="string"){if(_19.charAt(0)=="="){_19=_19.slice(1);}var _25=_10;var _1a=_b[i+1];var _1f=[];_19.replace(/([,\n]+)?([\t ]*)?(\.|#)?([-\w%$|\.\#]+)(?:\[([^\]=]+)=?['"]?([^\]'"]*)['"]?\])?/g,function(){_1f.push(arguments);});for(var j=0;j<_1f.length;j++){(function(t,_26,_27,_28,_29,_2a,_2b){function _2c(){var _2d=_25._contentNode;if(_2d){_2d.innerHTML="";_25=_2d;}};if(_26){var _2e=_27?_27.length:0;if(_2e>_15){_2c();_16[_2e]=_25;}else{_25=_16[_2e]||_25;}_15=_2e;}else{_2c();}var _2f;if(_28){_2f=(_18&&_18.args?"":"span")+_28+_29;}else{var _30=_29.match(/^[-\w]+/);if(!_30){throw new SyntaxError("Unable to parse selector",_29);}var _31=_30[0];var _32;if(j===_1f.length-1&&_1a&&_1a.selector){if(!_1a.bases){_3.extend(_1a,_31);}_32=_1a;}else{_32=_c.getDefinition(_31);}if(_32&&(_32.then||_32.newElement)){_25=(function(_33,_34,_35,_36){var _37,_38;_3.when(_32&&_32.newElement&&_32.newElement(),function(_39){_37=_39;if(_37){_35=_35.slice(_36.length);if(_35){_2(_37,_35);}}else{_37=_2(_35);}if(_38){_38.parentNode.replaceChild(_37,_38);var _3a=_38.childNodes;var _3b;_37=_37._contentNode||_37;while((_3b=_3a[0])){_37.appendChild(_3b);}}});if(_37){return _33.insertBefore(_37,_34||null);}else{var _38=_2("span");return _33.insertBefore(_38,_34||null);}})(_25,_f,_29,_31);}else{_2f=_29;}}if(_2f){_25=_2(_f||_25,(_f?"-":"")+_2f);}_f=null;if(_2a){_2b=_2b===""?_2a:_2b;_25.setAttribute(_2a,_2b);}if(_e){_25.item=_e;}_11=_11||_25;if(j<_1f.length-1||(_25!=_10&&_25!=_d)){_17.push(j==_1f.length-1&&_1a&&_1a.selector,_25);}_10=_25;}).apply(this,_1f[j]);}}else{_10.appendChild(_8.createTextNode(_19.value));}}}catch(e){if(_10.innerHTML){_10.innerHTML="";}_10.appendChild(_8.createTextNode(e));}}var _3c;while((_3c=_17.pop())){_1.update(_3c,_17.pop());}return _11;};};function _3d(_3e,_3f,_40,_41){var _42,_43;if(_3f&&_3f.eachProperty){_2(_40,_42=_3f.selector);_43=_3f;}else{_2(_40,_42=_3e.selector||(_3e.selector=".-xbind-"+_9++));_43=_3e;}var _44=_3e.getArgs()[0];var _45=_3e.expressionResult;var _46=_3e.expressionDefinition;if(!_46){_46=_3e.expressionDefinition=_4.evaluate(_3e.parent,_44);_45=_46.valueOf();_1.addInputConnector(_43,_46);(function(_47,_48,_49){_3e.expressionResult=_45;_49.dependencyOf&&_49.dependencyOf({invalidate:function(_4a){var _4b;if(_4a){if(_1.matchesRule(_4a.elements[0],_43)){_4b=_4a.elements;}else{_4b=_4a.elements[0].querySelectorAll(_48);}}else{_4b=document.querySelectorAll(_48);}for(var i=0,l=_4b.length;i<l;i++){_41(_4b[i],_47,_49.valueOf());}}});})(_3f,_42,_46);}_41(_40,_3f,_45);};function _4c(_4d,_4e,_4f,_50){return _3.when(_4d,function(_51){if(_51&&_51.forRule){_51=_51.forRule(_4e);}if(_51&&_51.forElement){_51=_51.forElement(_4f);}_50(_51);});};function _52(_53,_54,_55,_56){_4c(_55,_56,_53,function(_57){_53.setAttribute(_54,_57);});};function _58(_59,_5a,_5b,_5c){if(true||!("_defaultBinding" in _59)){_59._defaultBinding=true;if(_5b&&_5b.then&&_59.tagName!=="INPUT"){try{_59.appendChild(_8.createTextNode("Loading"));}catch(e){}}_4c(_5b,_5c,_59,function(_5d){if(_59._defaultBinding){_6c(_59);if(_59.childNodes.length){_59.innerHTML="";}if(_5d&&_5d.sort){if(_5d.isSequence){_a(_5d,_5c)(_59);}else{var _5e=_5a&&_5a.definitions&&_5a.definitions.each;var _5f=_5c.newRule();if(_5e){_5e=_a(_5e,_5f);}else{_5e=function(_60,_61,_62){return _2(_62||_60,(_62?"-":"")+(_6[_60.tagName]||"span"),""+_61);};}var _63=[];var _64;if(_5d.track){_5d=_5d.track();_64=_5d.tracking;}_5d.forEach(function(_65){_63.push(_5e(_59,_65,null));});if(_5d.on){var _66=_5d.on("add,delete,update",function(_67){var _68=_67.target;var _69=_67.previousIndex;var _6a=_67.index;if(_69>-1){var _6b=_63[_69];_6c(_6b,true);_6b.parentNode.removeChild(_6b);_63.splice(_69,1);}if(_6a>-1){_63.splice(_6a,0,_5e(_59,_68,_63[_6a]||null));}});}_64=_64||_66;if(_64){_59.xcleanup=function(){_64.remove();};}}}else{if(_5d&&_5d.nodeType){_59.appendChild(_5d);}else{_5d=_5d===undefined?"":_5d;if(_59.tagName in _7){if(_59.type==="checkbox"){_59.checked=_5d;}else{_59.value=_5d;}}else{_59.appendChild(_8.createTextNode(_5d));}}}}});}};function _6c(_6d,_6e){if(_6d.xcleanup){_6d.xcleanup(_6e);}var _6f=_6d.getElementsByTagName("*");for(var i=0,l=_6f.length;i<l;i++){var _70=_6f[i];_70.xcleanup&&_70.xcleanup(true);}};function _71(_72,_73){return _a(_73,_5)(_72);};_71.forSelector=_a;return _71;});