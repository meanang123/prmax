//-----------------------------------------------------------------------------
// Name:    prmax.searchgrid.Deduplicate
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.searchgrid.Deduplicate");

dojo.declare("prmax.searchgrid.Deduplicate",
	[ ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.searchgrid","templates/Deduplicate.html"),

	constructor: function()
	{
		this._DeDuplicateCompleteCallBack = dojo.hitch(this,this._DeDuplicateCompleteCall);
	},
	startup:function()
	{
		this.saveNode.cancel();
		this.inherited(arguments)
	},
	_DeDuplicateCompleteCall:function( response)
	{
		if (response.success=="OK")
		{
			alert("Deduplicate Completed");
			dojo.publish(PRCOMMON.Events.SearchSession_Changed, [ response.data] );
			dojo.publish(PRCOMMON.Events.Dialog_Close, ["deduplocate"]);
		}
		else
		{
			alert("Problem");
			this.saveNode.cancel();
		}
	},
	_Deduplidate:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._DeDuplicateCompleteCallBack,
				url:'/search/deduplicate_session',
				content:this.form.getValues()
		}));
	}
});