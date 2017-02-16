//-----------------------------------------------------------------------------
// Name:    prmax.levelcert.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/10/2015
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.levelcert.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.levelcert.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.levelcert","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





