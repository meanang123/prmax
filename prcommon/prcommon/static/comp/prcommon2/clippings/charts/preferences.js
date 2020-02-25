//-----------------------------------------------------------------------------
// Name:    preferences.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: February 2020
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../charts/templates/preferences.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/Dialog",
	"prcommon2/reports/ReportBuilder"
	], function(declare, BaseWidgetAMD, template, request,utilities2,lang,topic,domattr,domclass,dialog){
return declare("prcommon2.clippings.charts.preferences",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._data = null;
		this._leg = null;
		this._complete_call_back = lang.hitch(this, this._complete_call);

	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_load:function(dlg, data, channels)
	{
		this._data = data;
		this._channels = channels;
		this._dialog = dlg;
	},
	_report:function()
	{
		this._data['channels'] = null;
		if (this.selected_channels.checked)
		{
			this._data['channels'] = this._channels;
		}

		this.report_preferences_report_dlg.show();
		this.report_preferences.SetCompleted(this._complete_call_back);
		this.report_preferences.start(this._data);


//		dojo.addClass(this.reportbtn.domNode,"prmaxhidden");
//		this.reportnode.SetCompleted(this._complete_call_back);
//		this.reportnode.StartNoDialog(content);

	},
	clear:function()
	{
		this._dialog.hide();
		dojo.removeClass(this.reportbtn.domNode,"prmaxhidden");
	},
	_setDialogAttr:function(dialog)
	{
		this._dialog = dialog;
		if ( this._dialog != null)
		{
		dojo.removeClass(this.closebtn.domNode,"prmaxhidden");
		}
	},
	_close:function()
	{
		if ( this._dialog)
		{
			this._dialog.hide();
			this.clear();
		}
	},
	_complete_call:function()
	{
		this.report_preferences_report_dlg.hide();
		this.clear();
	},
	_change_preferences:function()
	{

	}
});
});





