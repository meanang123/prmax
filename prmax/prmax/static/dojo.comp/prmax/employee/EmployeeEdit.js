//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.employee.EmployeeEdit");

dojo.require("prcommon.interests.Interests");
dojo.require("ttl.utilities");
dojo.require( "dojox.data.JsonRestStore");

dojo.declare("prmax.employee.EmployeeEdit",
	[ ttl.BaseWidget],
	{
	parentcontrol: "",
	employeeid:-1,
	outletid:-1,
	addsession:false,
	widgetsInTemplate: true,
	startuploaded:0,
	templatePath: dojo.moduleUrl( "prmax.employee","templates/employee_edit.html"),
	constructor: function()
	{
		this._SavedCall = dojo.hitch(this,this._Saved);
		this._LoadCall= dojo.hitch(this,this._Load);
		this._jobroles = new dojox.data.JsonRestStore( {target:"/roles/job_roles_select", idAttribute:"prmaxroleid"});

	},
	_Saved:function(response)
	{
		console.log("_Saved",response);

		if (response.success=="OK")
		{
			if (this.employeeidNode.get("value")==-1)
			{
				this.employeeidNode.set("value",response.employee.employeeid);
				dojo.publish(PRCOMMON.Events.Employee_Add, [response.employee]);
				if (response.session)
					dojo.publish(PRCOMMON.Events.SearchSession_Added, [response.session, response.count]);
				alert("Contact added");
				this._Close();
			}
			else
			{
				dojo.publish(PRCOMMON.Events.Employee_Updated, [response.employee,response.searchsessionid]);
				alert("Employee updated");
				this._Close();
			}
		}
		else
		{
			alert("Problem");
		}
		this.saveNode.cancel();
	},
	postCreate:function()
	{
		dojo.connect(this.formNode,"onSubmit",dojo.hitch(this,this._Save));

		this.inherited(arguments);

	},
	startup:function()
	{
		if (this.startuploaded==0)
		{
			this.startuploaded = 1 ;
			this.outletidNode.set("value",this.outletid);
			this.employeeidNode.set("value",this.employeeid);

			if (this.employeeid!=-1)
				this.Load();
			else
			{
				this.saveNode.set('disabled',false);
				this.interests.clear_private();
			}
		}
		this.inherited(arguments);
	},
	Load:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCall,
			url:'/employees/getedit',
			content: {employeeid:this.employeeid}}));
	},
	_Load:function(response)
	{
		console.log("_Load",response);
		this.employeeidNode.set("value",response.data.employee.employeeid);
		this.job_title.set("value",response.data.employee.job_title);
		this.email.set("value",response.data.comm.email);
		this.tel.set("value",response.data.comm.tel);
		this.fax.set("value",response.data.comm.fax);
		this.mobile.set("value",response.data.comm.mobile);
		this.twitter.set("value",response.data.comm.twitter);
		this.facebook.set("value",response.data.comm.facebook);
		this.linkedin.set("value",response.data.comm.linkedin);
		this.interests.set("value",response.data.interests);
		this.profile.set("value",response.data.employee.profile);
		this.prefix.set("value",response.data.contact.prefix);
		this.firstname.set("value",response.data.contact.firstname);
		this.familyname.set("value",response.data.contact.familyname);

		this.saveNode.set('disabled',false);
		this.job_title.focus();
	},
	_Submit:function()
	{
		this.formNode.submit();
	},
	_Save:function(response)
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}
		var content = this.formNode.get("value");
		if (this.addsession)
			content["addsession"] = 1;
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCall,
			url:'/employees/addnew',
			content: content}));

	},
	Clear:function()
	{
		this.employeeidNode.set("value",-1);
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.job_title.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.linkedin.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");

	},
	_Close:function()
	{
		PRMAX.search.largeDialog.hide();
	}
});
