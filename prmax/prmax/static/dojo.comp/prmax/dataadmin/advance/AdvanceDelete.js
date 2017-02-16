//-----------------------------------------------------------------------------
// Name:    AdvanceDelete.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/10/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.advance.AdvanceDelete");

dojo.declare("prmax.dataadmin.advance.AdvanceDelete",
	[ ttl.BaseWidget],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.advance","templates/AdvanceDelete.html"),
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

			if ( confirm("Delete Feature " + dojo.attr(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Feature are you sure?"))
				{
					dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._DeleteCallBack,
							url:'/advance/research_delete',
							content: this.form.get("value")
						}));
				}
			}
		},
		_DeleteCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Feature_Deleted,[response.data]);
				alert("Feature  Deleted");
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["feature_del"]);
				this.Clear();
			}
			else
			{
				alert ( "Problem Deleteing Feature" ) ;
			}
		},
		// styandard clear function
		Clear:function()
		{
			this.advancefeatureid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			dojo.attr(this.heading,"innerHTML" , "" ) ;
		},
		Load:function( advancefeatureid, feature )
		{
			this.advancefeatureid.set("value", advancefeatureid );
			dojo.attr(this.heading,"innerHTML" , feature ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
	}
);





