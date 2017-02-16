//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.edit_private
// Author:  Chris Hoy
// Purpose:
// Created: 7/06/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.edit_private");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.Textarea");

dojo.declare("prcommon.clippings.edit_private",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings","templates/edit_private.html"),
	mode:"add",
	constructor: function()
	{
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._outlets = new dojox.data.JsonRestStore({target:'/outlets/list_outlets', idAttribute:"outletid"});

		this._save_call_back = dojo.hitch(this, this._save_call);
		this._load_call_back = dojo.hitch(this, this._load_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.clientid.set("store",this._clients);
		this.clientid.set("value", "-1" );
		this.issueid.set("store", this._issues);
		this.issueid.set("value", "-1" );
		this.outletid.set("store",this._outlets);

		dojo.attr(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);

	},
	clear:function()
	{
		this.clippingid.set("value",-1);
		this.clientid.set("value", "-1" );
		this.issueid.set("value", "-1" );
		this.outletid.set("value", -1);
		this.clip_source_date.set("value", new Date());
		this.clip_title.set("value", "");
		this.clip_abstract.set("value", "");
		this.clip_source_page.set("value", "");
		this.clip_article_size.set("value", 0);
		this.clip_words.set("value", 0);
		this.clip_circulation.set("value", 0);
		this.clip_readership.set("value", 0);
		this.clip_disrate.set("value", 0.00);
		this.clip_text.set("value", "");
		this.savebtn.cancel();
	},
	_save:function()
	{
		if (ttl.utilities.formValidator( this.formnode ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		var content = this.formnode.get("value") ;
		var command = (this.mode == "add") ? '/clippings/private_clipping_add' : '/clippings/private_clipping_update';

		content["clip_source_date"] = ttl.utilities.toJsonDate ( this.clip_source_date.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:command,
			content:content}));
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			if (this.mode == "edit")
				dojo.publish("/clipping/update", [response.data]);
			else
				dojo.publish("/clipping/private_add", [response.data]);
		}
		else
		{
			alert("Problem");
		}
		this.savebtn.cancel();
	},
	load:function(clipping, dialog)
	{
		this._dialog = dialog;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._load_call_back,
			url:'/clippings/private_clipping_get_for_edit',
			content: {clippingid:clipping.clippingid}}));
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			with ( response)
			{
				this.clippingid.set("value",data.clippingid);
				this.clientid.set("value", data.clientid);
				this.issueid.set("value", data.issueid);
				this.outletid.set("value", data.outletid);
				this.clip_source_date.set("value", ttl.utilities.fromObjectDate(data.clip_source_date));
				this.clip_title.set("value", data.clip_title);
				this.clip_abstract.set("value", data.clip_abstract);
				this.clip_source_page.set("value", data.clip_source_page);
				this.clip_article_size.set("value", data.clip_article_size);
				this.clip_words.set("value", data.clip_words);
				this.clip_circulation.set("value", data.clip_circulation);
				this.clip_readership.set("value", data.clip_readership);
				this.clip_disrate.set("value", data.clip_disrate);
				this.clip_text.set("value", data.clip_text);

			}
			this.savebtn.cancel();
			if (this._dialog)
				this._dialog.show();
		}
		else
		{
			alert("Problem");
		}

	}
});
