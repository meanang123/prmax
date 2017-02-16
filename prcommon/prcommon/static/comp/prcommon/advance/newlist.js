//-----------------------------------------------------------------------------
// Name:    prcommon.advance.newlist
// Author:  Chris Hoy
// Purpose: Create a new advance list
// Created: 21/11/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.newlist");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.advance.newlist",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/newlist.html"),
	constructor: function()
	{
		this._SaveCallBack = dojo.hitch ( this , this._SaveCall ) ;
		this._advancefeatureslistid = null;

	},
	focus:function()
	{
		this.listname.focus();
	},
	Load:function(advancefeatureslistid)
	{
		dojo.attr(this.advancefeatureslistid,"value",advancefeatureslistid);
		this._advancefeatureslistid = advancefeatureslistid
	},
	_Cancel:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["adv_save_del"]);
		this.saveNode.cancel();
	},
	show:function()
	{
		this.saveNode.cancel();
		this.listname.set("value",null);
		this.listname.focus();
	},
	_SaveCall:function ( response )
	{
		if ( response.success == "OK")
		{
			// result saved to a list show on main interface
			this.listname.set("value",null);
			this._Cancel();
			response.data.advance.selected = false;
			if ( this._advancefeatureslistid == null )
			{
				response.data.advance.qty = 0;
				dojo.publish ( PRCOMMON.Events.Feature_List_Add, [ response.data.advance ]);
			}
			else
			{
				response.data.advance.qty = response.data.qty;
				dojo.publish ( PRCOMMON.Events.Feature_List_Update, [ response.data.advance ]);
			}
		}
		else if ( response.success == "DU")
		{
			alert("List Already Exists");
			this.saveNode.cancel();
			this.listname.focus();
		}
		else
		{
			alert("Problem Creating List");
			this.saveNode.cancel();
		}
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required fields filled in");
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveCallBack,
				url:'/advance/createlist',
				content: this.form.get("value")
			}));
	}
});





