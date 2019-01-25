//-----------------------------------------------------------------------------
// Name:    prcommon2/clippings/output
// Author:
// Purpose:
// Created: January 2018
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/output.html",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dijit/form/Select",
	"dojox/validate/regexp",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/date/daterange",
	"dijit/form/ComboBox",
	"prcommon2/reports/ReportBuilder"	
	], function(declare,BaseWidgetAMD,template,ContentPane,BorderContainer,utilities2,topic,request,JsonRestStore,JsonRest,Observable,lang,domattr,ItemFileReadStore,domclass,domConstruct){
return declare("prcommon2.clippings.output",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._complete_call_back = dojo.hitch(this, this._complete_call);
		this._windowid = null;
		this._customerid = null;
		this._window_data = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function(dialog, windowid, customerid, data)
	{
		//this._clear();
		this._dialog = dialog;	
		this._windowid = windowid;
		this._customerid = customerid;
		this._window_data = data;
	},
	_do_report:function()
	{
		var content = {};
		content['data'] = {};
		if (this.pdf.checked)
		{
			content['reportoutputtypeid'] = 0;
		}
		else if (this.excel.checked)
		{
			content['reportoutputtypeid'] = this.excel.get("value");
		}
		content['reporttemplateid'] = 34;
		content['windowid'] = this._windowid;
		content['customerid'] = this._customerid;
		content['dashboardsettingsmodeid'] = this._window_data.dashboardsettingsmodeid;
		content['dashboardsettingsstandardid'] = this._window_data.dashboardsettingsstandardid;
		content['dashboardsettingsstandardsearchbyid'] = this._window_data.dashboardsettingsstandardsearchbyid;
		content['questionid'] = this._window_data.questionid;
		content['questiontypeid'] = this._window_data.questiontypeid;
		content['daterangeid'] = this._window_data.daterangeid;
		content['chartviewid'] = this._window_data.chartviewid;
		content['by_client'] = this._window_data.by_client;
		content['by_issue'] = this._window_data.by_issue;
		content['groupbyid'] = this._window_data.groupbyid;
		content['clientid'] = this._window_data.clientid;
		content['issueid'] = this._window_data.issueid;
		content['data'] = JSON.stringify(this._window_data);
		
		this.report_dlg.show();
		this.report_node.SetCompleted(this._complete_call_back);
		this.report_node.start(content);

	},
	clear:function()
	{
		this.report_node.hide();
		dojo.removeClass(this.report_node.domNode,"prmaxhidden");
	},
	_close:function()
	{
		if ( this._dialog)
		{
			this.report_node.Stop();
			this._dialog.hide();
			this.clear();
		}
	},
	_complete_call:function()
	{
		this.report_dlg.hide();
		this._close();
//		this.clear();
	},
//	_complete_call:function()
//	{
//		this.report_dlg.hide();
//	},
});
});


