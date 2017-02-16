//-----------------------------------------------------------------------------
// Name:    adddialog.js
// Author:  Chris Hoy
// Purpose:
// Created: 30/09/2014
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.documents.adddialog");

dojo.require("ttl.BaseWidget");

dojo.require("dijit.Dialog");
dojo.require("prcommon.documents.add");

dojo.declare("prcommon.documents.adddialog",
	[ ttl.BaseWidget ],
	{
		templatePath: dojo.moduleUrl( "prcommon.documents","templates/adddialog.html"),
		postCreate:function()
		{
			this.addctrl.show_close(this);
		},
		show:function()
		{
			this.addctrl._clear();
			this.dlg.show();
		},
		hide:function()
		{
			this.dlg.hide();
		},
		clear:function()
		{
			this.addctrl.clear();
		}
	}
);





