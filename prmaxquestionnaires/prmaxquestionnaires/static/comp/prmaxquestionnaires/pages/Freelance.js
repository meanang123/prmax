//-----------------------------------------------------------------------------
// Name:    MainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/11/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/Freelance.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dijit/registry",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dojox/validate"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, domattr, registry ){
 return declare("prmaxquestionnaires.pages.Freelance",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{

		this._updated_call_back = lang.hitch ( this , this._updated_call );
		this._error_handler_call_back = lang.hitch(this,this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;
	},
	postCreate:function()
	{
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.load(PRMAX.questionnaire);

		if ( PRMAX.questionnaire.outlet.outlet.countryid == 119)
		{
			domattr.set(this.support_email_address,"href","mailto:researchgroup@prmax.co.uk");
			domattr.set(this.support_email_address,"innerHTML","researchgroup@prmax.co.uk");
		}

		this.inherited(arguments)
	},
	_updated_call: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Failed to updated");
		}

		registry.byId("mainframe").savebtn.cancel();

	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			this.countryid.set("value",outlet.outlet.countryid);
			this.address1.set("value",outlet.address.address1);
			this.address2.set("value",outlet.address.address2);
			this.townname.set("value",outlet.address.townname);
			this.county.set("value",outlet.address.county);
			this.postcode.set("value",outlet.address.postcode);
			this.www.set("value",outlet.outlet.www);
			this.email.set("value",outlet.communications.email);
			this.tel.set("value",outlet.communications.tel);
			this.mobile.set("value",outlet.communications.mobile);
			this.fax.set("value",outlet.communications.fax);
			this.linkedin.set("value",outlet.communications.linkedin);
			this.twitter.set("value",outlet.communications.twitter);
			this.facebook.set("value",outlet.communications.facebook);
			this.blog.set("value",outlet.communications.blog);
			this.prefix.set("value",contact.prefix);
			this.firstname.set("value",contact.firstname);
			this.familyname.set("value",contact.familyname);
			this.interests.set("value",contact.interests);

			domattr.set(this.interests_org,"innerHTML",contact.interests_org);
			if (outlet.outletprofile.profile)
			{
				if (outlet.outletprofile.profile.editorialprofile != null)
					this.editorialprofile.set("value", outlet.outletprofile.profile.editorialprofile.replace(/<br\/>/gi, "\n"));
				}
			else
			{
				this.editorialprofile.set("value", "");
			}
		}
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "n";
		}

		var content=this.form.get("value");

		content["editorialprofile"] = this.editorialprofile.get("value");

		request.post('/questionnaire/update_freelance',
			utilities2.make_params({ data : content})).
			then (this._updated_call_back,this._error_handler_call_back);
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		registry.byId("mainframe").savebtn.cancel();
	}
});
});





