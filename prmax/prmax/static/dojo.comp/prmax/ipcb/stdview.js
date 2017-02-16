//-----------------------------------------------------------------------------
// Name:    prmax.fens.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.ipcb.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.ipcb.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.ipcb","templates/stdview.html"),
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});