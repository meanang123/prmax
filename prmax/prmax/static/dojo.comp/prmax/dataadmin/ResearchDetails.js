//-----------------------------------------------------------------------------
// Name:    AuditViewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.ResearchDetails");

dojo.declare("prmax.dataadmin.ResearchDetails",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/ResearchDetails.html"),
	constructor: function()
	{
		this._objecttypeid = 1;
	},
	postCreate:function()
	{
		this.researchfrequencyid.store = PRCOMMON.utils.stores.Research_Frequencies();
		this._LoadCallBack = dojo.hitch ( this, this._LoadCall);
		this._UpdateCallBack = dojo.hitch ( this, this._UpdateCall);
		this.inherited(arguments);
	},
	Load:function(  outletid , outlettypeid)
	{
		this.outletid.set("value", outletid );
		this._objecttypeid = 1;
		if ( outlettypeid == 19)
			this._objecttypeid = 4;

		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadCallBack,
					url:'/dataadmin/reseach_details_get',
					content: {outletid: outletid}
					}));
	},
	_LoadCall:function ( response )
	{
		if ( response.success=="OK")
		{
			if (response.data != null )
			{
				this.outletid.set("value", response.data.outletid );
				this.surname.set("value", response.data.surname );
				this.firstname.set("value", response.data.firstname );
				this.prefix.set("value", response.data.prefix );
				this.email.set("value", response.data.email );
				this.tel.set("value", response.data.tel );
				this.researchfrequencyid.set("value", response.data.researchfrequencyid );
				this.notes.set("value", response.data.notes );
				this.job_title.set("value", response.data.job_title );
				this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
				this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			}
			else
			{
				this.Clear();
				this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
				this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			}
			this.saveBtn.set("disabled",false);
		}
	},
	Clear:function()
	{
		this.surname.set("value", "" );
		this.firstname.set("value", "" );
		this.prefix.set("value", "" );
		this.email.set("value", "" );
		this.tel.set("value", "" );
		this.job_title.set("value","");
		this.researchfrequencyid.set("value", null );
		this.notes.set("value", "" );
		this.saveBtn.set("disabled",true);
	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveBtn.cancel();
			return;
		}
		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._UpdateCallBack,
					url:'/dataadmin/reseach_details_update',
					content: this.form.get("value")
					}));
	},
	_UpdateCall:function( response )
	{
		if ( response.success=="OK")
		{
			alert("Research Details Updated");
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		}
		else
		{
			alert("Update Research Details Failed");
		}
		this.saveBtn.cancel();
	},
	_ShowQDlg:function()
	{
		this.qctrl.Load( this.outletid.get("value") , this._objecttypeid , this.email.get("value"), this.firstname.get("value"), this.qdlg );
	},
	_Preview:function()
	{
		dojo.attr(this.preview_objecttypeid,"value", this._objecttypeid );
		dojo.attr(this.preview_objectid,"value", this.outletid.get("value") );
		this.previewform.submit();

	}
});





