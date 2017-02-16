//-----------------------------------------------------------------------------
// Name:    prcommon.advance.search
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.search");

dojo.declare("prcommon.advance.search",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/search.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	focus:function()
	{
	}
});





