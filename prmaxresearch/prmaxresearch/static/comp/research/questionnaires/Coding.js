//-----------------------------------------------------------------------------
// Name:    Coding.js
// Author:   Chris Hoy
// Purpose:
// Created: 04/01/2013
// To do:
//-----------------------------------------------------------------------------
//
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Coding.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-attr",
	"dojo/dom-construct",	
	"dojo/dom",
	"dojo/on",
	"dojo/_base/array",	
	"dijit/form/Button",	
	"dijit/form/TextBox",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/outlet/SelectMultipleOutlets"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic, lang, utilities2, request , JsonRest, ItemFileReadStore, domattr, domConstruct, dom, on, array, Button, TextBox){
 return declare("research.questionnaires.Coding",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
	},
		postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.seriesparentid.set("parentbtnvalue", false);

		this.inherited(arguments);
	},
	_reset_fields:function()
	{

	},
	load:function( projectitem, outlet , user_changes )
	{

		this.seriesparentid.set("parentbtnvalue", false);
		this._reset_fields();
		this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);

		this.interests.set("value",outlet.interests ) ;
//		domattr.set(this.serieschildren, "innerHTML",outlet.serieschildren);

		if (outlet.serieschildren.length > 0)
		{
			domConstruct.destroy('serieschildren_table');
			if (dom.byId('serieschildren_td')) 
			{
				domConstruct.destroy('serieschildren_td');
			};			
			domConstruct.create('td', {
				'align':'right', 
				'class': 'prmaxrowtag' ,
				'valign':'top',
				'style': {'padding-top': '10px'},
				'id':'serieschildren_td',
				innerHTML: 'Series Children'
				}, 'serieschildren_tr', 'first');
			
			td2 = domConstruct.create('td', {}, 'serieschildren_tr', 'last');
			div = domConstruct.create('div', {
				'id': 'serieschildren_div'	
			}, td2);
			
			domConstruct.create('table', {'id':'serieschildren_table'}, 'serieschildren_div', 'first');
			array.forEach(outlet.serieschildren, function(child, i) {
				var tr = domConstruct.create("tr", {}, "serieschildren_table"),
					td = domConstruct.create("td", {}, tr),
					txbox = domConstruct.create(new TextBox({
							value: child.outletname,
							'readonly':'readonly'
							}).placeAt(td, 'first'))
			 });	
		}
		else 
		{
			domConstruct.destroy('serieschildren_table');
			domConstruct.destroy('serieschildren_td');
		};

		if (outlet.profile.profile)
		{
			this.seriesparentid.set("parentbtnvalue", false);
			this.seriesparentid.set("value", outlet.profile.profile.seriesparentid);
			this.supplementofid.set("value", outlet.profile.profile.supplementofid)
			this.seriesparentid.set("displayvalue", outlet.profile.seriesparentname);
			this.supplementofid.set("displayvalue", outlet.profile.supplementofname);
		}
		else
		{
			this.seriesparentid.set("value", null);
			this.supplementofid.set("value", null);
			this.seriesparentid.set("displayvalue", "");
			this.supplementofid.set("displayvalue","");
		}

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 45:
					this.seriesparentid_modified.load(change_record.value, outlet.profile.profile.seriesparentid, this.seriesparentid);
					break;
				case 47:
					this.supplementofid_modified.load(change_record.value, outlet.profile.profile.supplementofid, this.supplementofid);
					break;
				case 52:
					this.supplements_modified.load(change_record.value, outlet.supplements, this.supplements);
					break;
				case 53:
					this.editions_modified.load(change_record.value, outlet.editions, this.editions);
					break;
				case 64:
					domattr.set(this.seriesfeedback,"innerHTML",change_record.value);
					break;
			}
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);
		this.savenode.cancel();

	},
	clear:function()
	{
		this.outletid.set("value", -1);
		domattr.set(this.seriesfeedback,"innerHTML","");
		this.savenode.cancel();
	},
	_update_coding:function()
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

		request.post('/research/admin/projects/user_feed_coding',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Coding Updated");
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
	}
});
});





