//-----------------------------------------------------------------------------
// Name:    prmax.display.StdBanner
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.display.StdView");

dojo.require("prmax.display.StdViewCommon");
dojo.require("ttl.BaseWidget");

//prmax.display.StdViewCommon

// Create control button on a row

dojo.declare("prmax.display.StdView",
	[ttl.BaseWidget, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.display","templates/StdView.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	}

});