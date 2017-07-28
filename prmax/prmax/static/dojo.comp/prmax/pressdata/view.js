//-----------------------------------------------------------------------------
// Name:    prmax.pressdata.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/07/2016
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressdata.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.pressdata.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.pressdata","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





