//-----------------------------------------------------------------------------
// Name:    ContactInterests.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/11/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.employees.ContactInterests");

dojo.declare("prmax.dataadmin.employees.ContactInterests",
	[ prcommon.search.std_search,ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/ContactInterests.html"),
	constructor: function()
	{
		this._ChangedCallBack = dojo.hitch(this,this._ChangedCall);

	},
	postCreate:function()
	{
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._ChangeInterests));

		this.inherited(arguments);
	},
	_ChangeInterests:function()
	{
		if  ( confirm ("Change Keywords from the Selected Contact to these Keywords"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._ChangedCallBack,
					url:'/employees/research_contact_interests' ,
					content: this.form.get("value")
			}));
		}
	},
	_ChangedCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Contact Keywords Changed");
			dojo.publish(PRCOMMON.Events.Dialog_Close, ["contact_int_ch"]);
		}
		else
		{
			alert ( "Problem Changing Contact Keywords" ) ;
		}
	}
});





