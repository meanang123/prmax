//-----------------------------------------------------------------------------
// Name:    prmax.phoenixpd.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 22/09/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.phoenixpd.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.phoenixpd.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.phoenixpd","templates/stdview.html")
});