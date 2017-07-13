//-----------------------------------------------------------------------------
// Name:    DeskDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 21/01/2015
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/DeskDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dojox/validate/regexp",
	"dijit/form/Button",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dojox/validate",
	"research/questionnaires/UserModified",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, JsonRestStore, ItemFileReadStore ){
 return declare("research.questionnaires.DeskDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._updated_call_back = lang.hitch ( this , this._updated_call );
	},
	postCreate:function()
	{
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);	
		this.linkedin_show.set("source",this.linkedin);

		this.inherited(arguments);
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
		this.updatebtn.cancel();
	},
	clear:function()
	{
		this.updatebtn.cancel();
		this._reset_fields();
	},
	_reset_fields:function()
	{
		this.deskname_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.address1_modified.clear();
		this.address2_modified.clear();
		this.townname_modified.clear();
		this.county_modified.clear();
		this.postcode_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
	},
	load:function( projectitem, outlet, user_changes)
	{
		this._reset_fields();

		this.deskname.set("value", outlet.desk.desk.deskname ) ;

		var address1="";
		var address2="";
		var townname="";
		var county="";
		var postcode="";


		if (outlet.desk.address)
		{
			address1 = outlet.desk.address.address1;
			address2 = outlet.desk.address.address2;
			townname = outlet.desk.address.townname;
			county = outlet.desk.address.county;
			postcode = outlet.desk.address.postcode;
		}

		this.address1.set("value", address1);
		this.address2.set("value", address2);
		this.townname.set("value", townname);
		this.county.set("value", county);
		this.postcode.set("value", postcode);

		this.email.set("value",outlet.desk.comms.email);
		this.tel.set("value",outlet.desk.comms.tel);
		this.fax.set("value",outlet.desk.comms.fax);
		this.linkedin.set("value",outlet.desk.comms.linkedin);
		this.twitter.set("value",outlet.desk.comms.twitter);
		this.facebook.set("value",outlet.desk.comms.facebook);
		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);


		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 66: // deskname
					this.deskname_modified.load(change_record.value, outlet.desk.desk.deskname, this.deskname);
					break;
				case 4 : // email
					this.email_modified.load(change_record.value, outlet.desk.comms.email, this.email);
					break;
				case 5: // tel
					this.tel_modified.load(change_record.value, outlet.desk.comms.tel, this.tel);
					break;
				case 6: //fax
					this.fax_modified.load(change_record.value, outlet.desk.comms.fax, this.fax);
					break;
				case 12: // address 1
					this.address1_modified.load(change_record.value, address1, this.address1);
					break;
				case 13: // address 2
					this.address2_modified.load(change_record.value, address2, this.address2);
					break;
				case 14: // townname
					this.townname_modified.load(change_record.value, townname, this.townname);
					break;
				case 15: // county
					this.county_modified.load(change_record.value, county, this.county);
					break;
				case 16: // post code
					this.postcode_modified.load(change_record.value, postcode, this.postcode);
					break;
				case 25: // twitter
					this.twitter_modified.load(change_record.value, outlet.desk.comms.twitter, this.twitter);
					break;
				case 26: // facebook
					this.facebook_modified.load(change_record.value, outlet.desk.comms.facebook, this.facebook);
					break;
				case 28: // linkedin
					this.linkedin_modified.load(change_record.value, outlet.desk.comms.linkedin, this.linkedin);
					break;
				case 66: // deskname
					this.deskname_modified.load(change_record.value, outlet.desk.desk.deskname, this.deskname);
					break;
			}
		}
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/projects/user_feed_accept_desk',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._updated_call_back);
	}
});
});





