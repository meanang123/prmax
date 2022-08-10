/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.common.SelectOptions"]){dojo._hasResource["prmax.common.SelectOptions"]=true;dojo.provide("prmax.common.SelectOptions");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.declare("prmax.common.SelectOptions",[dijit._Widget,dijit._Templated,dijit._Container],{name:"",widgetsInTemplate:true,templateString:"<table class=\"prmaxtable\" dojoAttachPoint=\"containerNode\" >\r\n<tr><td colspan=\"2\" dojoAttachPoint=\"titleNode\"  style=\"v-align:top\" class=\"prmaxrowtag\"></td></tr>\r\n<tr><td width=\"3%\" ><input name=\"selection\" dojoAttachPoint=\"allNode\" dojoType=\"dijit.form.RadioButton\" dojoAttachEvent=\"onClick:_Click\" checked=\"checked\" type=\"radio\" value=\"-1\" /></td><td width=\"97%\" style=\"padding-left:1px\"><label dojoAttachPoint=\"allNodeLabel\" for=\"1\" class=\"prmaxlabeltag\">All</label></td></tr>\r\n<tr><td width=\"3%\" ><input disabled=\"disabled\" name=\"selection\" dojoAttachPoint=\"selectedNode\" dojoType=\"dijit.form.RadioButton\" dojoAttachEvent=\"onClick:_Click\" type=\"radio\" value=\"1\" /></td><td width=\"97%\" style=\"padding-left:1px\"><label dojoAttachPoint=\"selectedNodeLabel\" for=\"2\" class=\"prmaxlabeltag\">Select Marked</label></td></tr>\r\n<tr><td width=\"3%\" ><input disabled=\"disabled\" name=\"selection\"  dojoAttachPoint=\"unselectedNode\" dojoType=\"dijit.form.RadioButton\" dojoAttachEvent=\"onClick:_Click\" type=\"radio\" value=\"0\" /></td><td width=\"97%\" style=\"padding-left:1px\"><label dojoAttachPoint=\"unselectedNodeLabel\" for=\"3\" class=\"prmaxlabeltag\">Select Unmarked</label></td></tr>\r\n<tr></table>\r\n",constructor:function(){this._nodes=["allNode","selectedNode","unselectedNode"];},startup:function(){for(var a in this._nodes){this[this._nodes[a]].domNode.firstChild.name=this.id+"_name";this[this._nodes[a]].set("name",this.id+"_name");this[this._nodes[a]+"Label"].setAttribute("for",this[this._nodes[a]].id);}this.inherited(arguments);},_Click:function(){},_getValueAttr:function(){return this._getData();},_getData:function(){var _1="-1";for(var a in this._nodes){if(this[this._nodes[a]].checked==true){_1=this[this._nodes[a]].value;break;}}return _1;},Clear:function(){this.allNode.checked=true;},setOptions:function(_2){this.selectedNode.set("disabled",(_2)?false:true);this.unselectedNode.set("disabled",(_2)?false:true);if(_2){this.selectedNode.set("checked",true);}else{this.allNode.set("checked",true);}}});}