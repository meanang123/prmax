//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeSelect
// Author:  Chris Hoy
// Purpose: This select a contact record or creates a new one and select it
//			exposed to a form contactid and contacttype (N,S) N is for no
//			selection
// Created: 11/02/2009
//
//-----------------------------------------------------------------------------
define([
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
			topic.publish(PRCOMMON.Events.Employee_Deleted, {has_deleted:true,employeeid : this.employeeid.get("value") } );
			this._dlg.hide();
			this.clear();
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
