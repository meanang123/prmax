//-----------------------------------------------------------------------------
// Name:    prmax.stereotribes.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 14/07/2016
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.stereotribes.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.stereotribes.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.stereotribes","templates/stdview.html"),
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});
