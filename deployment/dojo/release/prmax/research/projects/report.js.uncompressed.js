require({cache:{
'url:research/projects/templates/report.html':"<div style=\"margin:10px\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"researchprojectid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"researchprojectid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Assign To</td><td><select data-dojo-attach-point=\"owner_id\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"owner_id\",searchAttr:\"owner_name\",labelType:\"html\",style:\"width:300px\"'/></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Outlet</td><td><select data-dojo-attach-point=\"outletid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"outletid\",searchAttr:\"outletname\",labelType:\"html\",style:\"width:300px\"'/></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Date</td><td data-dojo-type=\"prcommon2/date/daterange\" data-dojo-attach-point=\"drange\"></td></tr>\r\n\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t<td align=\"right\"><button data-dojo-attach-event=\"onClick:_do_report\" data-dojo-attach-point=\"reportbtn\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait...\" label=\"Report\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n<div data-dojo-attach-point=\"report_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Projects Report\" data-dojo-props='style:\"width:300px\"'>\r\n\t<div data-dojo-type=\"prcommon2/reports/ReportBuilder\" data-dojo-attach-point=\"report_node\"></div>\r\n</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Report
// Author:  Stamatia Vatsi
// Purpose:
// Created: Oct/2019
//
// To do:   Generate reports for project
//
//-----------------------------------------------------------------------------

define("research/projects/report", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/report.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",	
	"dojo/topic",
	"dojo/data/ItemFileReadStore",	
	"ttl/store/JsonRest",
	"dojox/data/JsonRestStore",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"dijit/form/DateTextBox",
	"prcommon2/reports/ReportBuilder",
	"prcommon2/date/daterange"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, domattr, topic, ItemFileReadStore, JsonRest, JsonRestStore){
 return declare("research.projects.report",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._researchers = new JsonRestStore( {target:'/research/admin/user/list_researchers', labelAttribute:"owner_name",idProperty:"owner_id"});
		this._outlets =  new JsonRest( {target:'/research/admin/outlets/list_outlet_rest', idProperty:"outletid"});


		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
		
		this._complete_call_back = lang.hitch(this, this._complete_call);
		
		this._dialog = null;

	},
	postCreate:function()
	{
		this.owner_id.set("store",this._researchers);	
		this.outletid.set("store", this._outlets)
		this.owner_id.set("value", "");	
	},
	clear:function()
	{
		this.owner_id.set("value", "");
		this.reportbtn.cancel();
	},
	load:function(dialog, data)
	{
		this._dialog = dialog;
		this.clear();
		this._researchprojectid = data.researchprojectid;

	},
	_close:function()
	{
		if ( this._dialog)
		{
			this.reportbtn.cancel();		
			this._dialog.hide();
		}
	},
	_do_report:function()
	{
		var content = {};
		content['data'] = {};
		content['reportoutputtypeid'] = 4; //excel
		content['reporttemplateid'] = 36;
		content['customerid'] = -1;

		content['owner_id'] = this.owner_id.get("value");
		content['outletid'] = this.outletid.get("value");
		content['drange'] = this.drange.get("value");


		
		this.report_dlg.show();
		this.report_node.SetCompleted(this._complete_call_back);
		this.report_node.start(content);
	},
	_complete_call:function()
	{
		this.report_dlg.hide();
		this._close();
	},
});
});
