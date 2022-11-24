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
	"dojo/text!../pages/templates/DeskDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dojox/validate"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, domattr ){
 return declare("prmaxquestionnaires.pages.DeskDetails",
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
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Updated");
		}
		else
		{
			alert("Failed to updated");
			if ( this._page_error)
				this._page_error();
		}
	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			this.deskname.set("value",outlet.desk.deskname);
			this.countryid.set("value",outlet.outlet.countryid);
			this.address1.set("value",outlet.address.address1);
			this.address2.set("value",outlet.address.address2);
			this.townname.set("value",outlet.address.townname);
			this.county.set("value",outlet.address.county);
			this.postcode.set("value",outlet.address.postcode);

			this.email.set("value",outlet.communications.email);
			this.tel.set("value",outlet.communications.tel);
			this.fax.set("value",outlet.communications.fax);
			this.linkedin.set("value",outlet.communications.linkedin);
			this.twitter.set("value",outlet.communications.twitter);
			this.facebook.set("value",outlet.communications.facebook);
			this.instagram.set("value",outlet.communications.instagram);
		}

		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			if (this._page_error)
				this._page_error();
			throw "n";
		}
		 request.post('/questionnaire/update_desk_details',
			utilities2.make_params({ data : this.form.get("value")})).
			then (this._updated_call_back,this._error_handler_call_back);
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		if (this._page_error)
			this._page_error();
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		this._page_ctrl = page_ctrl;
		this._page_error = error_ctrl;
		this._update();
	}
});
});





