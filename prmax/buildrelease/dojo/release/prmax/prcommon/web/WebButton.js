/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.web.WebButton"]){dojo._hasResource["prcommon.web.WebButton"]=true;dojo.provide("prcommon.web.WebButton");dojo.require("ttl.BaseWidget");dojo.require("dijit.Dialog");dojo.declare("prcommon.web.WebButton",[ttl.BaseWidget],{templateString:"<span>\r\n\t<button data-dojo-attach-point=\"webbutton\" data-dojo-attach-event=\"onClick:_open_url_new_tab\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",source:\"\"'><i class=\"fa fa-eye\" aria-hidden=\"true\"></i></button>\r\n<span>\r\n",constructor:function(){},postCreate:function(){},_getSourceAttr:function(){return this.webbutton;},_setSourceAttr:function(_1){this.webbutton=_1;},_open_url_new_tab:function(){url=this.webbutton.get("value");if(url&&url!=""){var _2=window.open(url,"_blank");_2.focus();}}});}