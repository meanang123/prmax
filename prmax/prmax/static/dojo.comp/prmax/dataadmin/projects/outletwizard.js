//-----------------------------------------------------------------------------
// Name:    outletwizard.js
// Author:  Chris Hoy
// Purpose:
// Created: 05/09/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.projects.outletwizard");

dojo.declare("prmax.dataadmin.projects.outletwizard",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.projects","templates/outletwizard.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	resize:function()
	{
		this.inherited(arguments);
	}
});





