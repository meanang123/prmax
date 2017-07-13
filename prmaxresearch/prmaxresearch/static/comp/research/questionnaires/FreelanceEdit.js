//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/FreelanceEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"research/employees/EmployeeSelect",
	"dojox/validate",
	"prcommon2/interests/Interests",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox",
	"research/audit/AuditViewer",
	"research/ResearchDetails",
	"research/freelance/FreelanceDelete",
	"research/questionnaires/UserModified",
	"prcommon2/web/WebButton"	
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, domattr, ItemFileReadStore, lang, topic){
 return declare("research.questionnaires.FreelanceEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._saved_call_back = lang.hitch(this,this._saved);
		this._load_call_back= lang.hitch(this,this._loaded);
	},
	postCreate:function()
	{
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		this.delete_ctrl.set("dialog", this.delete_dlg);

		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);
		this.inherited(arguments);
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Updated");
		}
		else
		{
			alert("Failed to update ");
		}
		this.savenode.cancel();
	},
	_reset_fields:function()
	{
		this.address1_modified.clear();
		this.address2_modified.clear();
		this.townname_modified.clear();
		this.county_modified.clear();
		this.postcode_modified.clear();
		this.blog_modified.clear();
		this.www_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.mobile_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
		this.editorialprofile_modified.clear();
		this.prefix_modified.clear();
		this.firstname_modified.clear();
		this.familyname_modified.clear();
		this.blog_modified.clear();
		this.countryid_modified.clear();

	},
	_save:function()
	{
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/projects/user_feed_accept_freelance' ,
					utilities2.make_params({ data: this.requirednode.get("value") })).then
					(this._saved_call_back);
	},
	new_freelance:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.researchprojectitemid.set("value",-1);
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.countryid.set("value",1);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.blog.set("value","");
		this.sortname.set("value","");
		domattr.set(this.interests_user,"innerHTML", "");
		this.familyname.set("value","");
		this.firstname.set("value","");
		this.prefix.set("value","");

	},
	load:function( researchprojectitemid )
	{
		this.researchprojectitemid.set("value", researchprojectitemid);

		request.post ('/research/admin/projects/load_user_feedback',
			utilities2.make_params({ data : {researchprojectitemid: researchprojectitemid} })).then
			(this._load_call_back);
	},
	_loaded:function( response )
	{
		this.savenode.cancel();

		if  ( response.success == "OK" )
		{
			var data = response.data;

			this._reset_fields();

			this._name = data.primary.contact.familyname;

			this.familyname.set("value",data.primary.contact.familyname);
			this.firstname.set("value",data.primary.contact.firstname);
			this.prefix.set("value",data.primary.contact.prefix);

			this.job_title.set("value",data.primary.employee.job_title);
			this.sortname.set("value",data.outlet.outlet.sortname);
			this.address1.set("value",data.outlet.address.address1);
			this.address2.set("value",data.outlet.address.address2);
			this.townname.set("value",data.outlet.address.townname);
			this.county.set("value",data.outlet.address.county);
			this.postcode.set("value",data.outlet.address.postcode);
			this.www.set("value", data.outlet.outlet.www);
			this.email.set("value",data.outlet.communications.email);
			this.tel.set("value",data.outlet.communications.tel);
			this.fax.set("value",data.outlet.communications.fax);
			this.mobile.set("value",data.outlet.communications.mobile);
			this.interests.set("value",data.primary.interests);
			if (data.outlet.profile.profile)
				this.editorialprofile.set("value",data.outlet.profile.profile.editorialprofile);
			else
				this.editorialprofile.set("value", data.outlet.outlet.profile);

			this.countryid.set("value",data.outlet.outlet.countryid);
			this.twitter.set("value",data.outlet.communications.twitter);
			this.facebook.set("value",data.outlet.communications.facebook);
			this.linkedin.set("value",data.outlet.communications.linkedin);
			this.blog.set("value",data.outlet.communications.blog);

			this.outlet_research_ctrl.load( data.outlet.outlet.outletid,19 );
			this.outlet_audit_ctrl.load ( data.outlet.outlet.outletid ) ;

			domattr.set(this.interests_user,"innerHTML", "");

			for (var key in data.user_changes)
			{
				var  change_record = data.user_changes[key]

				switch (change_record.fieldid)
				{
					case 3 : // profile
						var editorialprofile  = "";

						if (data.outlet.profile.profile)
							editorialprofile = data.outlet.profile.profile.editorialprofile;

						this.editorialprofile_modified.load(change_record.value, editorialprofile, this.editorialprofile);
						break;
					case 4 : // email
						this.email_modified.load(change_record.value, data.outlet.communications.email, this.email);
						break;
					case 5: // tel
						this.tel_modified.load(change_record.value, data.outlet.communications.tel, this.tel);
						break;
					case 6: //fax
						this.fax_modified.load(change_record.value, data.outlet.communications.fax, this.fax);
						break;
					case 7: //mobile
						this.mobile_modified.load(change_record.value, data.outlet.communications.mobile, this.mobile);
						break;
					case 8: // interests
						domattr.set(this.interests_user,"innerHTML",change_record.value);
						break;
					case 12: // address 1
						this.address1_modified.load(change_record.value, data.outlet.address.address1, this.address1);
						break;
					case 13: // address 2
						this.address2_modified.load(change_record.value, data.outlet.address.address2, this.address2);
						break;
					case 14: // townname
						this.townname_modified.load(change_record.value, data.outlet.address.townname, this.townname);
						break;
					case 15: // county
						this.county_modified.load(change_record.value, data.outlet.address.county, this.county);
						break;
					case 16: // post code
						this.postcode_modified.load(change_record.value, data.outlet.address.postcode, this.postcode);
						break;
					case 17: // www
						this.www_modified.load(change_record.value, data.outlet.outlet.www, this.www);
						break;
					case 50: // blog
						this.blog_modified.load(change_record.value, data.outlet.communications.blog, this.blog);
						break;
					case 25: // twitter
						this.twitter_modified.load(change_record.value, data.outlet.communications.twitter, this.twitter);
						break;
					case 26: // facebook
						this.facebook_modified.load(change_record.value, data.outlet.communications.facebook, this.facebook);
						break;
					case 27: // Country Id
						this.countryid_modified.load(change_record.value, data.outlet.outlet.countryid, this.countryid);
						break;
					case 28: // linkedin
						this.linkedin_modified.load(change_record.value, data.outlet.communications.linkedin, this.linkedin);
						break;
					case 21: //prefix
						this.prefix_modified.load(change_record.value, data.primary.contact.prefix, this.prefix);
						break;
					case 22: //firstname
						this.firstname_modified.load(change_record.value, data.primary.contact.firstname, this.firstname);
						break;
					case 23: //fmailyname
						this.familyname_modified.load(change_record.value, data.primary.contact.familyname, this.familyname);
						break;
				}
			}
		}
		else
		{
			alert("Problem Loading freelancer");
		}
	},
	_delete:function()
	{
		this.delete_ctrl.load ( this._outletid ,this._name);
		this.delete_dlg.show();
	}
});
});
