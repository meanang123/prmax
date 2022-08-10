require({cache:{
'url:prcommon2/clippings/templates/output_std.html':"<div>\r\n<span class=\"common_prmax_layout\"><br/>\r\n\t<form data-dojo-attach-point=\"form_output\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\", style:\"height:300px;width:500px\"'>\r\n\t\t<label class=\"label_1\">Output Format</label>\r\n\t\t<label data-dojo-attach-point=\"pdf_label\">Pdf&nbsp;<input data-dojo-attach-point=\"pdf\" data-dojo-props=\"name:'reportoutputtypeid',value:'0',type:'radio',checked:true\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-attach-event=\"onClick:_change_format\"></label>\r\n\t\t<label data-dojo-attach-point=\"csv_label\">Csv&nbsp;<input data-dojo-attach-point=\"csv\" data-dojo-props=\"name:'reportoutputtypeid',value:'2',type:'radio'\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-attach-event=\"onClick:_change_format\"></label>\r\n\t\t<label data-dojo-attach-point=\"excel_label\">Excel&nbsp;<input data-dojo-attach-point=\"excel\" data-dojo-props=\"name:'reportoutputtypeid',value:'4',type:'radio'\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-attach-event=\"onClick:_change_format\"></label><br/><br/>\r\n\t\t\r\n\t\t<label class=\"label_1\">Source</label>\r\n\t\t<label data-dojo-attach-point=\"selected_label\">Selected&nbsp;<input data-dojo-attach-point=\"source_selected\" data-dojo-props=\"type:'radio',checked:true\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-attach-event=\"onClick:_change_source\"></label>\r\n\t\t<label data-dojo-attach-point=\"criteria_label\">Criteria&nbsp;<input data-dojo-attach-point=\"source_criteria\" data-dojo-props=\"type:'radio'\" data-dojo-type=\"dijit/form/RadioButton\"  data-dojo-attach-event=\"onClick:_change_source\"></label></br></br>\r\n\t\t\r\n\t\t<label data-dojo-attach-point=\"reporttitle_label\">Report Title&nbsp;</label><input data-dojo-attach-point=\"reporttitle\" data-dojo-props='style:\"width:300px\",name:\"reporttitle\",trim:true,type:\"text\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></label></br></br>\r\n\r\n\t\t<label data-dojo-attach-point=\"client_label\" class=\"label_1 prmaxhidden\"></label><select data-dojo-props='\"class\":\"prmaxhidden\", placeHolder:\"No Selection\",autoComplete:true,searchAttr:\"clientname\",labelType:\"html\",style:\"width:8em\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"clientid\"></select></br>\r\n\t\t<label data-dojo-attach-point=\"issue_label\" class=\"label_1 prmaxhidden\"></label><select data-dojo-props='\"class\":\"prmaxhidden\",placeHolder:\"No Selection\",name:\"issueid\",autoComplete:true,searchAttr:\"name\",required:false,invalidMessage:\"Select\",labelType:\"html\",style:\"width:8em\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"issueid\"></select></br>\r\n\t\t<label data-dojo-attach-point=\"drange_label\" class=\"label_1 prmaxhidden\">Dates</label><div data-dojo-props='\"class\":\"prmaxhidden\"' data-dojo-type=\"prcommon2/date/daterange\" data-dojo-attach-point=\"drange\"></div></br></br>\r\n\r\n\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-attach-point=\"closebtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\",\"class\":\"btnleft\"'></button>\r\n\t\t<button data-dojo-attach-event=\"onClick:_do_report\" data-dojo-attach-point=\"reportbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Generate\",\"class\":\"btnright\"'></button>\r\n\r\n\t\t<br/><br/>\r\n\t</form>\r\n</span>\r\n\t<div data-dojo-attach-point=\"report_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Clippings Report\" data-dojo-props='style:\"width:300px\"'>\r\n\t\t<div data-dojo-type=\"prcommon2/reports/ReportBuilder\" data-dojo-attach-point=\"report_node\"></div>\r\n\t</div>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prcommon2/clippings/output
// Author:
// Purpose:
// Created: January 2018
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/output_std", [
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
		content['reporttitle'] = this.reporttitle.get("value");
		if (this.source_selected.checked)
		{
			content['source'] = 'selected';
		}
		else
		{
			content['source'] = 'criteria';
			content['drange'] = this.drange.get("value");
			content['clientid'] = this.clientid.get("value");
			content['issueid'] = this.issueid.get("value");
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
	},
	_change_format:function()
	{
		if (this.pdf.checked || this.excel.checked)
		{
			domclass.remove(this.reporttitle_label, "prmaxhidden");
			domclass.remove(this.reporttitle.domNode, "prmaxhidden");
		}
		else
		{
			domclass.add(this.reporttitle_label, "prmaxhidden");
			domclass.add(this.reporttitle.domNode, "prmaxhidden");
		}
	}
});
});


