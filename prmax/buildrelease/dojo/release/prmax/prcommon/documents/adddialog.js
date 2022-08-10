/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.documents.adddialog"]){dojo._hasResource["prcommon.documents.adddialog"]=true;dojo.provide("prcommon.documents.adddialog");dojo.require("ttl.BaseWidget");dojo.require("dijit.Dialog");dojo.require("prcommon.documents.add");dojo.declare("prcommon.documents.adddialog",[ttl.BaseWidget],{templateString:"<div>\r\n\t<div data-dojo-attach-point=\"dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"New Document\",style:\"width:400px;height:200px;margin:10px\"'>\r\n\t <div data-dojo-attach-point=\"addctrl\" data-dojo-type=\"prcommon.documents.add\" data-dojo-props='style:\"width:400px;height:200px;margin:10px\"'></div>\r\n\t</div>\r\n</div>\r\n",postCreate:function(){this.addctrl.show_close(this);},show:function(){this.addctrl._clear();this.dlg.show();},hide:function(){this.dlg.hide();},clear:function(){this.addctrl.clear();}});}