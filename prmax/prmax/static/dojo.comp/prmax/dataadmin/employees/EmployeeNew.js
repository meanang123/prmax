//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeNew
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.dataadmin.employees.EmployeeNew");

dojo.declare("prmax.dataadmin.employees.EmployeeNew",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	displayname:"New Person",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/EmployeeNew.html"),
	constructor: function() {
		this._AddCallBack = dojo.hitch(this,this._AddCall);
		this._parentcallback = null;
	},
	postCreate:function()
	{
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	_AddContact:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			return;
		}

		if ( confirm("Add Contact?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._AddCallBack,
				url:'/contacts/research_addnew',
				content: this.form.get("value")
				}));
		}
	},
	_AddCall:function( response )
	{
		console.log(response);

		if (response.success=="OK")
		{
			alert("Contact Added");
			if ( this._parentcallback )
				this._parentcallback(response.contact);
			dojo.publish(PRCOMMON.Events.Person_Added, [response.contact]);
			this._ClearAddForm();
			dojo.publish(PRCOMMON.Events.Dialog_Close, ["cont_add"]);
		}
		else
		{
				alert("Failed");
		}
	},
	_ClearAddForm:function()
	{
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.reason.set("value","")
	},
	_setCallbackAttr:function( func)
	{
		this._parentcallback = func;
	},
	focus:function()
	{
		this.familyname.focus();
	},
	Disabled:function( status )
	{
		this.prefix.set("disabled",status);
		this.firstname.set("disabled",status);
		this.familyname.set("disabled",status);
		this.reasoncodeid.set("disabled",status);
		this.reason.set("disabled",status);
	}
});
