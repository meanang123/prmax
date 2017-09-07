//-----------------------------------------------------------------------------
// Name:    OutletEditMainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.outlets.OutletEditMainDetails");

dojo.declare("prmax.dataadmin.outlets.OutletEditMainDetails",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/OutletEditMainDetails.html"),
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch ( this , this._UpdatedCall );
		this._MediaOnlyCallBack = dojo.hitch(this, this._MediaOnlyCall );
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));

	},
	postCreate:function()
	{
		this.prmax_outlettypeid.store = PRCOMMON.utils.stores.OutletTypes();
		this.frequency.store = PRCOMMON.utils.stores.Frequency();
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.countryid.store = PRCOMMON.utils.stores.Countries();

		this.inherited(arguments)
	},
	_UpdatedCall: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
			dojo.publish(PRCOMMON.Events.Outlet_Updated,[response.data]);
			this._ClearReason();
		}
		else
		{
			alert("Failed to updated");
		}
		this.updateBtn.cancel();
	},
	Clear:function()
	{
	},
	_ClearReason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.reason.set("value","");
		this.updateBtn.cancel();
	},
	Load:function( outletid, outlet )
	{
		this._outletid = outletid;
		this.outletname.set("value", outlet.outlet.outletname ) ;
		this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);
		this.countryid.set("value",outlet.outlet.countryid);
		this.address1.set("value",outlet.address.address1);
		this.address2.set("value",outlet.address.address2);
		this.townname.set("value",outlet.address.townname);
		this.county.set("value",outlet.address.county);
		this.postcode.set("value",outlet.address.postcode);

		this.circulation.set("value", outlet.outlet.circulation ) ;
		this.frequency.set("value", outlet.outlet.frequencyid ) ;

		this.www.set("value",outlet.outlet.www);
		this.email.set("value",outlet.communications.email);
		this.tel.set("value",outlet.communications.tel);
		this.fax.set("value",outlet.communications.fax);
		this.linkedin.set("value",outlet.communications.linkedin);
		this.twitter.set("value",outlet.communications.twitter);
		this.facebook.set("value",outlet.communications.facebook);
		this.instagram.set("value",outlet.communications.instagram);

		this.interests.set("value",outlet.interests ) ;
		this.coverage.set("value",outlet.coverage ) ;

		this.outletid.set("value",outlet.outlet.outletid);
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.reason.set("value","");
	},
	_Update: function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.updateBtn.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._UpdatedCallBack,
				url:'/outlets/research_update_main',
				content: this.form.get("value")
		}));
	},
	_Delete:function()
	{
			this.outlet_delete_ctrl.Load ( this._outletid, this.outletname.get("value") );
			this.outlet_delete_dlg.show();
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "out_del" )
			this.outlet_delete_dlg.hide();
	},
	_MediaOnlyCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Social Media Only Updated");
		}
		else
		{
			alert("Problem Updating Social Media Only");
		}
	},
	_UpdateMediaOnly:function()
	{
		if ( this.twitter.isValid() == false ||
				this.facebook.isValid() == false ||
				this.instagram.isValid() == false ||
				this.linkedin.isValid() == false )
		{
			alert("Invalid Data");
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._MediaOnlyCallBack,
			url: "/outlets/research_update_media",
			content: this.form.get("value")}));
	}
});





