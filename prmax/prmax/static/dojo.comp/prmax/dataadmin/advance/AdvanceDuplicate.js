//-----------------------------------------------------------------------------
// Name:    AdvanceDuplicate.js
// Author:  Chris Hoy
// Purpose:
// Created: 11/11/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.advance.AdvanceDuplicate");

dojo.declare("prmax.dataadmin.advance.AdvanceDuplicate",
	[ ttl.BaseWidget],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.advance","templates/AdvanceDuplicate.html"),
		constructor: function()
		{
			this._DuplicateCallBack = dojo.hitch(this, this._DuplicateCall );
		},
		postCreate:function()
		{
			this.reasoncodes.store = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			this.inherited(arguments);
		},
		_DuplicateButton:function()
		{
			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required fields filled in");
				return;
			}

			if ( confirm("Duplicate Feature " + dojo.attr(this.heading,"innerHTML" ) + "?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DuplicateCallBack,
						url:'/advance/research_duplicate',
						content: this.form.get("value")
					}));
			}
		},
		_DuplicateCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Feature_Added,[response.data]);
				alert("Feature Duplicate");
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["feature_dup"]);
				this.Clear();
			}
			else
			{
				alert ( "Problem Duplicating Feature" ) ;
			}
		},
		// styandard clear function
		Clear:function()
		{
			this.advancefeatureid.set("value", -1 ) ;
			this.feature.set("value","");
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			this.reason.set("value","");
			dojo.attr(this.heading,"innerHTML" , "" ) ;
		},
		Load:function( advancefeatureid, feature )
		{
			this.advancefeatureid.set("value", advancefeatureid );
			dojo.attr(this.heading,"innerHTML" , feature ) ;
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
	}
);





