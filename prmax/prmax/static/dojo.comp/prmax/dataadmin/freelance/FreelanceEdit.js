//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.dataadmin.freelance.FreelanceEdit");

dojo.declare("prmax.dataadmin.freelance.FreelanceEdit",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.freelance","templates/FreelanceEdit.html"),
	constructor: function() {
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._LoadCallBack= dojo.hitch(this,this._Loaded);
		this.outletid = -1 ;

		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));

	},
	postCreate:function()
	{
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.countryid.store = PRCOMMON.utils.stores.Countries();

		this.inherited(arguments);
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Updated");
			this._ClearReason();
		}
		else
		{
			alert("Failed to update ");
		}
		this.saveNode.cancel();
	},
	_ClearReason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.reason.set("value","");
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
						url: '/outlets/freelance_research_update' ,
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
		this.outletid.set("value",-1);
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
		this.countryid.set("value",1);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this._ClearReason();
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	Load:function( outletid )
	{
		this._outletid = outletid;
		this._name = "";
		this.outlet_audit_ctrl.Load ( this._outletid ) ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url:'/outlets/freelance_get_for_load',
				content: {outletid: outletid}
		}));
	},
	_Loaded:function( response )
	{
		if  ( response.success == "OK" )
		{
			var data = response.data;

			this._name = data.contact.familyname;

			this.selectcontact.set("value",data.employee.contactid);
			this.outletid.set("value",data.outlet.outletid);
			this.address1.set("value",data.address.address1);
			this.address2.set("value",data.address.address2);
			this.townname.set("value",data.address.townname);
			this.county.set("value",data.address.county);
			this.postcode.set("value",data.address.postcode);
			this.www.set("value", data.outlet.www);
			this.email.set("value",data.comm.email);
			this.tel.set("value",data.comm.tel);
			this.fax.set("value",data.comm.fax);
			this.mobile.set("value",data.comm.mobile);
			this.interests.set("value",data.interests);
			this.profile.set("value",data.outlet.profile);
			this.countryid.set("value",data.outlet.countryid);
			this.twitter.set("value",data.comm.twitter);
			this.facebook.set("value",data.comm.facebook);
			this.linkedin.set("value",data.comm.linkedin);
			this.instagram.set("value",data.comm.instagram);

			this._ClearReason();
			this.outlet_research_ctrl.Load( data.outlet.outletid,19 );
		}
		else
		{
			alert("Problem Loading freelancer");
		}
	},
	_ShowDetails:function()
	{
		this.freelance_container.selectChild ( this.freelance_details_view ) ;
	},
	_ShowAudit:function()
	{
		this.freelance_container.selectChild ( this.freelance_activity_view ) ;
	},
	_ShowResearch:function()
	{
		this.freelance_container.selectChild ( this.freelance_research_view ) ;
	},
	_Delete:function()
	{
		this.delete_ctrl.Load ( this._outletid ,this._name);
		this.delete_dlg.show();
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "free_del" )
			this.delete_dlg.hide();
	}
});
