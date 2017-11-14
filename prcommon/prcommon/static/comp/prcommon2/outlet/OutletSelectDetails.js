//-----------------------------------------------------------------------------
// Name:    prcommon2.outlet.OutletSelect
// Author:  Chris Hoy
// Purpose:
// Created: 09/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
// Main control
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlet/templates/OutletSelectDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/json",
	"dojo/request",
	"ttl/utilities2",
	"ttl/store/JsonRest",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/_base/lang",
	"dojo/topic",
	"ttl/grid/Grid",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/array",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/Dialog",
	"prcommon2/search/OutletSearch",
	"dijit/layout/ContentPane",
	"dojox/form/BusyButton",
	"prcommon2/web/WebButton",
	"dijit/layout/TabContainer",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, BorderContainer, json, request, utilities2, JsonRest, JsonRestStore, Observable, lang, topic, Grid, domattr, domclass, ItemFileReadStore, array){
 return declare("prcommon2.outlet.OutletSelectDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._load_call_back = lang.hitch(this, this._load_call);
		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});
		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});
		this._publishers = new ItemFileReadStore({url:"/common/lookups?searchtype=publishers"});

		this.outletid = '';

	},
	postCreate:function()
	{
		this.country.set("store",PRCOMMON.utils.stores.Countries());
		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.cost.set("store", this._costs);
		this.language.set("store", this._languages);
		this.publisherid.set("store", this._publishers);

		this.www_show.set("source",this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.instagram_show.set("source",this.instagram);

		this.inherited(arguments);
	},
	_setDialogAttr:function (dialog)
	{
		this._dialog = dialog;
	},
	load:function(outletid)
	{
		request.post('/research/admin/outlets/research_outlet_edit_get',
				utilities2.make_params({ data : {outletid: outletid}})).
				then ( this._load_call_back);

	},
	_load_call:function(response)
	{
		this._dialog("show");

		if (response.success == 'OK')
		{
			var address = '';
			var interests = '';
			var coverage = '';
			var serieschildren = '';

			//address
			if (response.outlet.address.address1){ address = response.outlet.address.address1};
			if (response.outlet.address.address2){ address += ', ' + response.outlet.address.address2};
			if (response.outlet.address.townname){ address += ', ' + response.outlet.address.townname};
			if (response.outlet.address.postcode){ address += ', ' + response.outlet.address.postcode};
			//keywords
			if (response.outlet.interests.data.length > 0){
				for (var i=0; i<response.outlet.interests.data.length; i++)	{
					interests = interests + response.outlet.interests.data[i].interestname + ", ";
				}
				interests = interests.substring(0, interests.length-2);
			};
			//coverage
			if (response.outlet.coverage.length > 0){
				for (var i=0; i<response.outlet.coverage.length; i++)	{
					coverage = coverage + response.outlet.coverage[i].geographicalname + ", ";
				}
				coverage = coverage.substring(0, coverage.length-2);
			};
			//serieschildren
			if (response.outlet.serieschildren.length > 0){
				for (var i=0; i<response.outlet.serieschildren.length; i++)	{
					serieschildren = serieschildren + response.outlet.serieschildren[i].outletname + ", ";
				}
				serieschildren = serieschildren.substring(0, serieschildren.length-2);
			};

			this.outletname.set("value", response.outlet.outlet.outletname);
			this.www.set("value", response.outlet.outlet.www);
			this.address.set("value", address);
			this.country.set("value", response.outlet.outlet.countryid);
			this.tel.set("value", response.outlet.communications.tel);
			this.email.set("value", response.outlet.communications.email);
			this.twitter.set("value", response.outlet.communications.twitter);
			this.facebook.set("value", response.outlet.communications.facebook);
			this.instagram.set("value", response.outlet.communications.instagram);
			this.circulation.set("value", response.outlet.outlet.circulation);
			this.frequency.set("value", response.outlet.outlet.frequencyid);
			this.prmax_outlettypeid.set("value", response.outlet.outlet.prmax_outlettypeid);
			this.cost.set("value", response.outlet.outlet.outletpriceid);
			this.sqcm.set("value", response.outlet.outlet.mp_sqcm);
			this.keywords.set("value", interests);

			this.publisherid.set("value", response.outlet.outlet.publisherid );
			this.language.set("value", response.outlet.languages.language1id);
			this.profile.set("value", response.outlet.outlet.profile);
			if (response.outlet.profile.profile != null)
			{
				this.editorialprofile.set("value", response.outlet.profile.profile.editorialprofile);
				this.readership.set("value", response.outlet.profile.profile.readership);
				this.nrsreadership.set("value", response.outlet.profile.profile.nrsreadership);
				this.jicregreadership.set("value", response.outlet.profile.profile.jicregreadership);
				this.broadcasttimes.set("value", response.outlet.profile.profile.broadcasttimes);
			}

			this.coverage.set("value", coverage);
			this.serieschildren.set("value", serieschildren);
		}
	},
	_close:function()
	{

		if ( this._dialog)
			this._dialog("hide");
		this._clear();
	},
	_clear:function()
	{
		this.outletname.set("value", "");
		this.www.set("value", "");
		this.address.set("value", "");
		this.country.set("value", "");
		this.tel.set("value", "");
		this.email.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.instagram.set("value", "");
		this.circulation.set("value", "");
		this.frequency.set("value", "");
		this.prmax_outlettypeid.set("value", "");
		this.cost.set("value", "");
		this.sqcm.set("value", "");
		this.keywords.set("value", "");

		this.publisherid.set("value", "" );
		this.language.set("value", "");
		this.profile.set("value", "");
		this.editorialprofile.set("value", "");
		this.readership.set("value", "");
		this.nrsreadership.set("value", "");
		this.jicregreadership.set("value", "");
		this.broadcasttimes.set("value", "");
		this.coverage.set("value", "");
		this.serieschildren.set("value", "");
	}
});
});
