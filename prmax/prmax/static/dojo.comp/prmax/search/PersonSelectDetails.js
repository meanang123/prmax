//-----------------------------------------------------------------------------
// Name:    PersonSelectDetails.js
// Author:
// Purpose:
// Created: Jan 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.search.PersonSelectDetails");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("ttl.Form");
dojo.require("prmax.search.standard");
dojo.require("prcommon.web.WebButton");
dojo.require("prcommon.crm.add");

dojo.declare("prmax.search.PersonSelectDetails",
	[ ttl.BaseWidget],
	{
	templatePath: dojo.moduleUrl( "prmax.search","templates/PersonSelectDetails.html"),
	constructor: function()
	{
		this._dialog = null;
		this._employeeid = '';

		this._load_call_back = dojo.hitch(this,this._load_call);
		this._clear_call_back = dojo.hitch(this,this._clear_call);

	},

	postCreate:function()
	{
		this.www_show.set("source",this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.instagram_show.set("source",this.instagram);
		this.linkedin_show.set("source",this.linkedin);

		this.inherited(arguments);
	},
	_setDialogAttr:function (dialog)
	{
		this._dialog = dialog;
	},
	load:function(dialog, employeeid)
	{
		this._dialog = dialog;

		var content = {};
		content['employeeid'] = employeeid;
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._load_call_back,
				url:'/employees/get_for_display',
				content:content}));
	},
	_load_call:function(response)
	{
		this._dialog.show();

		if (response.success == 'OK')
		{
			this.contactname.set("value", response.data[0]);
			this.www.set("value", response.data[7]);
			this.tel.set("value", response.data[8]);
			this.mobile.set("value", response.data[9]);
			this.fax.set("value", response.data[10]);
			this.email.set("value", response.data[11]);
			this.twitter.set("value", response.data[12]);
			this.facebook.set("value", response.data[13]);
			this.linkedin.set("value", response.data[14]);
			this.instagram.set("value", response.data[15]);
			if (response.data[7] != '')
			{
				dojo.removeClass(this.www_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.www_show.domNode, "prmaxhidden");
			}
			if (response.data[13] != '')
			{
				dojo.removeClass(this.facebook_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.facebook_show.domNode, "prmaxhidden");
			}
			if (response.data[12] != '')
			{
				dojo.removeClass(this.twitter_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.twitter_show.domNode, "prmaxhidden");
			}
			if (response.data[15] != '')
			{
				dojo.removeClass(this.instagram_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.instagram_show.domNode, "prmaxhidden");
			}
			if (response.data[14] != '')
			{
				dojo.removeClass(this.linkedin_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.linkedin_show.domNode, "prmaxhidden");
			}
		}
	},
	_close:function()
	{

		if ( this._dialog)
			this._dialog.hide();
		this._clear();
	},
	_clear:function()
	{
		this.contactname.set("value", "");
		this.www.set("value", "");
		this.tel.set("value", "");
		this.mobile.set("value", "");
		this.fax.set("value", "");
		this.email.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.instagram.set("value", "");
		this.linkedin.set("value", "");
	}
});
