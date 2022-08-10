/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.search.Frequency"]){dojo._hasResource["prmax.search.Frequency"]=true;dojo.provide("prmax.search.Frequency");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.require("dijit.form.CheckBox");dojo.require("prcommon.search.std_search");dojo.declare("prmax.search.Frequency",[prcommon.search.std_search,dijit._Widget,dijit._Templated,dijit._Container],{name:"",value:"",title:"",search:"",size:"9",testmode:false,widgetsInTemplate:true,templateString:"<div class=\"frequencies\">\r\n\t<table width=\"99%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\"   class=\"prmaxrowtag\">Frequency</td>\r\n\t\t\t\t<td width=\"75%\" ><select class=\"prmaxinputselect\" dojoAttachPoint=\"select\" dojotype =\"dijit.form.FilteringSelect\" searchAttr=\"name\" labelType=\"html\" dojoAttachEvent=\"onChange:_Changed\" ></td>\r\n\t\t\t\t<td width=\"5%\"align=\"right\" v-align=\"top\" ><div dojoAttachPoint=\"countNode\" dojotype=\"prmax.search.SearchCount\"></div></td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n\r\n",constructor:function(){this.store=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=frequencies&ignoreoption=1"});},postCreate:function(){this.select.store=this.store;this.select.set("value",-1);},_Changed:function(){this._Get(this._getData());},Clear:function(){this.select.set("value",-1);this._Get("");this.inherited(arguments);},_setValueAttr:function(_1){var _2=false;this.Clear();this._Get(this._getValueAttr());},_getValueAttr:function(){return this._getData();},_getData:function(){var _3=parseInt(this.select.get("value"));if(this._extended){return {data:_3};}else{this.value=(_3!=null&&_3!=-1)?dojo.toJson(_3):"";return this.value;}},_focus:function(){this.select.focus();},_CaptureExtendedContent:function(_4){var _5=this.inherited(arguments);_5.partial=0;return _5;}});}