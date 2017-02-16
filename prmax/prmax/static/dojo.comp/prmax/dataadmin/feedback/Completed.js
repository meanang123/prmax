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
dojo.provide("prmax.dataadmin.feedback.Completed");

dojo.declare("prmax.dataadmin.feedback.Completed",
	[ ttl.BaseWidget ],
	{
	templatePath: dojo.moduleUrl( "prmax.dataadmin.feedback","templates/Completed.html"),
	constructor: function()
	{
		this._CompletedCallBack = dojo.hitch(this, this._CompletedCall );
	},
	postCreate:function()
	{
		this.reasoncodes.store = PRCOMMON.utils.stores.Research_Reason_Add_Email();

		this.inherited(arguments);
	},
	_CompleteSubmit:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required fields filled in");
			return;
		}

		if ( confirm("Complete Email?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._CompletedCallBack,
					url:'/dataadmin/bemails/completed',
					content: this.form.get("value")
				}));
		}
	},
	_CompletedCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Completed");
			this.Clear();
			dojo.publish(PRCOMMON.Events.BouncedEmail_Completed, [this.bounceddistributionid.get("value")]);
		}
		else
		{
			alert ( "Problem Completing Bounnced Email" ) ;
		}
	},
	// styandard clear function
	Clear:function()
	{
		this.bounceddistributionid.set("value", -1 ) ;
		this.reasoncodes.set("value",null);
		this.reason.set("value","");
		this.has_been_research.set("value", false);
	},
	Load:function( bounceddistributionid )
	{
		this.bounceddistributionid.set("value", bounceddistributionid );
		this.reasoncodes.set("value", null);
		this.has_been_research.set("value", false);
		this.reason.focus();
	},
	focus:function()
	{
		this.reason.focus();
	}
});





