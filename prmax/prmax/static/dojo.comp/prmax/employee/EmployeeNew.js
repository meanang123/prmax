//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeNew
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.employee.EmployeeNew");

dojo.require("prcommon.interests.Interests");
dojo.require("ttl.utilities");

dojo.declare("prmax.employee.EmployeeNew",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.employee","templates/employee_new.html"),
	constructor: function() {
		this._AddCallBack = dojo.hitch(this,this._AddCall);
		this._parentcallback = null;
	},
	_AddContact:function()
	{
		if (this.familyname.get("value").length == 0 )
		{
			this.addContactNode.cancel();
			alert("No Contact Name specified");
			this.familyname.focus();
			return ;
		}

		if ( confirm("Add Contact?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._AddCallBack,
				url:'/contacts/addnew',
				content: {
						prefix:this.prefix.get("value"),
						firstname:this.firstname.get("value"),
						familyname:this.familyname.get("value")
				}}));
		}
	},
	_AddCall:function( response )
	{
		console.log(response);

		if (response.success=="OK")
		{
			alert("Contact Added");
			this._parentcallback(response.contact);
			this._ClearAddForm();
		}
		else
		{
				alert("Failed");
		}

		this.addContactNode.cancel();
	},
	_ClearAddForm:function()
	{
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
	},
	_setCallbackAttr:function( func)
	{
		this._parentcallback = func;
	},
	_Close:function()
	{

	},
	focus:function()
	{
		this.familyname.focus();
	}
});
