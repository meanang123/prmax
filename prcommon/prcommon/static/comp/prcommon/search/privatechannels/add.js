//-----------------------------------------------------------------------------
// Name:    prcommon.search.privatechannels.add.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: May 2019
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.privatechannels.add");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.declare("prcommon.search.privatechannels.add",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.search.privatechannels","templates/add.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch(this,this._Added);
		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;
		this.inherited(arguments);
	},
	Load:function(dialog)
	{
		this._dialog = dialog;
		this._Clear();
	},
	_Clear:function()
	{
		this.prmax_outlettypename.set("value","");
		this.saveNode.set("disabled",false);
	},
	_Added:function( response )
	{
		if (response.success=="DU")
		{
			alert("Private Media Channel Already Exists");
		}
		else if (response.success=="OK")
		{
			dojo.publish('/prmax_outlettypes/add', [ response.data ] );
			alert("Private Media Channel Added");
			this._dialog.hide();
		}
		else if (response.success=="FA")
		{
			alert(response.message);
		}
		else
		{
			alert("Problem Adding Private Media Channel");
		}
	},
	_Add:function()
	{
		if (ttl.utilities.formValidator(this.privatechannels_form) == false)
		{
			alert("Please Enter Details");
			return false;
		}
		var content = this.privatechannels_form.get("value") ;
		content['outletsearchtypeid'] = 13; //private media channels
		content['prmax_outletgroupid'] = 'privatechannels';
		content['customerid'] = this.icustomerid;


		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._AddedCallback,
			url:"/prmax_outlettypes/add",
			content:content}));
	},
	Clear:function()
	{
		this._Clear();
	},
	_Close:function()
	{
		this.dialog.hide();	
	}

});
