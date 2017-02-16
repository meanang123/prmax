//-----------------------------------------------------------------------------
// Name:    prmax.updatum.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.updatum.stdview");


dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.updatum.stdview",
	[ ttl.BaseWidget,prmax.display.StdViewCommon],{
		widgetsInTemplate: true,
		private_data:true,
		templatePath: dojo.moduleUrl( "prmax.updatum","templates/stdview.html")
});