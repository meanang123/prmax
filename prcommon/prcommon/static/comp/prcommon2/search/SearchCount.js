//-----------------------------------------------------------------------------
// Name:    prcommon2.search.SearchCount
// Author:  Chris Hoy
// Purpose:
// Created: 03/10/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/SearchCount.html"
	], function(declare, BaseWidgetAMD, template ){

 return declare("prcommon2.search.SearchCount",
	[BaseWidgetAMD],{
	templateString: template,
	clear:function()
	{
		this.innerNode.innerHTML ="&nbsp;";
	},
	_getValueAttr:function()
	{
		return this.innerNode.innerHTML;
	},
	_setValueAttr:function( value )
	{
		this.innerNode.innerHTML =value;
	}
});
});
