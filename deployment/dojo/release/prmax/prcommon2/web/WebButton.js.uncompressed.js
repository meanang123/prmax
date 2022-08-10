require({cache:{
'url:prcommon2/web/templates/WebButton.html':"<span>\r\n\t<button data-dojo-attach-point=\"webbutton\" data-dojo-attach-event=\"onClick:_open_url_new_tab\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",source:\"\"'><i class=\"fa fa-eye\" aria-hidden=\"true\"></i></button>\r\n<span>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    WebDatesAdd
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/web/WebButton", [
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
