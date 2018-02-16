//-----------------------------------------------------------------------------
// Name:    ExpandedText
// Author:
// Purpose:
// Created: Feb 2018
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prcommon.common.ExpandedText");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.common.ExpandedText",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.common","templates/ExpandedText.html"),
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
