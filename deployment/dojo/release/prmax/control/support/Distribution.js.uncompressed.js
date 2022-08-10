require({cache:{
'url:control/support/templates/distribution.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:35px;width:100%;overflow:hidden;border:1px solid black\"'>\r\n\t\t<div class=\"dijitToolbarTop\" data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:100%;width:100%\"' >\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-search-plus fa-2x\",showLabel:true' data-dojo-attach-event=\"onClick:_refresh\">Refresh</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-first-order fa-2x\",showLabel:true' data-dojo-attach-event=\"onClick:_force_out\">Prioritiese Release for Account</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",style:\"width:100%;height:240px\"'>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    control.support.Distribution
// Author:
// Purpose:
// Created: 17//
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/support/Distribution", [
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
