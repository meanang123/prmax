//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.updatum.view");

dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.updatum.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.updatum","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





