//-----------------------------------------------------------------------------
// Name:    OutletEditMainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/OutletEditMainDetails.html",
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
	"prcommon2/interests/Interests",
	"prcommon2/geographical/Geographical",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dojox/validate",
	"research/questionnaires/UserModified",
	"prcommon2/circulation/CirculationSourcesAdd",
	"prcommon2/circulation/CirculationDatesAdd",
	"prcommon2/web/WebButton"	
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, JsonRestStore, ItemFileReadStore ){
 return declare("research.questionnaires.OutletEditMainDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._circulationsources = new JsonRestStore( {target:'/research/admin/circulationsources/list', labelAttribute:"circulationsourcedescription", idProperty:"circulationsourceid"});
		this._circulationauditdates = new JsonRestStore( {target:'/research/admin/circulationdates/list', labelAttribute:"circulationauditdatedescription", idProperty:"circulationauditdateid"});
		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});

		this._updated_call_back = lang.hitch ( this , this._updated_call );
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.frequencyid.set("store",PRCOMMON.utils.stores.Frequency());
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.circulationsource_add_ctrl.set("dialog", this.circulationsource_add_dlg);
		this.circulationsourceid.set("store", this._circulationsources);
		this.circulationdates_add_ctrl.set("dialog", this.circulationdates_add_dlg);
		this.circulationauditdateid.set("store", this._circulationauditdates);

		this.outletpriceid.set("store", this._costs);

		this.www_show.set("source", this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);		
	},
	_updated_call: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
			topic.publish(PRCOMMON.Events.Outlet_Updated,response.data);
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
		this.outletname_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.address1_modified.clear();
		this.address2_modified.clear();
		this.townname_modified.clear();
		this.county_modified.clear();
		this.postcode_modified.clear();
		this.www_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
		this.subtitle_modified.clear();
		this.officialjournalof_modified.clear();
		this.incorporating_modified.clear();
		this.outletpriceid_modified.clear();
		this.countryid_modified.clear();
		this.frequencyid_modified.clear();
		this.circulationauditdateid_modified.clear();
		this.circulationsourceid_modified.clear();
		this.circulation_modified.clear();
		this.frequencynotes_modified.clear();

	},
	load:function( projectitem, outlet, user_changes)
	{
		this._reset_fields();

		this.outletname.set("value", outlet.outlet.outletname ) ;
		this.sortname.set("value", outlet.outlet.sortname );
		this.frequencyid.set("value", outlet.outlet.frequencyid ) ;
		this.address1.set("value",outlet.address.address1);
		this.address2.set("value",outlet.address.address2);
		this.townname.set("value",outlet.address.townname);
		this.county.set("value",outlet.address.county);
		this.postcode.set("value",outlet.address.postcode);
		this.countryid.set("value",outlet.outlet.countryid);
		this.circulation.set("value",outlet.outlet.circulation);

		this.www.set("value",outlet.outlet.www);
		this.email.set("value",outlet.communications.email);
		this.tel.set("value",outlet.communications.tel);
		this.fax.set("value",outlet.communications.fax);
		this.linkedin.set("value",outlet.communications.linkedin);
		this.twitter.set("value",outlet.communications.twitter);
		this.facebook.set("value",outlet.communications.facebook);

		if (outlet.profile.profile)
		{
			this.subtitle.set("value", outlet.profile.profile.subtitle);
			this.officialjournalof.set("value", outlet.profile.profile.officialjournalof);
			this.incorporating.set("value", outlet.profile.profile.incorporating);
			this.frequencynotes.set("value", outlet.profile.profile.frequencynotes);
		}
		else
		{
			this.subtitle.set("value", "");
			this.officialjournalof.set("value", "");
			this.incorporating.set("value", "");
			this.frequencynotes.set("value","");
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);

		var circulationauditdateid_set = false;
		var circulationsourceid_set = false;
		var outletpriceid_set = false;

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 9: // outletname
					this.outletname_modified.load(change_record.value, outlet.outlet.outletname, this.outletname);
					break;
				case 4 : // email
					this.email_modified.load(change_record.value, outlet.communications.email, this.email);
					break;
				case 5: // tel
					this.tel_modified.load(change_record.value, outlet.communications.tel, this.tel);
					break;
				case 6: //fax
					this.fax_modified.load(change_record.value, outlet.communications.fax, this.fax);
					break;
				case 12: // address 1
					this.address1_modified.load(change_record.value, outlet.address.address1, this.address1);
					break;
				case 13: // address 2
					this.address2_modified.load(change_record.value, outlet.address.address2, this.address2);
					break;
				case 14: // townname
					this.townname_modified.load(change_record.value, outlet.address.townname, this.townname);
					break;
				case 15: // county
					this.county_modified.load(change_record.value, outlet.address.county, this.county);
					break;
				case 16: // post code
					this.postcode_modified.load(change_record.value, outlet.address.postcode, this.postcode);
					break;
				case 17: // www
					this.www_modified.load(change_record.value, outlet.outlet.www, this.www);
					break;
				case 18: // circulation
					this.circulation_modified.load(change_record.value, outlet.outlet.circulation, this.circulation);
					break;
				case 19: // frequency
					this.frequencyid_modified.load(change_record.value, outlet.outlet.frequencyid, this.frequencyid);
					break;
				case 25: // twitter
					this.twitter_modified.load(change_record.value, outlet.communications.twitter, this.twitter);
					break;
				case 26: // facebook
					this.facebook_modified.load(change_record.value, outlet.communications.facebook, this.facebook);
					break;
				case 27: // Country Id
					this.countryid_modified.load(change_record.value, outlet.outlet.countryid, this.countryid);
					break;
				case 28: // linkedin
					this.linkedin_modified.load(change_record.value, outlet.communications.linkedin, this.linkedin);
					break;
				case 30: // Circulation_Source
					this.circulationsourceid_modified.load(change_record.value, outlet.outlet.circulationsourceid, this.circulationsourceid);
					circulationsourceid_set = true;
					break;
				case 31: // Circulation Date
					this.circulationauditdateid_modified.load(change_record.value, outlet.outlet.circulationauditdateid, this.circulationauditdateid);
					circulationauditdateid_set = true;
					break;
				case 37: // price
					this.outletpriceid_modified.load(change_record.value, outlet.outlet.outletpriceid, this.outletpriceid);
					outletpriceid_set = true ;
					break;
				case 33 : //sub-title
					subtitle = "";
					if (outlet.profile.profile)
						subtitle = outlet.profile.profile.subtitle;
					this.subtitle_modified.load(change_record.value, subtitle, this.subtitle);
					break;
				case 34: //incorporating
					incorporating = "";
					if (outlet.profile.profile)
						incorporating = outlet.profile.profile.incorporating;
					this.incorporating_modified.load(change_record.value, incorporating, this.incorporating);
					break;
				case 35: // officialjournalof
					officialjournalof = "";
					if (outlet.profile.profile)
						officialjournalof = outlet.profile.profile.officialjournalof;
					this.officialjournalof_modified.load(change_record.value, officialjournalof, this.officialjournalof);
					break;
				case 39: // frequency notes
					frequencynotes = "";
					if (outlet.profile.profile)
						frequencynotes = outlet.profile.profile.frequencynotes;
					this.frequencynotes_modified.load(change_record.value, frequencynotes, this.frequencynotes);
					break;
			}
		}

		//set default for drop down if not et in overrides
		if (circulationauditdateid_set == false )
			this.circulationauditdateid.set("value", outlet.outlet.circulationauditdateid);
		if (circulationsourceid_set == false )
			this.circulationsourceid.set("value",outlet.outlet.circulationsourceid);
		if ( outletpriceid_set == false )
		{
			if ( outlet.outlet.outletpriceid==null)
				this.outletpriceid.set("value", 1);
			else
				this.outletpriceid.set("value", outlet.outlet.outletpriceid);
		}
	},
	_update: function()
	{
		if (utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			return;
		}

		this.updatebtn.makeBusy();

		request.post('/research/admin/projects/user_feed_accept_main',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._updated_call_back);
	}

});
});





