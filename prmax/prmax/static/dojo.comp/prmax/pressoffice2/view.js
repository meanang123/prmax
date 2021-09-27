//-----------------------------------------------------------------------------
// Name:    prmax.pressoffice.view.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Nov 2019
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressoffice.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.pressoffice.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.pressoffice","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





