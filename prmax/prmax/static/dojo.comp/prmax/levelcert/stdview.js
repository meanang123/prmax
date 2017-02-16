//-----------------------------------------------------------------------------
// Name:    prmax.levelcert.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 19/10/2015
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.levelcert.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.levelcert.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.levelcert","templates/stdview.html"),
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});
