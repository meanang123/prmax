/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.collateral.adddialog"]){dojo._hasResource["prmax.collateral.adddialog"]=true;dojo.provide("prmax.collateral.adddialog");dojo.require("ttl.BaseWidget");dojo.require("dijit.Dialog");dojo.require("prmax.collateral.add");dojo.declare("prmax.collateral.adddialog",[ttl.BaseWidget],{templateString:"<div>\r\n\t<div dojoAttachPoint=\"dlg\" dojoType=\"dijit.Dialog\" title=\"New Collateral\" style=\"width:400px;height:300px\">\r\n\t <div dojoAttachPoint=\"addctrl\" dojoType=\"prmax.collateral.add\" style=\"width:400px;height:300px\"></div>\r\n\t</div>\r\n</div>\r\n",postCreate:function(){this.addctrl.showClose(this);},show:function(){this.addctrl._Clear();this.dlg.show();},hide:function(){this.dlg.hide();},Clear:function(){this.addctrl.Clear();}});}