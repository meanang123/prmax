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
				url:'/employees/research_get_edit',
				content:content}));
	},
	_load_call:function(response)
	{
		this._dialog.show();

		if (response.success == 'OK')
		{
			this.contactname.set("value", response.data.contactname);
			this.www.set("value", response.data.outlet.www);
			this.tel.set("value", response.data.comm.tel);
			this.mobile.set("value", response.data.comm.mobile);
			this.fax.set("value", response.data.comm.fax);
			this.email.set("value", response.data.comm.email);
			this.twitter.set("value", response.data.comm.twitter);
			this.facebook.set("value", response.data.comm.facebook);
			this.instagram.set("value", response.data.comm.instagram);
			this.linkedin.set("value", response.data.comm.linkedin);
			if (this.www.value != '')
			{
				dojo.removeClass(this.www_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.www_show.domNode, "prmaxhidden");
			}
			if (this.facebook.value != '')
			{
				dojo.removeClass(this.facebook_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.facebook_show.domNode, "prmaxhidden");
			}
			if (this.twitter.value != '')
			{
				dojo.removeClass(this.twitter_show.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.twitter_show.domNode, "prmaxhidden");
			}
			if (this.instagram.value != '')
			{
				dojo.removeClass(this.instagram_show.domNode, "prmaxhidden");
			}			
			else
			{
				dojo.addClass(this.instagram_show.domNode, "prmaxhidden");
			}
			if (this.linkedin.value != '')
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
