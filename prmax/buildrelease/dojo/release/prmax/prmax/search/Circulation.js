/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.search.Circulation"]){dojo._hasResource["prmax.search.Circulation"]=true;dojo.provide("prmax.search.Circulation");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.require("dijit.form.CheckBox");dojo.require("prcommon.search.std_search");dojo.declare("prmax.search.Circulation",[prcommon.search.std_search,dijit._Widget,dijit._Templated,dijit._Container],{name:"",value:"",title:"",search:"",size:"9",testmode:false,widgetsInTemplate:true,templateString:"<div class=\"circulation\">\r\n\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\"   class=\"prmaxrowtag\">Circulation</td>\r\n\t\t\t\t<td width=\"5%\" ><i dojoAttachPoint=\"toggleCtrl\" dojoAttachEvent=\"onclick:_Toggle\" class=\"fa fa-plus-circle\" style=\"color:#7F7F7F\"></i></td>\r\n\t\t\t\t<td align=\"right\" v-align=\"top\" ><div dojoAttachPoint=\"countNode\" dojotype=\"prmax.search.SearchCount\"></div></td>\r\n\t\t</tr>\r\n\t</table>\r\n\t<div style=\"border 2px solid black\">\r\n\t\t<div dojoAttachPoint=\"selectarea\" class=\"prmaxselectmultiple\" style=\"display:none\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\">\r\n\t\t\t  <tr>\r\n\t\t\t  <td width=\"8%\"><input class=\"prmaxdefault\" dojoAttachPoint=\"node_1\"  dojoType=\"dijit.form.CheckBox\" type=\"checkbox\" value=\"1\" dojoAttachEvent=\"onClick:checkCount\"/></td><td width=\"23%\"><label dojoAttachPoint=\"node_1_label\" class=\"labeltag\">1-500</label></td>\r\n\t\t\t  <td width=\"8%\"><input class=\"prmaxdefault\" dojoAttachPoint=\"node_2\" dojoType=\"dijit.form.CheckBox\" type=\"checkbox\" value=\"2\" dojoAttachEvent=\"onClick:checkCount\"/></td><td width=\"26%\"><label dojoAttachPoint=\"node_2_label\" class=\"labeltag\">501-2500</label></td>\r\n\t\t\t  <td width=\"8%\"><input class=\"prmaxdefault\" dojoAttachPoint=\"node_3\" dojoType=\"dijit.form.CheckBox\" type=\"checkbox\" value=\"3\" dojoAttachEvent=\"onClick:checkCount\"/></td><td width=\"21%\"><label dojoAttachPoint=\"node_3_label\" class=\"labeltag\">2501-10k</label></td>\r\n\t\t\t  </tr>\r\n\t\t\t  <tr>\r\n\t\t\t  <td width=\"8%\"><input class=\"prmaxdefault\" dojoAttachPoint=\"node_4\" dojoType=\"dijit.form.CheckBox\" type=\"checkbox\" value=\"4\" dojoAttachEvent=\"onClick:checkCount\"/></td><td width=\"23%\"><label dojoAttachPoint=\"node_4_label\" class=\"labeltag\">10001-50k</label></td>\r\n\t\t\t  <td width=\"8%\"><input class=\"prmaxdefault\" dojoAttachPoint=\"node_5\" dojoType=\"dijit.form.CheckBox\" type=\"checkbox\" value=\"5\" dojoAttachEvent=\"onClick:checkCount\"/></td><td width=\"26%\"><label dojoAttachPoint=\"node_5_label\" class=\"labeltag\">50001-100k</label></td>\r\n\t\t\t  <td width=\"8%\"><input class=\"prmaxdefault\" dojoAttachPoint=\"node_6\" dojoType=\"dijit.form.CheckBox\" type=\"checkbox\" value=\"6\" dojoAttachEvent=\"onClick:checkCount\"/></td><td width=\"21%\"><label dojoAttachPoint=\"node_6_label\" class=\"labeltag\">100001+</label></td>\r\n\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n",constructor:function(){this._fieldList=[1,2,3,4,5,6];},postCreate:function(){for(var _1 in this._fieldList){var _2=this._fieldList[_1];dojo.attr(this["node_"+_2+"_label"],"for",this["node_"+_2].id);}},checkCount:function(){this._Get(this._getData());},Clear:function(){for(var a in this._fieldList){this["node_"+this._fieldList[a]].set("value",false);}this._Get("");this.inherited(arguments);},_setValueAttr:function(_3){var _4=false;this.Clear();for(var _5 in _3.data){var _6=_3.data[_5];this["node_"+_6].set("value",true);_4=true;}this._Get(this._getValueAttr());if(_4){this.MakeOpen();}},_getValueAttr:function(){return this._getData();},_getData:function(){var _7=Array();var _8=0;for(var a in this._fieldList){if(this["node_"+this._fieldList[a]].get("value")!=false){_7[_8]=parseInt(this._fieldList[a]);++_8;}}if(this._extended){return {data:_7};}else{var _7=_8>0?dojo.toJson(_7):"";this.value=_7;return _7;}},_focus:function(){this.node_1.focus();}});}