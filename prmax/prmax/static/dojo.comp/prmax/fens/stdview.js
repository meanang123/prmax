//-----------------------------------------------------------------------------
// Name:    prmax.fens.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 22/08/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.fens.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.fens.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.fens","templates/stdview.html"),
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});