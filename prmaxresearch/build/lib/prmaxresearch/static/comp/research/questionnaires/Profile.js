//-----------------------------------------------------------------------------
// Name:    Profile.js
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
	"dojo/text!../questionnaires/templates/Profile.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/publisher/PublisherAdd",
	"research/questionnaires/UserModified",
	"prcommon2/production/ProductionCompanyAdd",
	"prcommon2/common/ExpandedText"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request , JsonRest, ItemFileReadStore, domattr, domclass){
 return declare("questionnaires.outlets.Profile",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._publishers = new JsonRest( {target:'/research/admin/publisher/list', labelAttribute:"publishername",idProperty:"publisherid"});
		this._productioncompanies = new JsonRest( {target:'/research/admin/production/list', labelAttribute:"productioncompanydescriptiion",idProperty:"productioncompanyid"});

		topic.subscribe(PRCOMMON.Events.Publisher_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Production_Company_Added, lang.hitch(this, this._add_production_event));

		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);

		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});

	},
		postCreate:function()
	{
		this.inherited(arguments);

		this.publisher_add_ctrl.set("dialog", this.publisher_add_dlg);
		this.publisherid.set("store", this._publishers);

		this.productioncompanyid.set("store", this._productioncompanies);
		this.production_add_ctrl.set("dialog",this.production_add_dlg);

		this.language1id.set("store", this._languages);
		this.language2id.set("store", this._languages);

	},
	_reset_fields:function()
	{
		this.readership_modified.clear();
		this.editorialprofile_modified.clear();
		this.publisher_modified.clear();
		this.nrsreadership_modified.clear();
		this.jicregreadership_modified.clear();
		this.productioncompanyid_modified.clear();
		this.deadline_modified.clear();
		this.broadcasttimes_modified.clear();
		this.language1id_modified.clear();
		this.language2id_modified.clear();
		domattr.set(this.publishername_view, "innerHTML", "");

	},
	load:function( projectitem, outlet, user_changes)
	{
		this._reset_fields();

		if (outlet.profile.profile)
		{
			this.readership.set("value", outlet.profile.profile.readership);
			this.editorialprofile.set("value", outlet.profile.profile.editorialprofile);
			this.nrsreadership.set("value", outlet.profile.profile.nrsreadership);
			this.jicregreadership.set("value", outlet.profile.profile.jicregreadership);
			this.productioncompanyid.set("value", outlet.profile.profile.productioncompanyid);
			this.deadline.set("value", outlet.profile.profile.deadline);
			this.broadcasttimes.set("value", outlet.profile.profile.broadcasttimes);
		}
		else
		{
			this.readership.set("value", "");
			this.editorialprofile.set("value","");
			this.nrsreadership.set("value", "");
			this.jicregreadership.set("value", "");
			this.productioncompanyid.set("value", "");
			this.deadline.set("value", "");
			this.broadcasttimes.set("value", "");
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);

		var publisherid_set = false;
		var language1id_set = false;
		var language2id_set = false;


		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 38: // readership
					var readership = "";
					if (outlet.profile.profile)
						readership = outlet.profile.profile.readership;
					this.readership_modified.load(change_record.value, readership, this.readership);
					break;
				case 3: // editorialprofile
					var editorialprofile = "";
					if (outlet.profile.profile)
						editorialprofile = outlet.profile.profile.editorialprofile;
					this.editorialprofile_modified.load(change_record.value, editorialprofile, this.editorialprofile);
					break;
				case 36: // publisher
					this.publisher_modified.load(change_record.value, outlet.outlet.publisherid, this.publisherid);
					publisherid_set = true;
					break;
				case 48:
					this.language1id_modified.load(change_record.value, outlet.languages.language1id, this.language1id);
					language1id_set = true;
					break;
				case 51:
					this.language2id_modified.load(change_record.value, outlet.languages.language2id, this.language2id);
					language2id_set = true;
					break;
				case 100:
					domclass.remove(this.publishername_view,"prmaxhidden");
					domattr.set(this.publishername_view, "innerHTML", change_record.value);
					break
			}
		}

		if (publisherid_set == false )
			this.publisherid.set("value", outlet.outlet.publisherid );
		if ( language1id_set == false )
			this.language1id.set("value", outlet.languages.language1id);
		if (language2id_set == false )
			this.language2id.set("value", outlet.languages.language2id);


		this.savenode.cancel();
	},
	clear:function()
	{
		this.publisherid.set("value", null );
		this.editorialprofile.set("value", "");
		this.savenode.cancel();
	},
	_update_profile:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		var tmp_data = this.form.get("value");

		request.post('/research/admin/projects/user_feed_accept_profile',
				utilities2.make_params({ data : tmp_data })).
				then (this._update_call_back,this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Profile Updated");
		}
		else
		{
			alert("Problem");
		}
		this.savenode.cancel();
	},
	_add_event:function ( publisher)
	{
		this.publisherid.set("value", publisher.publisherid);
	},
	_new_publisher:function()
	{
		this.publisher_add_ctrl.clear();
		this.publisher_add_dlg.show();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_new_production_company:function()
	{
		this.production_add_ctrl.clear();
		this.production_add_dlg.show();
	},
	_add_production_event:function ( production )
	{
		this.productioncompanyid.set("value", production.productioncompanyid);
	},
	_expand_broadcast:function()
	{
		this.text_view_ctrl.show_control( this.broadcasttimes, this.text_view_dlg, "Broadcast Times");
	},
	_expand_deadline:function()
	{
		this.text_view_ctrl.show_control( this.deadline, this.text_view_dlg, "Deadlines");
	},
	_expand_profile:function()
	{
		this.text_view_ctrl.show_control( this.editorialprofile, this.text_view_dlg, "Editorial Profile");
	},
	_expand_readership:function()
	{
		this.text_view_ctrl.show_control( this.readership, this.text_view_dlg, "Readership");
	},
	_expand_nrsreadership:function()
	{
		this.text_view_ctrl.show_control( this.nrsreadership, this.text_view_dlg, "PAMco");
	},
	_expand_jicreg_readership:function()
	{
		this.text_view_ctrl.show_control( this.jicregreadership, this.text_view_dlg, "JICREG readership");
	}
});
});
