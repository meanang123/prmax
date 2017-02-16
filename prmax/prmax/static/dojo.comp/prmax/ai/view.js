//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/09/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.ai.view");

dojo.declare("prmax.ai.view",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	data: "",
	widgetsInTemplate: true,
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.ai","templates/view.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	resize:function()
	{
		//this.frame.resize(arguments[0]);
		this.inherited(arguments);
	}

});





