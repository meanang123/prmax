//-----------------------------------------------------------------------------
// Name:    prmax.pressdataoffice.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressdataoffice.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.pressdataoffice.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.pressdataoffice","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





