//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/09/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.newslive.view");

dojo.require("prcommon.data.DataStores");
dojo.require("ttl.uuid");
dojo.require("ttl.GridHelpers");

dojo.declare("prmax.newslive.view",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.newslive","templates/view.html"),
	constructor: function()
	{
	},
	resize:function()
	{
		this.inherited(arguments);
	}
});





