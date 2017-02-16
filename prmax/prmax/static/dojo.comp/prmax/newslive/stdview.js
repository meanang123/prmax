//-----------------------------------------------------------------------------
// Name:    prmax.newslive.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 29/09/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.newslive.stdview");


dojo.require("prmax.display.StdViewCommon");

// Create control button on a row

dojo.declare("prmax.newslive.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container,prmax.display.StdViewCommon],{
		widgetsInTemplate: true,
		private_data:true,
		templatePath: dojo.moduleUrl( "prmax.newslive","templates/stdview.html"),
	constructor: function() {
	}
});