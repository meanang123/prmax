//-----------------------------------------------------------------------------
// Name:    prmax.deperslijst.stdview
// Author:  Chris Hoy
// Purpose:
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.deperslijst.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.deperslijst.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.deperslijst","templates/stdview.html"),
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});
