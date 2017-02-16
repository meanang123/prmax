//-----------------------------------------------------------------------------
// Name:    prmax.questionnaires.EmployeeDelete
// Author:  Chris Hoy
// Purpose:
// Created: 19/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/ContentPane",
	"dojo/text!../questionnaires/templates/EmployeeDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, ContentPane, template, request, utilities2, lang, topic, domattr ,domclass){
 return declare("research.questionnaires.EmployeeDelete",
	[BaseWidgetAMD,ContentPane],{
	templateString:template,
	constructor: function()
	{
		this._delete_call_back = lang.hitch(this,this._delete_call);
		this._error_call_back = lang.hitch(this, this._error_call);

	},
	load:function(objectid,job_title,contactname)
	{
		this.objectid.set("value",objectid);
		domattr.set(this.employee_name,"text",job_title + contactname);
		this.savenode.cancel();
		this.dialog_ctrl.show();
	},
	_delete_call:function(response)
	{
		if (response.success=="OK")
		{
			alert("Contact Deleted");
			this.dialog_ctrl.hide();
			this.objectid.set("value","-1");
			domattr.set(this.employee_name,"text","");
			topic.publish("/quest/emp_del", response.data);
		}
		else
		{
			alert("Problem with Employee ");
		}

		this.savenode.cancel();
	},
	_delete_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/projects/delete_employee_feedback',
			utilities2.make_params({ data : this.form.get("value")})).then
				(this._delete_call_back, this._error_call_back);
	},
	clear:function()
	{
		domattr.set(this.employee_name,"innerHTML","");
		this.objectid.set("value","-1");
	},
	_error_call:function()
	{
		this.savenode.cancel();
	}
});
});
