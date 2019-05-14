//-----------------------------------------------------------------------------
// Name:    OutletEditMainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/Profile.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/circulation/CirculationSourcesAdd",
	"prcommon2/circulation/CirculationDatesAdd",
	"prcommon2/outlet/SelectMultipleOutlets",
	"prcommon2/production/ProductionCompanyAdd",
	"prcommon2/common/ExpandedText"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic,  lang, utilities2, request , domattr, JsonRest, ItemFileReadStore){
 return declare("research.outlets.Profile",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._productioncompanies = new JsonRest( {target:'/research/admin/production/list', labelAttribute:"productioncompanydescriptiion",idProperty:"productioncompanyid"});
		this._publishers = new JsonRest( {target:'/research/admin/publisher/list', labelAttribute:"publishername",idProperty:"publisherid"});

		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);

		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});

	},
		postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.productioncompanyid.set("store", this._productioncompanies);
		this.production_add_ctrl.set("dialog",this.production_add_dlg);

		this.publisher_add_ctrl.set("dialog", this.publisher_add_dlg);
		this.publisherid.set("store", this._publishers);

		this.language1id.set("store", this._languages);
		this.language2id.set("store", this._languages);


		this.inherited(arguments);
	},
	load:function( outletid, outlet ,profile )
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.outletid.set("value", outletid);
		this._outletname = outlet.outlet.outletname;
		domattr.set(this.old_profile_outletid,"value", outletid);

		this.publisherid.set("value", outlet.outlet.publisherid );

		this.language1id.set("value", outlet.languages.language1id);
		this.language2id.set("value", outlet.languages.language2id);

		if (profile.profile)
		{
			this.readership.set("value", profile.profile.readership);
			this.editorialprofile.set("value", profile.profile.editorialprofile);
			this.nrsreadership.set("value", profile.profile.nrsreadership);
			this.jicregreadership.set("value", profile.profile.jicregreadership);
			this.deadline.set("value", profile.profile.deadline);
			this.broadcasttimes.set("value", profile.profile.broadcasttimes);
			this.productioncompanyid.set("value", profile.profile.productioncompanyid);
			this.web_profile_link.set("value",profile.profile.web_profile_link);
		}
		else
		{
			this.readership.set("value", "");
			this.editorialprofile.set("value", "");
			this.nrsreadership.set("value", "");
			this.jicregreadership.set("value", "");
			this.deadline.set("value", "");
			this.broadcasttimes.set("value", "");
			this.productioncompanyid.set("value", null);
			this.web_profile_link.set("value","");
		}

		this.savenode.cancel();
	},
	clear:function()
	{
		this.outletid.set("value", -1);
		this.readership.set("value", "");
		this.editorialprofile.set("value", "");
		this.nrsreadership.set("value", "");
		this.jicregreadership.set("value", "");

		this.language1id.set("value", "");
		this.language2id.set("value", "");

		this.productioncompanyid.set("value", null);
		this.web_profile_link.set("value","");

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

		// add the reason code
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/outlets/update_profile',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
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
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_show_old_profile:function()
	{
		this.old_profile_form.submit();
	},
	_new_production_company:function()
	{
		this.production_add_ctrl.clear();
		this.production_add_dlg.show();
	},
	_add_event:function ( publisher)
	{
		this.publisherid.set("value", publisher.publisherid);
	},
	_add_production_event:function ( production )
	{
		this.productioncompanyid.set("value", production.productioncompanyid);
	},
	_new_publisher:function()
	{
		this.publisher_add_ctrl.clear();
		this.publisher_add_dlg.show();
	},
	_delete:function()
	{
			this.outlet_delete_ctrl.load ( this.outletid.get("value"), this._outletname, this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
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





