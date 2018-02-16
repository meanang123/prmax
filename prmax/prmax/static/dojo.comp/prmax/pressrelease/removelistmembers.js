//-----------------------------------------------------------------------------
// Name:    removelistmembers.js
// Author:  
// Purpose:
// Created: Feb 2018
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.removelistmembers");

dojo.declare("prmax.pressrelease.removelistmembers",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/removelistmembers.html"),
	constructor: function()
	{
		this._RemoveSelectedListMembersCallBack = dojo.hitch(this, this._RemoveSelectedListMembersCall);
		this.option = 0;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function(dialog, selected_listmembers, listid)
	{
		this._dialog = dialog;	
		this._selected_listmemberids = [];
		for (var x = 0; x < selected_listmembers.length; x++)
		{
			this._selected_listmemberids.push(selected_listmembers[x].i.listmemberid);
		}
		this._selected_listmemberids = JSON.stringify(this._selected_listmemberids);
		this._listid = listid;
	},
	clear:function()
	{
		this.option0.set("checked", true);

	},
	_close:function()
	{
		if ( this._dialog)
		{
			this._dialog.hide();
			this.clear();
		}	
	},
	_remove:function()
	{
		if ( confirm ("Remove members from Distribution?"))
		{
			var content = {};
			if (this.option0.get("checked"))
			{
				content["option"] = 0; //remove selected
			}
			else if (this.option1.get("checked"))
			{
				content["option"] = 1; //remove non selected
				this.option = 1;
			}
			content['selected_listmemberids'] = this._selected_listmemberids;
			content['listid'] = this._listid;
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._RemoveSelectedListMembersCallBack,
					url:'/lists/list_member_delete_selected',
					content: content
				}));
		}	
	},
	_RemoveSelectedListMembersCall:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish("/distribution/listmembers_remove", [this.option]);
			this._dialog.hide();
		}
		else
		{
			alert("Problem deleting selected members");
		}
	},	
	
	
});
