//>>built
define("ttl/data/QueryWriteStore",["dijit","dojo","dojox","dojo/require!dojox/data/QueryReadStore"],function(_1,_2,_3){_2.provide("ttl.data.QueryWriteStore");_2.require("dojox.data.QueryReadStore");_2.declare("ttl.data.QueryWriteStore",_3.data.QueryReadStore,{tableid:"",constructor:function(_4){_4["clearOnClose"]=true;_4["urlPreventCache"]=true;_2.mixin(this,_4);this._features["dojo.data.api.Write"]=true;this._features["dojo.data.api.Notification"]=true;this._nocallback=(_4.nocallback==null)?false:_4["nocallback"];if(_4.oncallback!=undefined){this.onCallBack=_4.oncallback;}else{this.onCallBack=null;}},_getIdentifierAttribute:function(){var _5=this.getFeatures()["dojo.data.api.Identity"];return _5;},SetNoCallBackMode:function(_6){this._nocallback=_6;},newItem:function(_7,_8){var _9=_7[this._identifier];var _a={i:_7,r:this,n:this._items.length};this._items.push(_a);var _b=_a.i[this._identifier];this._itemsByIdentity[_b]=_a.i;var _c=null;this.onNew(_a,_c);return _a;},deleteItem:function(_d){var _e=this._identifier;var _f=_d.i[_e];delete this._itemsByIdentity[_f];for(var c=0;c<this._items.length;c++){if(this._items[c]==null){continue;}if(this._items[c].i[_e]==_d.i[_e]){delete this._items[c];break;}}this.onDelete(_d);return true;},invertValue:function(_10){for(var c=0;c<this._items.length;c++){var _11=this._items[c];var _12=_11.i[_10];_11.i[_10]=!_12;this.onSet(_11,_10,!_12,!_12);}},clearValue:function(_13,_14){for(var c=0;c<this._items.length;c++){var _15=this._items[c];var _16=_15.i[_13];_15.i[_13]=_14;this.onSet(_15,_13,_14,_14);}},setValue:function(_17,_18,_19,_1a){if(_17.i[_18]!=_19){var _1b=_17.i[_18];_17.i[_18]=_19;if(this._nocallback==false){var _1c={attribute:_18,value:_19,key:_17.i[this._identifier],tableid:this.tableid};if(this.oncallbackparams!=null){_1c=_2.mixin(_1c,this.oncallbackparams());}_2.xhrPost(ttl.utilities.makeParams({url:"/maintenance/updatefield",load:this.onCallBack,error:null,content:_1c}));}}if(_1a==true){this.onSet(_17,_18,_19,_19);}return true;},unsetAttribute:function(_1d,_1e){return true;},save:function(_1f){return true;},revert:function(){return true;},isDirty:function(_20){return true;},onDelete:function(_21){},onNew:function(_22,_23){},fetchItemByIdentity:function(_24){if(this._itemsByIdentity){var _25=this._itemsByIdentity[_24.identity];if(!(_25===undefined)){if(_24.onItem){var _26=_24.scope?_24.scope:_2.global;_24.onItem.call(_26,{i:_25,r:this});}return;}else{var _27=this._identifier;for(var c=0;c<this._items.length;c++){if(this._items[c]==null){continue;}if(this._items[c].i[_27]==_24.identity){if(_24.onItem){var _26=_24.scope?_24.scope:_2.global;_24.onItem.call(_26,{i:this._items[c].i,r:this});}break;}}}}var _28=function(_29,_2a){var _2b=_24.scope?_24.scope:_2.global;if(_24.onError){_24.onError.call(_2b,_29);}};var _2c=function(_2d,_2e){var _2f=_24.scope?_24.scope:_2.global;try{var _30=null;if(_2d&&_2d.length==1){_30=_2d[0];}if(_24.onItem){_24.onItem.call(_2f,_30,true);}}catch(error){if(_24.onError){_24.onError.call(_2f,error);}}};var _31={serverQuery:{id:_24.identity}};this._fetchItems(_31,_2c,_28);},hasRows:function(){var _32=false;for(var key in this._itemsByIdentity){_32=true;break;}return _32;}});});