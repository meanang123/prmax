//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/EmployeeDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr ,domclass){
 return declare("research.employees.EmployeeDelete",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._deleted_contact_call_back = lang.hitch(this, this._deleted_contact_call );
	},
	postCreate:function()
	{
		this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Codes());
		this.inherited(arguments);
	},
	_delete_submit:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}
		if  ( confirm ("Delete " + domattr.get(this.heading,"innerHTML" ) + " ?" ))
		{
			request.post('/research/admin/employees/research_employee_delete',
				utilities2.make_params({data:this.form.get("value")})).then
				( this._deleted_contact_call_back);
		}
	},
	_deleted_contact_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			topic.publish(PRCOMMON.Events.Employee_Deleted, response.data);
			if ( response.data.has_deleted == false )
				alert("Contact deleted but retained role");
			else
				alert("Contact Deleted");
			this.clear();
			this._dialog.hide()
		}
		else
		{
			alert ( "Problem Deleteing Contact" ) ;
		}
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	},
	// styandard clear function
	clear:function()
	{
		this.employeeid.set("value", -1 ) ;
		this.reasoncodes.set("value",null);
		domattr.set(this.delete_completely, "checked", "checked");
	},
	load:function( employeeid, job_title , name )
	{
		this.employeeid.set("value", employeeid );
		domattr.set(this.heading,"innerHTML" , job_title + "(" + name + ")" ) ;
		this.reasoncodes.set("value", null);
		domattr.set(this.delete_completely, "checked", "checked");
	},
	_close:function()
	{
		this._dialog.hide();
	}

});
});





