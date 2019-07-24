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
	"dojo/text!../clippings/templates/output_std.html",
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
return declare("prcommon2.clippings.output_std",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._complete_call_back = dojo.hitch(this, this._complete_call);
		
		this._clients = new JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		
		this._customerid = null;
	},
	postCreate:function()
	{
		this.clientid.set("store",this._clients);
		this.issueid.set("store", this._issues);

		domattr.set(this.issue_label, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label, "innerHTML", PRMAX.utils.settings.client_name);
	
		this.inherited(arguments);
	},
	load:function(dialog, customerid)
	{
		//this._clear();
		this._dialog = dialog;	
		this._customerid = customerid;
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
		else if (this.csv.checked)
		{
			content['reportoutputtypeid'] = this.csv.get("value");
		}
		if (this.source_selected.checked)
		{
			content['source'] = 'selected';
		}
		else
		{
			content['source'] = 'criteria';
			content['drange'] = this.drange.get("value");
			content['clientid'] = this.clientid;
			content['issueid'] = this.issueid;
		}
		content['reporttemplateid'] = 35;
		content['customerid'] = this._customerid;
		
		this.report_dlg.show();
		this.report_node.SetCompleted(this._complete_call_back);
		this.report_node.start(content);

	},
	clear:function()
	{
		this.clientid.set("value",null);
		this.issueid.set("value",null);
		this.drange.clear();	
		this.report_node.hide();
		domclass.remove(this.report_node.domNode,"prmaxhidden");
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
		this.report_dlg.hide();
		this._close();
	},
	_change_source:function()
	{
		if (this.source_selected.checked)
		{
			domclass.add(this.client_label, "prmaxhidden");
			domclass.add(this.clientid.domNode, "prmaxhidden");
			domclass.add(this.issue_label, "prmaxhidden");
			domclass.add(this.issueid.domNode, "prmaxhidden");
			domclass.add(this.drange_label, "prmaxhidden");
			domclass.add(this.drange.domNode, "prmaxhidden");
		}
		else
		{
			domclass.remove(this.client_label, "prmaxhidden");
			domclass.remove(this.clientid.domNode, "prmaxhidden");
			domclass.remove(this.issue_label, "prmaxhidden");
			domclass.remove(this.issueid.domNode, "prmaxhidden");
			domclass.remove(this.drange_label, "prmaxhidden");
			domclass.remove(this.drange.domNode, "prmaxhidden");
		}
	}
});
});


