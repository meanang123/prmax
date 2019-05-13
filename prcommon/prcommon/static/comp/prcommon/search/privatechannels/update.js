//-----------------------------------------------------------------------------
// Name:    prcommon.search.privatechannels.update.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: May 2019
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.privatechannels.update");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.declare("prcommon.search.privatechannels.update",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.search.privatechannels","templates/update.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch(this,this._Added);
		this._LoadCallback = dojo.hitch(this,this._LoadCall);
		this._UpdatePrivateChannelCallBack = dojo.hitch(this,this._UpdatePrivateChannelCall);

		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;

		this.inherited(arguments);
	},
	Load:function(dialog, prmax_outlettypeid)
	{
		this._dialog = dialog;
		this._prmax_outlettypeid = prmax_outlettypeid;
		this.prmax_outlettypeid.set("value", prmax_outlettypeid);

		var content = {};
		content['prmax_outlettypeid'] = prmax_outlettypeid;
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCallback,
			url:"/prmax_outlettypes/get",
			content:content}));	
	},
	_LoadCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.prmax_outlettypeid.set("value", response.data.prmax_outlettypeid);
			this.prmax_outlettypename.set("value", response.data.prmax_outlettypename);
		}
		else
		{
			alert("Problem Loading Private Media Channel");
		}
	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.update_privatechannel_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}
		if (confirm ("Update?"))
		{
			var content = this.update_privatechannel_form.get("value");
			content['customerid'] = this.icustomerid;
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._UpdatePrivateChannelCallBack),
					url:'/prmax_outlettypes/update',
					content: content
				})
			);
		}
	},
	_UpdatePrivateChannelCall:function ( response )
	{
		if (response.success=="OK")
		{
			alert("Private Media Channel Updated");
			this.update_form_btn.cancel();
		}
		else if ( response.success == "DU")
		{
			alert("Private Media Channel Already Exists");
			this.update_form_btn.cancel();
		}
		else
		{
			alert("Problem updating Private Media Channel");
			this.update_form_btn.cancel();
		}
	},
	_Close:function ( )
	{
		this._dialog.hide();
	},	
});
