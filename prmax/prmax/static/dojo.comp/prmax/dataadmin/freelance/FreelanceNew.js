//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.dataadmin.freelance.FreelanceNew");

dojo.declare("prmax.dataadmin.freelance.FreelanceNew",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.freelance","templates/FreelanceNew.html"),
	constructor: function() {
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._LoadCallBack= dojo.hitch(this,this._Loaded);
		this.outletid = -1 ;

	},
	postCreate:function()
	{
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.countryid.store = PRCOMMON.utils.stores.Countries();

		this.inherited(arguments);
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Added");
			this.New();
			this.selectcontact.focus();
		}
		else
		{
			alert("Failed");
		}
		this.saveNode.cancel();
	},
	Save:function()
	{
		if ( ttl.utilities.formValidator(this.requiredNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCallBack,
						url: '/outlets/freelance_research_add' ,
						content: this.requiredNode.get("value")
						})	);
	},
	New:function()
	{
		this.Clear();
	},
	Clear:function()
	{
		this.saveNode.cancel();
		this.selectcontact.Clear();
		this.outletNode.set("value",-1);
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.reason.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");

	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	}
});
