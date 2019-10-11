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
	"dojo/text!../pages/templates/Profile.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dojo/query",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic,  lang, domattr,domclass, utilities2, request , JsonRestStore, ItemFileReadStore, query){
 return declare("prmaxquestionnaires.pages.Profile",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._publishers = new JsonRestStore({target:'/questionnaire/list_publisher', labelAttribute:"publishername",idProperty:"publisherid"});
		this._circulationsources = new JsonRestStore({target:'/questionnaire/list_circulationsources', labelAttribute:"circulationsourcedescription", idProperty : "circulationsourceid"});
		this._circulationauditdates = new JsonRestStore({target:'/questionnaire/list_circulationdates', labelAttribute:"circulationauditdatedescription", idProperty : "circulationauditdateid"});
		this._productioncompanies = new JsonRestStore({target:'/questionnaire/list_production', idProperty:"productioncompanyid"});


		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});
		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});

		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.outletpriceid.set("store", this._costs);
		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.circulationsourceid.set("store", this._circulationsources);
		this.circulationauditdateid.set("store", this._circulationauditdates);
		this.publisherid.set("query",{questionnaireid:PRMAX.questionnaire.questionnaireid});
		this.publisherid.set("store", this._publishers);

		this.productioncompanyid.set("store", this._productioncompanies);

		this.language1id.set("store", this._languages);
		this.language2id.set("store", this._languages);

		this._show_fields_by_type();
		this.load(PRMAX.questionnaire);

	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			if (outlet.outlet.outletpriceid==null)
				this.outletpriceid.set("value", 1);
			else
				this.outletpriceid.set("value", outlet.outlet.outletpriceid);
			this.circulation.set("value", outlet.outlet.circulation ) ;
			this.frequency.set("value", outlet.outlet.frequencyid ) ;
			this.circulationsourceid.set("value", outlet.outlet.circulationsourceid );
			this.circulationauditdateid.set("value",outlet.outlet.circulationauditdateid);
			this.publisherid.set("value", outlet.outlet.publisherid );
			this.language1id.set("value", outlet.language1id);
			this.language2id.set("value", outlet.language2id);
			this.relatedoutlets.set("value", outlet.relatedoutlets);
			//this.publishername.set("value", outlet.publishername);

			if (outlet.outletprofile.profile)
			{
				if (outlet.outletprofile.profile.editorialprofile != null)
					this.editorialprofile.set("value", outlet.outletprofile.profile.editorialprofile.replace(/<br\/>/gi, "\n"));
				this.readership.set("value",outlet.outletprofile.profile.readership);
				this.broadcasttimes.set("value",outlet.outletprofile.profile.broadcasttimes);
				this.frequencynotes.set("value", outlet.outletprofile.profile.frequencynotes);
				this.productioncompanyid.set("value", outlet.outletprofile.profile.productioncompanyid);
			}
			else
			{
				this.editorialprofile.set("value", "");
				this.readership.set("value", "");
				this.broadcasttimes.set("value","");
				this.frequencynotes.set("value", "");
				this.productioncompanyid.set("value",-1);
			}


			if ( outlet.outlet.countryid == 119 )
			{
				domclass.add(this.publisher_std_view,"prmaxhidden");
				domclass.remove(this.publisher_text_view,"prmaxhidden");
			}
		}

		domattr.set(this.relatedoutlets_view,"innerHTML",questionnaire.relatedoutlets_view);
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_update_profile:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			if (this._page_error)
				this._page_error();
			throw "n";
		}

		var content=this.form.get("value");
		content["relatedoutlets"] = this.relatedoutlets.get("value");

		request.post('/questionnaire/update_profile',
			utilities2.make_params({ data : content })).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Profile Updated");
		}
		else
		{
			alert("Changes Failed to Apply");
			if ( this._page_error)
				this._page_error();
		}
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
		this._update_profile();
	},
	_show_fields_by_type:function()
	{
		if (PRMAX.questionnaire.outlet.outlet.isbroadcast==false)
		{
			domclass.add(this.productioncompany_view,"prmaxhidden");
			domclass.add(this.broadcasttimes_view,"prmaxhidden");
		}
	}
});
});





