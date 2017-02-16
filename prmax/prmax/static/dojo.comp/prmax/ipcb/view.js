//-----------------------------------------------------------------------------
// Name:    prmax.ipcb.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.ipcb.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.ipcb.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.ipcb","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





