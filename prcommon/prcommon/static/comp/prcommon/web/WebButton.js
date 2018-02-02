
//-----------------------------------------------------------------------------
// Name:    WebButton.js
// Author:  
// Purpose:
// Created: Jan 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.web.WebButton");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Dialog");

dojo.declare("prcommon.web.WebButton",
	[ ttl.BaseWidget],
	{
	templatePath: dojo.moduleUrl( "prcommon.web","templates/WebButton.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
	
	},
	_getSourceAttr:function()
	{
		return this.webbutton;
	},
	_setSourceAttr:function( value )
	{
		this.webbutton = value;
	},
	_open_url_new_tab:function()
	{
		url = this.webbutton.get("value");
		if (url && url != '')
		{
			var win = window.open(url, '_blank');
			win.focus();
		}
	}
});
