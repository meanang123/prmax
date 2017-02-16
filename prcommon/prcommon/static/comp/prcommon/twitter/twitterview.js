//-----------------------------------------------------------------------------
// Name:    prcommon.twitter.twitteredit
// Author:  Chris Hoy
// Purpose:
// Created: 15//08/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.twitter.twitterview");


dojo.require("dojo.io.script");

dojo.require("ttl.BaseWidget");
// Main control
dojo.declare("prcommon.twitter.twitterview",
	[ ttl.BaseWidget ],
	{
	tweetSearchUrl: 'http://search.twitter.com/search.json',
	twitterName:"",
	tweetCount:5,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.twitter","templates/twitterview.html"),
	constructor: function()
	{
	},
	_setTwitternameAttr:function ( value )
	{
		this.twitterName = value;
		dojo.attr(this.employee_display_twitter,"href", value);
	},
	Clear:function()
	{
	},
	Load:function()
	{
	}
});





