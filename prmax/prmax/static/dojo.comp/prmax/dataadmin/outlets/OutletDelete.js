//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.outlets.OutletDelete");

dojo.declare("prmax.dataadmin.outlets.OutletDelete",
	[ prcommon.search.std_search,ttl.BaseWidget],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/OutletDelete.html"),
		constructor: function()
		{
			this._DeleteCallBack = dojo.hitch(this, this._DeleteCall );
		},
		postCreate:function()
		{
			this.reasoncodes.store = PRCOMMON.utils.stores.Research_Reason_Del_Codes();
			this.inherited(arguments);
		},
		_DeleteSubmit:function()
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

			if ( confirm("Delete Outlet " + dojo.attr(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Outlet are you sure?"))
				{
					dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._DeleteCallBack,
							url:'/outlets/research_delete',
							content: this.form.get("value")
						}));
				}
			}
		},
		_DeleteCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Outlet_Deleted,[response.data]);
				alert("Outlet Deleted");
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["out_del"]);
				this.Clear();
			}
			else
			{
				alert ( "Problem Deleteing Contact" ) ;
			}
		},
		// styandard clear function
		Clear:function()
		{
			this.outletid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			dojo.attr(this.heading,"innerHTML" , "" ) ;
		},
		Load:function( outletid, outletname )
		{
			this.outletid.set("value", outletid );
			dojo.attr(this.heading,"innerHTML" , outletname ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
	}
);





