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
dojo.provide("prmax.dataadmin.employees.EmployeeDelete");

dojo.declare("prmax.dataadmin.employees.EmployeeDelete",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/EmployeeDelete.html"),
		constructor: function()
		{
			this._DeletedContactCallBack = dojo.hitch(this, this._DeletedContactCall );
		},
		postCreate:function()
		{
			this.reasoncodes.store = PRCOMMON.utils.stores.Research_Reason_Del_Codes();
			dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._DeleteSubmit));

			this.inherited(arguments);
		},
		_DeleteSubmit:function()
		{
			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required fields filled in");
				return;
			}
			if ( this.reason.get("value").length == 0 )
			{
				alert("No Description Given");
				this.reason.focus();
				return;
			}

			if  ( confirm ("Delete " + dojo.attr(this.heading,"innerHTML" ) + " ?" ))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DeletedContactCallBack,
						url:'/employees/research_employee_delete' ,
						content: this.form.get("value")
				}));
			}
		},
		_DeletedContactCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Employee_Deleted, [response.data.employee]);
				alert("Contact Deleted");
				this.Clear();
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["emp_del"]);
			}
			else
			{
				alert ( "Problem Deleteing Contact" ) ;
			}
		},
		// styandard clear function
		Clear:function()
		{
			this.employeeid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
		},
		Load:function( employeeid, job_title , name )
		{
			this.employeeid.set("value", employeeid );
			dojo.attr(this.heading,"innerHTML" , job_title + "(" + name + ")" ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
	}
);





