//-----------------------------------------------------------------------------
// Name:    prmax.blueboo.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.blueboo.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.blueboo.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.blueboo","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





