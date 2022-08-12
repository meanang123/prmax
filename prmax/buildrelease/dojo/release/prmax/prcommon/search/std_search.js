/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.search.std_search"]){dojo._hasResource["prcommon.search.std_search"]=true;dojo.provide("prcommon.search.std_search");dojo.require("prcommon.search.SearchCount");dojo.declare("prcommon.search.std_search",null,{commoncontrols:"search",dojoAttachEvent:"",dojoAttachPoint:"",waiRole:"",waiState:"",name:"",keytypeid:"",displayname:"",testmode:false,usepartial:false,search:"",min:0,searchTime:400,constructor:function(){this._LoadCallBack=dojo.hitch(this,this._Load);this._value="";this._extended=false;this.open=false;this.searchTimer=null;dojo.subscribe(PRCOMMON.Events.Search_PartialMatch,dojo.hitch(this,this._PartialEvent));},_PartialEvent:function(_1){if(this.usepartial&&_1.search==this.search&&this._value.length>0){this._Get(this._value,true);}},_setdisplay:function(_2){if(_2.length==0){this.countNode.Clear();}else{this.countNode.set("value",_2);}},_Load:function(_3,_4){if(_3.success=="OK"){if(this._transactionid==_3.transactionid){this._setdisplay(_3.count.toString());}}},_Send_Request_Count:function(_5){var _6=this._CaptureExtendedContent({keytypeid:this.keytypeid,fieldname:this.name,value:this._value});this._transactionid=PRCOMMON.utils.uuid.createUUID();_6["transactionid"]=this._transactionid;dojo.xhrPost(ttl.utilities.makeParamsIgnore({load:this._LoadCallBack,url:"/search/displaycount",content:_6}));this.searchTimer=null;},_Get:function(_7,_8){if(this._value==_7&&_8!=true){return;}this._value=_7;if(this._value.length>this.min){if(this.searchTimer){clearTimeout(this.searchTimer);this.searchTimer=null;}this.searchTimer=setTimeout(dojo.hitch(this,this._Send_Request_Count,_7),this.searchTime);}else{this._setdisplay("");}dojo.publish(PRCOMMON.Events.Search_Total,[{search:this.search}]);},_CaptureExtendedContent:function(_9){var _a=dijit.byId("search_partial");var _b=dijit.byId(this.commoncontrols+"private");try{return dojo.mixin(_9,{partial:_a?_a.checked?2:0:2,private_only:_b?_b.attr("value"):0});}catch(e){alert(e);}},_setExtendedAttr:function(_c){this._extended=_c;},_getExtendedAttr:function(){return this._extended;},_Toggle:function(){this.open=!this.open;this._ToggleCascade();},_ToggleCascade:function(){dojo.style(this.selectarea,"display",this.open?"block":"none");if(this.open){dojo.addClass(this.toggleCtrl,"fa-minus-circle");dojo.removeClass(this.toggleCtrl,"fa-plus-circle");}else{dojo.addClass(this.toggleCtrl,"fa-plus-circle");dojo.removeClass(this.toggleCtrl,"fa-minus-circle");}if(this.open){this._focus();}},Clear:function(){this._MakeClosed();if(this.searchTimer){clearTimeout(this.searchTimer);this.searchTimer=null;}},_MakeClosed:function(){if(this.open==true){this._Toggle();}},MakeOpen:function(){this.open=false;this._Toggle();}});}