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
dojo.provide("prmax.dataadmin.outlets.OutletEditPrn");

dojo.declare("prmax.dataadmin.outlets.OutletEditPrn",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/OutletEditPrn.html"),
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch ( this , this._UpdatedCall );
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.store = PRCOMMON.utils.stores.OutletTypes();
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
		this.inherited(arguments);
	},
	_UpdatedCall: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
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
		this._outletid = -1;
		this.outletid.set("value",-1);
	},
	Load:function( outletid, outlet )
	{
		this._outletid = outletid;
		this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);
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
				url:'/outlets/research_update_prn',
				content: this.form.get("value")
		}));
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});





