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
	"dojo/text!../outlets/templates/OutletEditMainDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
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
	"research/outlets/OutletDelete",
	"prcommon2/web/WebSourcesAdd",
	"prcommon2/web/WebDatesAdd",
	"prcommon2/circulation/CirculationSourcesAdd",
	"prcommon2/circulation/CirculationDatesAdd",
	"prcommon2/web/WebButton",
	"prcommon2/dialogs/SynchroniseDialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, domattr, JsonRestStore, ItemFileReadStore ){
 return declare("research.outlets.OutletEditMainDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._updated_call_back = lang.hitch ( this , this._updated_call );
		this._media_only_call_back = lang.hitch(this, this._media_only_call );
		this._synchronise_call_back = lang.hitch ( this, this._synchronise_call);
		this._complete_call_back = lang.hitch(this, this._complete_call);

		this._circulationsources = new JsonRestStore( {target:'/research/admin/circulationsources/list', labelAttribute:"circulationsourcedescription",idProperty:"circulationsourceid"});
		this._circulationauditdates = new JsonRestStore( {target:'/research/admin/circulationdates/list', labelAttribute:"circulationauditdatedescription",idProperty:"circulationauditdateid"});
		this._websources = new JsonRestStore( {target:'/research/admin/websources/list', labelAttribute:"websourcedescription",idProperty:"websourceid"});
		this._webauditdates = new JsonRestStore( {target:'/research/admin/webdates/list', labelAttribute:"webauditdatedescription",idProperty:"webauditdateid"});
		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});
		this._mediaaccesstypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=mediaaccesstypes"});

	},
	postCreate:function()
	{
		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.circulationsource_add_ctrl.set("dialog", this.circulationsource_add_dlg);
		this.circulationsourceid.set("store", this._circulationsources);
		this.circulationdates_add_ctrl.set("dialog", this.circulationdates_add_dlg);
		this.circulationauditdateid.set("store", this._circulationauditdates);

		this.websource_add_ctrl.set("dialog", this.websource_add_dlg);
		this.websourceid.set("store", this._websources);
		this.webdates_add_ctrl.set("dialog", this.webdates_add_dlg);
		this.webauditdateid.set("store", this._webauditdates);

		this.outletpriceid.set("store", this._costs);
		this.mediaaccesstypeid.set("store", this._mediaaccesstypes);

		this.www_show.set("source", this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);
		this.instagram_show.set("source",this.instagram);
		this.circulation_show.set("source", "https://www.abc.org.uk/");

		this.inherited(arguments)
	},
	_updated_call: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
			topic.publish(PRCOMMON.Events.Outlet_Updated,response.data);
			this._clear_reason();
		}
		else
		{
			alert("Failed to updated");
		}
		this.updatebtn.cancel();
	},
	clear:function()
	{
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.updatebtn.cancel();
	},
	load:function( outletid, outlet, profile )
	{
		this._clear_reason();
		this._outletid = outletid;
		this.outletname.set("value", outlet.outlet.outletname ) ;
		this.sortname.set("value",outlet.outlet.sortname);
		this.countryid.set("value",outlet.outlet.countryid);
		this.address1.set("value",outlet.address.address1);
		this.address2.set("value",outlet.address.address2);
		this.townname.set("value",outlet.address.townname);
		this.county.set("value",outlet.address.county);
		this.postcode.set("value",outlet.address.postcode);

		this.circulation.set("value", outlet.outlet.circulation ) ;
		this.webbrowsers.set("value", outlet.outlet.webbrowsers ) ;
		this.frequency.set("value", outlet.outlet.frequencyid ) ;

		this.www.set("value",outlet.outlet.www);
		this.email.set("value",outlet.communications.email);
		this.tel.set("value",outlet.communications.tel);
		this.fax.set("value",outlet.communications.fax);
		this.linkedin.set("value",outlet.communications.linkedin);
		this.twitter.set("value",outlet.communications.twitter);
		this.facebook.set("value",outlet.communications.facebook);
		this.instagram.set("value",outlet.communications.instagram);

		this.circulationsourceid.set("value", outlet.outlet.circulationsourceid );
		this.circulationauditdateid.set("value",outlet.outlet.circulationauditdateid);
		this.websourceid.set("value", outlet.outlet.websourceid );
		this.webauditdateid.set("value",outlet.outlet.webauditdateid);
		if (outlet.outlet.outletpriceid==null)
			this.outletpriceid.set("value", 1);
		else
			this.outletpriceid.set("value", outlet.outlet.outletpriceid);
		if (outlet.outlet.mediaaccesstypeid==null)
			this.mediaaccesstypeid.set("value", 1);
		else
			this.mediaaccesstypeid.set("value", outlet.outlet.mediaaccesstypeid);

		if (profile.profile)
		{
			this.subtitle.set("value", profile.profile.subtitle);
			this.officialjournalof.set("value", profile.profile.officialjournalof);
			this.incorporating.set("value", profile.profile.incorporating);
			this.frequencynotes.set("value", profile.profile.frequencynotes);
		}
		else
		{
			this.subtitle.set("value", "");
			this.officialjournalof.set("value", "");
			this.incorporating.set("value", "");
			this.frequencynotes.set("value", "");
		}
		this.no_sync.set("value", outlet.researchdetails.no_sync);


		this.outletid.set("value",outlet.outlet.outletid);
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_setCheckedAttr:function( value )
	{
		this.no_sync.set("checked",value);
	},	
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.updatebtn.cancel();
			throw "N"
		}
		
		// add the reason code
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");
		tmp_data["no_sync"] = this.no_sync.get("checked");

		 request.post('/research/admin/outlets/research_main_update',
			utilities2.make_params({ data : tmp_data})).
			then (this._updated_call_back);
	},
	_delete:function()
	{
			this.outlet_delete_ctrl.load ( this._outletid, this.outletname.get("value") , this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
	},
	_media_only_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Social Media Only Updated");
		}
		else
		{
			alert("Problem Updating Social Media Only");
		}
	},
	_update_media_only:function()
	{
		if ( this.twitter.isValid() == false ||
				this.facebook.isValid() == false ||
				this.instagram.isValid() == false ||
				this.linkedin.isValid() == false )
		{
			alert("Invalid Data");
			return false;
		}

		request.post("/research/admin/outlets/research_update_media",
			utilities2.make_params({ data : this.form.get("value")})).then
			(this._media_only_call_back);
	},
	_new_circulation_source:function()
	{
		this.circulationsource_add_ctrl.clear();
		this.circulationsource_add_dlg.show();

	},
	_new_circulation_date:function()
	{
		this.circulationdates_add_ctrl.clear();
		this.circulationdates_add_dlg.show();
	},
	_add_circulation_source_event:function( circulationsource )
	{
		this.circulationsourceid.set("value", circulationsource.circulationsourceid);
	},
	_add_circulation_dates_event:function( circulationdates )
	{
		this.circulationauditdateid.set("value", circulationdates.circulationauditdateid);
	},

	_new_web_source:function()
	{
		this.websource_add_ctrl.clear();
		this.websource_add_dlg.show();
	},
	_new_web_date:function()
	{
		this.webdates_add_ctrl.clear();
		this.webdates_add_dlg.show();
	},
	_add_web_source_event:function( websource )
	{
		this.websourceid.set("value", websource.websourceid);
	},
	_add_web_dates_event:function( webdates )
	{
		this.webauditdateid.set("value", webdates.webauditdateid);
	},
	_synchronise:function()
	{
		var content = {};
		var parent_outletid =  this._outletid;
		content['outletid'] = parent_outletid;

		this.synchronise_dlg.show();
		this.synchronise_node.SetCompleted(this._complete_call_back);
		this.synchronise_node.start(content);

	},
	_synchronise_call:function( response )
	{
		if ( response.success=="OK")
		{
			alert("Employees Synchronised");
			this._complete_call();
		}
		else
		{
			alert("Employees Synchronisation Failed");
		}
	},
	_complete_call:function()
	{
		this.synchrbtn.cancel();
		this.synchronise_dlg.hide();
	}

});
});





