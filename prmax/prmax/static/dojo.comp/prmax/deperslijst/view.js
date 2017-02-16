//-----------------------------------------------------------------------------
// Name:    prmax.deperslijst.view.js
// Author:  Chris Hoy
// Purpose:
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.deperslijst.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.deperslijst.view",
	[ ttl.BaseWidget ],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.deperslijst","templates/view.html"),
	resize:function()
	{
		this.inherited(arguments);
	}
});





