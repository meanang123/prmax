//-----------------------------------------------------------------------------
// Name:    prcommon.crm.responses.add.js
// Author:
// Purpose:
// Created: Sept 2017
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.newsrooms.add");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.layout.ContentPane");

dojo.declare("prcommon.newsrooms.add",
[ ttl.BaseWidget,dijit.layout.ContentPane ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.newsrooms","templates/add.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch(this,this._Added);

//		this._client_data = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});

		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;
//		this.clientid.store = this._client_data;
//		this.clientid.set("value",-1);

		this.inherited(arguments);
	},
	Load:function(dialog)
	{
		this._dialog = dialog;
	},
	_Clear:function()
	{
		this.description.set("value","");
		this.news_room_root.set("value", "" );
		this.saveNode.set("disabled",false);
	},
	_Added:function( response )
	{
		if (response.success=="DU")
		{
			alert("Newsroom Already Exists");
		}
		else if (response.success=="OK")
		{
			dojo.publish('/newsroom/add', [ response.data.newsroom ] );
			alert("Newsroom Added");
			this.saveNode.cancel();
//			this._dialog.hide();
		}
		else if (response.success=="FA")
		{
			alert(response.message);
		}
		else
		{
			alert("Problem Adding Newsroom");
		}
	},
	_Add:function()
	{
		if (ttl.utilities.formValidator(this.newsroom_form) == false || ttl.utilities.formValidator(this.contact_form) == false)
		{
			alert("Please Enter Details");
			return false;
		}
		var content = dojo.mixin(this.newsroom_form.get("value"), this.contact_form.get("value"));
		content['customerid'] = this.icustomerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._AddedCallback,
			url:"/newsroom/newsroom_add",
			content:content}));
	},
	Clear:function()
	{
		this._Clear();
	},
	showClose:function ( dlg )
	{
		this.dlg = dlg;
		dojo.removeClass( this.clearNode, "prmaxhidden");
	},
	_Close:function()
	{
		this._dialog.hide();
	},
	_use_default_color:function()
	{
		if (this.default_header_colour.checked)
		{
			this.header_colour.set("value", "#2e74b5")
		}
	},
	_ColourUpdate:function()
	{
		this.default_header_colour.set("checked", false);
	},
	resize:function()
	{
		this.tabcont.resize({w:700, h:700});
	},

});
