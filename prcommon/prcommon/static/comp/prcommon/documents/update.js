//-----------------------------------------------------------------------------
// Name:    prcommon.documents.update
// Author:  Chris Hoy
// Purpose:
// Created: 18/09/2014
//
// To do:
//
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.documents.update");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.documents.update",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.documents","templates/update.html"),
	constructor: function()
	{
		this._load_call_back = dojo.hitch(this,this._load_call);
		this._save_call_back = dojo.hitch(this,this._save_call);
		this._delete_call_back = dojo.hitch(this,this._delete_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_clear:function()
	{
		this.update_form_btn.set("disabled",false);
	},
	clear:function()
	{
		this._clear();
	},
	load:function(documentid, show_func)
	{
		this._show_func = show_func;
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._load_call_back,
				url:"/crm/documents/get" ,
				content: {documentid:documentid}
		}));
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			with (response)
			{
				this.documentid.set("value", data.documentid);
				this.description.set("value",data.description);
				this._data = data;
			}
			this._show_func(1);
		}
		else
		{
			alert("Problem Loading Record");
		}
	},
	_update:function()
	{
		if ( ttl.utilities.formValidator(this.update_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._save_call_back,
					url:'/crm/documents/update',
					content: this.update_form.get("value")}));
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
			dojo.publish(PRCOMMON.Events.Document_Updated, [ response.data ] );
		}
		else
		{
			alert("Problem Updating");
		}
		this.update_form_btn.cancel();
	},
	_delete:function()
	{
		if ( confirm ("Delete Document?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._delete_call_back,
						url:'/crm/documents/delete',
						content: this.update_form.get("value")}));
		}
	},
	_delete_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.Document_Deleted, [ {documentid:this.documentid.get("value")} ] );
		}
		else
		{
			alert("Problem Deleting");
		}
	},
	_download:function()
	{
		ttl.utilities.gotoDialogPageStatic("/crm/documents/download/"+ this._data.documentid+this._data.ext);

	}
});
