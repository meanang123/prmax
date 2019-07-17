//-----------------------------------------------------------------------------
// Name:    WebDatesAdd
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../web/templates/WebButton.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, topic ){
 return declare("prcommon2.web.WebButton",
	[BaseWidgetAMD],{
	templateString: template,
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
		var url = "";
		if (typeof this.webbutton == 'string')
		{
			url = this.webbutton;
		}
		else
		{
			url = this.webbutton.get("value");
		}
		if (url && url != '')
		{
			var win = window.open(url, '_blank');
			win.focus();
		}
	}});
});
