//-----------------------------------------------------------------------------
// Name:    emailvalidation
// Author:  Stamatia Vatsi
// Purpose: To check show a message if the return addres is not valid
// Created: June 2018
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prmax.pressrelease.emailvalidation");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.pressrelease.emailvalidation",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/emailvalidation.html"),
	constructor: function()
	{
		this._choice = '';
	},
	_retry:function()
	{
		this._dialog.hide();
		dojo.attr(this.message_point, 'innerHTML', "");
		this._choice = 'retry';
		dojo.publish('/send_release/check_replyaddress', [this._choice]);
	},
	_continue:function()
	{
		this._dialog.hide();
		dojo.attr(this.message_point, 'innerHTML', "");
		this._choice = 'continue';
		dojo.publish('/send_release/check_replyaddress', [this._choice]);
	},
	show_control:function(ctrl, dialog,title)
	{
		this._ctrl = ctrl;
		this._dialog = dialog;
		this._dialog.set("title",title);
		this.message_point.set("value", this._ctrl.get("value"));
		this._dialog.show();
	},
	_load:function(dialog, message)
	{
		this._dialog = dialog;
		dojo.attr(this.message_point, 'innerHTML', message);
	},
});
