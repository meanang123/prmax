//-----------------------------------------------------------------------------
// Name:    Interests.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.outlets.OutletNew");

dojo.declare("prmax.dataadmin.outlets.OutletNew",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/OutletNew.html"),
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch ( this , this._UpdatedCall );
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.store = PRCOMMON.utils.stores.OutletTypes();
		this.frequency.store = PRCOMMON.utils.stores.Frequency();
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.countryid.store = PRCOMMON.utils.stores.Countries();

		this.inherited(arguments);
	},
	startup:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.frequency.set("value", 5);
		this.inherited(arguments);
	},
	_Update: function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveBtn.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._UpdatedCallBack,
				url:'/outlets/research_add_main',
				content: this.form.get("value")
		}));
	},
	_UpdatedCall: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Outlet Added");
			this.saveBtn.cancel();
			this.Clear();
			this.outletname.focus();
		}
		else
		{
			alert("Failed to add");
			this.saveBtn.cancel();
		}
	},
	Clear:function()
	{
		this.frequency.set("value", 5);
		this.outletname.set("value","");
		this.prmax_outlettypeid.set("value", null ) ;
		this.selectcontact.Clear();
		this.jobtitle.set("value","");
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.circulation.set("value",0);
		this.interests.set("value","");
		this.coverage.set("value","");
		this.reason.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");

		this.profile.set("value","");
		this.saveBtn.cancel();
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});





