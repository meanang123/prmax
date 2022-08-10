require({cache:{
'url:prcommon2/clippings/charts/templates/preferences.html':"<div>\r\n<span class=\"common_prmax_layout\"><br/>\r\n\t<form data-dojo-attach-point=\"form_output\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\"'>\r\n\t\t<label data-dojo-attach-point=\"all_label\">All Channels&nbsp;<input data-dojo-attach-point=\"all_channels\" data-dojo-props=\"name:'channels',value:'0',type:'radio',checked:true\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-attach-event=\"onClick:_change_preferences\"/></label><br>\r\n\t\t<label data-dojo-attach-point=\"selected_label\">Selected Channels&nbsp;<input data-dojo-attach-point=\"selected_channels\" data-dojo-props=\"name:'channels',value:'1',type:'radio'\" data-dojo-type=\"dijit/form/RadioButton\"  data-dojo-attach-event=\"onClick:_change_preferences\"/></label><br><br>\r\n\r\n\r\n\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-attach-point=\"closebtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\",style:\"float:left;align:left\"'></button>\r\n\t\t<button data-dojo-attach-event=\"onClick:_report\" data-dojo-attach-point=\"reportbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Report\",style:\"float:right;align:right\"'></button>\r\n\t\t<div data-dojo-attach-point=\"report_preferences_report_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Clippings Report\" data-dojo-props='style:\"width:300px\"'>\r\n\t\t\t<div data-dojo-type=\"prcommon2/reports/ReportBuilder\" data-dojo-attach-point=\"report_preferences\"></div>\r\n\t\t</div>\r\n\t\t<br/><br/>\r\n\t</form>\r\n</span>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    preferences.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: February 2020
//
// To do:
//
//-----------------------------------------------------------------------------
define("prcommon2/clippings/charts/preferences", [
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





