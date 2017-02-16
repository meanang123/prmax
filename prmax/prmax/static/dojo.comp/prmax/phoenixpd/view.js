//-----------------------------------------------------------------------------
// Name:    prmax.phoenixpd.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 25/09/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.phoenixpd.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.phoenixpd.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.phoenixpd","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





