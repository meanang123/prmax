//-----------------------------------------------------------------------------
// Name:    prcommon.advance.renamelist
// Author:  Chris Hoy
// Purpose: Rename a list
// Created: 16/12/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.renamelist");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.advance.renamelist",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/renamelist.html"),
	constructor: function()
	{
		this._SaveCallBack = dojo.hitch ( this , this._SaveCall ) ;
	},
	focus:function()
	{
		this.listname.focus();
	},
	Load:function(advancefeatureslistid)
	{
		this.advancefeatureslistid.set("value",advancefeatureslistid);
	},
	_Cancel:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["rename_save_del"]);
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
			this.saveNode.cancel();
			dojo.publish( PRCOMMON.Events.Feature_List_Update, [ response.data.advance ]);
			dojo.publish( PRCOMMON.Events.Dialog_Close, ["rename_save_del"]);
		}
		else if ( response.success == "DU")
		{
			alert("List Already Exists");
			this.saveNode.cancel();
			this.listname.focus();
		}
		else
		{
			alert("Problem Renaming List");
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
				url:'/advance/renamelist',
				content: this.form.get("value")
			}));
	}
});

