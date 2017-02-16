//-----------------------------------------------------------------------------
// Name:    prcommon.messages.selectdestination
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.messages.selectdestination");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.messages.selectdestination",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.messages","templates/selectdestination.html"),
	postCreate:function()
	{
		this.inherited(arguments);
	},
	focus:function()
	{
	},
	show:function()
	{
		this.select_dialog.show();
	},
	hide:function()
	{
		this.select_dialog.hide();
	},
	_Close:function()
	{

	},
	_Send:function()
	{

	}
});





