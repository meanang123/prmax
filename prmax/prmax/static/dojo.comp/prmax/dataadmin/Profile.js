//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.Profile");

dojo.declare("prmax.dataadmin.Profile",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/Profile.html"),
	constructor: function()
	{
		this._UpdateProfileCallBack = dojo.hitch(this, this._UpdateProfileCall);
	},
	postCreate:function()
	{
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.inherited(arguments);
	},
	resize:function()
	{
		console.log ("resize",arguments[0] ) ;

		this.borderControl.resize(arguments[0]);
		this.profile.resize( arguments[0] ) ;
	},
	Load:function ( objectid , objecttypeid , profile )
	{
		this._ClearReason();
		this._objectid = objectid;
		this._objecttypeid = objecttypeid;
		this.profile.set("value",profile);
	},
	_ClearReason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.reason.set("value","");
	},
	Clear:function()
	{
		this._objectid = null;
		this._objecttypeid = null;
		this.profile.set("value","");
		this._ClearReason();
	},
	_UpdateProfileCall:function ( response )
	{
		if ( response.success=="OK")
		{
			alert("Profile Updated");
			this._ClearReason();
		}
		else
		{
			alert("Failed to update profile");
		}

	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			return;
		}

		var content = this.form.get("value");
		content["objectid"]  = this._objectid;
		content["objecttypeid"] = this._objecttypeid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._UpdateProfileCallBack,
				url:'/outlets/research_profile',
				content: content
		}));
	}
});





