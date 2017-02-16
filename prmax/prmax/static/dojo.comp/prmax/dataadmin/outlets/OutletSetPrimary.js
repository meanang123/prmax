//-----------------------------------------------------------------------------
// Name:    OutletSetPrimary.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/03/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.outlets.OutletSetPrimary");

dojo.declare("prmax.dataadmin.outlets.OutletSetPrimary",
	[ prcommon.search.std_search, ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/OutletSetPrimary.html"),
		constructor: function()
		{
			this._SetPrimaryCallBack = dojo.hitch(this, this._SetPrimaryCall );
			this.inherited(arguments);
		},
		postCreate:function()
		{
			dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._SetPrimarySubmit));
			this.reasoncodes.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
			this.inherited(arguments);
		},
		_SetPrimarySubmit:function()
		{
			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required fields filled in");
				return;
			}
			if ( this.reason.get("value").length == 0 )
			{
				alert("No Description Given");
				this.reason.focus();
				return;
			}

			if ( confirm("Set Primary  Contact " + dojo.attr(this.heading,"innerHTML" ) + "?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SetPrimaryCallBack,
						url:'/employees/research_set_primary',
						content: this.form.get("value")
					}));
			}
		},
		_SetPrimaryCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				alert("Outlet Primary Contact Changed");
				this.Clear();
				dojo.publish(PRCOMMON.Events.Employee_Updated,null);
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["out_pri"]);
			}
			else
			{
				alert ( "Problem Changed Primary Contact" ) ;
			}
		},
		// styandard clear function
		Clear:function()
		{
			this.employeeid.set("value", -1 ) ;
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			this.reason.set("value","");
			dojo.attr(this.heading,"innerHTML" , "" ) ;
		},
		Load:function( employeeid, employeename, job_title )
		{
			this.employeeid.set("value", employeeid );
			dojo.attr(this.heading,"innerHTML" , employeename ) ;
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
	}
);





