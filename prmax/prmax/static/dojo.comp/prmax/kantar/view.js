//-----------------------------------------------------------------------------
// Name:    prmax.kantar.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 05/09/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.kantar.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.kantar.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.kantar","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





