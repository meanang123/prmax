//-----------------------------------------------------------------------------
// Name:    viewers.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/06/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.solidmedia.monitoring");

dojo.declare("prmax.solidmedia.monitoring",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.solidmedia","templates/monitoring.html"),
	constructor: function()
	{

	},
	postCreate:function()
	{

		this.inherited(arguments);

	},
	resize:function()
	{
		//console.log("VIEW_RESIZE", arguments[0]);
		this.frame.resize(arguments[0]);
	}
});





