//-----------------------------------------------------------------------------
// Name:    prmax.fens.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 22/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.fens.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.fens.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.fens","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





