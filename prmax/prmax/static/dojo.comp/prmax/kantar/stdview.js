//-----------------------------------------------------------------------------
// Name:    prmax.kantar.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 05/09/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.kantar.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.kantar.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.kantar","templates/stdview.html")
});