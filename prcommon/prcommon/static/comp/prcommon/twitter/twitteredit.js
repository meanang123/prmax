//-----------------------------------------------------------------------------
// Name:    prcommon.twitter.twitteredit
// Author:  Chris Hoy
// Purpose:
// Created: 15//08/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.twitter.twitteredit");

dojo.require("ttl.BaseWidget");
// Main control
dojo.declare("prcommon.twitter.twitteredit",
	[ ttl.BaseWidget ],
	{
	name:"",
	value:"",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.twitter","templates/twitteredit.html"),
	constructor: function()
	{
		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	// styandard clear function
	Clear:function()
	{
	},
	_focus:function()
	{

	},
	isValid: function(/*Boolean*/ isFocused)
	{

	},
	_setValueAttr:function ( value )
	{
		this.display.set("value", value );
	},
	_getValueAttr:function()
	{
		return this.display.get("value");
	},
	_getNameAttr:function()
	{
		return this.name;
	},
	_View:function()
	{

	}
});





