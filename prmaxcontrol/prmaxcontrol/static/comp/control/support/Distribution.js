//-----------------------------------------------------------------------------
// Name:    control.support.Distribution
// Author:
// Purpose:
// Created: 17//
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../support/templates/distribution.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2",
	"dojox/data/JsonRestStore"
	], function(declare, BaseWidgetAMD, template,BorderContainer, lang, domattr,domclass,domstyle,request,utilities2, JsonRestStore){
 return declare("control.support.Distribution",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_refresh:function()
	{

	},
	_force_out:function()
	{

	}
});
});
