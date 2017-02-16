//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.collateral.adddialog");

dojo.require("ttl.BaseWidget");

dojo.require("dijit.Dialog");
dojo.require("prmax.collateral.add");

dojo.declare("prmax.collateral.adddialog",
	[ ttl.BaseWidget ],
	{
		templatePath: dojo.moduleUrl( "prmax.collateral","templates/adddialog.html"),
		postCreate:function()
		{
			this.addctrl.showClose(this);
		},
		show:function()
		{
			this.addctrl._Clear();
			this.dlg.show();
		},
		hide:function()
		{
			this.dlg.hide();
		},
		Clear:function()
		{
			this.addctrl.Clear();
		}
	}
);





