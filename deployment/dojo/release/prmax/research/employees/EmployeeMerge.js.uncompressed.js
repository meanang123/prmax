require({cache:{
'url:research/employees/templates/EmployeeMerge.html':"<div>\r\n\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" onsubmit=\"return false;\">\r\n\t\t<input type=\"hidden\" name=\"employeeid\" value=\"-1\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"employeeid\">\r\n\t\t<table style=\"width:100%\" class=\"prmaxtable\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr><td width=\"110px\" class=\"prmaxrowtag\">Source</td><td data-dojo-attach-point=\"source_details\"></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Destination</td><td><select data-dojo-attach-point=\"employeelist\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"newemployeeid\",autoComplete:false,searchAttr:\"job_title\",labelAttr:\"extended_name\",pageSize:20,labelType:\"html\",style:\"width:20em\"'></select></td></tr>\r\n\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td ><button data-dojo-props='type:\"button\", label:\"Close\"' data-dojo-attach-event=\"onClick:_do_close\" data-dojo-type=\"dijit/form/Button\"></button></td>\r\n\t\t\t\t<td align=\"right\" ><button data-dojo-attach-point=\"mergebtn\" data-dojo-props='type:\"submit\", label:\"Merge Contacts\",busyLabel:\"Please Wait ...\"' data-dojo-attach-event=\"onClick:_do_merge\" data-dojo-type=\"dojox/form/BusyButton\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeSelect
// Author:  Chris Hoy
// Purpose: This select a contact record or creates a new one and select it
//			exposed to a form contactid and contacttype (N,S) N is for no
//			selection
// Created: 11/02/2009
//
//-----------------------------------------------------------------------------
define("research/employees/EmployeeMerge", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/EmployeeMerge.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"research/employees/PersonNew"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass){
 return declare("research.employees.EmployeeMerge",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this.employees = new JsonRestStore({target:"/research/admin/employees/contactlist_rest", idProperty:"employeeid",  labelAttribute:"job_title"});
		this._merge_call_back = lang.hitch(this,this._merge_call);
		this._dlg = null;
	},
	postCreate:function()
	{
		this.employeelist.set("store",this.employees );

		this.inherited(arguments);

	},
	load:function(employeeid,outletid,job_title, contactname,dlg)
	{
		this._dlg = dlg;
		if (contactname)
			domattr.set(this.source_details,"innerHTML",contactname + " - " + job_title);
		else
			domattr.set(this.source_details,"innerHTML",job_title);

		this.employeeid.set("value", employeeid);
		this.employeelist.set("query",{extraemployeeid:employeeid,outletid:outletid});
		this.mergebtn.cancel();

		this._dlg.show();
	},
	_do_close:function()
	{
		this._dlg.hide();
	},
	_do_merge:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if (confirm("Merge Contacts"))
		{
			request.post('/research/admin/employees/merge_contacts',
				utilities2.make_params({ data: this.form.get("value")} )).
				then (this._merge_call_back);
		}
		else
		{
			throw "N";
		}
	},
	_merge_call:function(response)
	{
		if (response.success == "OK")
		{
			alert("Merge Completed. Please verify the 'Research tab' to make sure these changes haven't effected it");
			if (response.employee.series == true)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}			
			topic.publish(PRCOMMON.Events.Employee_Deleted, {has_deleted:true,employeeid : this.employeeid.get("value") } );
			this._dlg.hide();
			//this.clear();
		}
		else
		{
			alert("Problem Merging Contacts");
		}

		this.mergebtn.cancel();
	},
	_clear:function()
	{
		domattr.set(this.source_details,"innerHTML",-1);
		this.employeelist.set("value",null);
		this.employeeid.set("value",-1);
		this.mergebtn.cancel();
	}
});
});
