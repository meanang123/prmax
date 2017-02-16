//-----------------------------------------------------------------------------
// Name:    prmax.outlet.EmployeeOverride
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.employee.EmployeeOverride");

dojo.require("ttl.BaseWidget")

dojo.declare("prmax.employee.EmployeeOverride",
	[ ttl.BaseWidget ],
	{
	employeeid:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.employee","templates/employee_override.html"),
	constructor: function()
	{
		this._LoadCall = dojo.hitch(this,this._Load);
		this._SavedCall = dojo.hitch(this,this._Saved);
	},
	postCreate:function()
	{
		if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
		{
			dojo.removeClass(this.interests.domNode,"prmaxhidden");
		}

		dojo.connect(this.overrideNode,"onSubmit",dojo.hitch(this,this._Submit));
		// if we put this in start up runs multiple times ?
		this.Load();
	},
	Load:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCall,
			url:'/employees/employee_override_get',
			content: {employeeid:this.employeeid}}));
	},
	_Load:function(response)
	{
		console.log(response);

		if (response.data.employee != null )
		{
			with(response.data.employee)
			{
				this.tel.set("value",tel);
				this.email.set("value",email);
				this.fax.set("value",fax);
				this.profile.set("value",profile);
				this.mobile.set("value",mobile);
			}
		}
		this.interests.set("value",response.data.interests);
		this.saveNode.set("disabled",false);
	},
	Clear:function()
	{
		// emptry fields
		this.saveNode.cancel();
		this.tel.set("value","");
		this.email.set("value","");
		this.fax.set("value","");
		this.profile.set("value","");
		this.interests.set("value","");
		this.saveNode.set("disabled",true);
		this.mobile.set("value","");

	},
	_Saved:function( response )
	{
		console.log(response);
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.Employee_Override, [response.employee]);
			alert("Details Saved");
			this.saveNode.cancel();
			this.Clear();
			dojo.publish(PRCOMMON.Events.Dialog_Close, ["employeeoverride"]);
		}
		else
		{
			alert("Problem updating details");
			this.saveNode.cancel();
		}
	},
	_Submit:function()
	{
		//	# verify form
		if ( ttl.utilities.formValidator(this.overrideNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}
		var content = this.overrideNode.getValues();
		content['employeeid'] = this.employeeid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCall,
			url:'/employees/employee_override_save',
			content: content}));
	},
	_Close:function()
	{
		this.Clear();
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["employeeoverride"]);
	},
	_Save:function()
	{
		this.overrideNode.submit();
	}
});
