//-----------------------------------------------------------------------------
// Name:    ExpandedText
// Author:  Chris Hoy
// Purpose:
// Created: 06/03/2013
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../common/templates/ExpandedText.html",
	"dijit/layout/BorderContainer",
	"dijit/form/Textarea",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer ){
 return declare("prcommon2.common.ExpandedText",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
	},
	_close:function()
	{
		this._dialog.hide();
		this.text_point.set("value", "");
	},
	_save:function()
	{
		this._ctrl.set("value", this.text_point.get("value"));
		this._dialog.hide();
		this.text_point.set("value", "");
	},
	show_control:function(ctrl, dialog,title)
	{
		this._ctrl = ctrl;
		this._dialog = dialog;
		this._dialog.set("title",title);
		this.text_point.set("value", this._ctrl.get("value"));
		this._dialog.show();
	}
});
});
