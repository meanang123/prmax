//-----------------------------------------------------------------------------
// Name:    Coding.js
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
	"dojo/text!../outlets/templates/Coding.html",
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
	"prcommon2/publisher/PublisherAdd",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/outlet/SelectMultipleOutlets",
	"research/outlets/OutletDelete"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane, topic,  lang, utilities2, request , JsonRest, ItemFileReadStore, domattr, domConstruct, dom, on, array, Button, TextBox){
 return declare("research.outlets.Coding",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	prefix:"coding",
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);

		this._marketsector = new JsonRest( {target:'/research/admin/marketsector/list', labelAttribute:"marketsectordescription",idProperty:"marketsectorid"});

	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes_noFreelancer());
		//this.marketsectorprimaryid.set("store",PRCOMMON.utils.stores.MarketSector());
		//this.marketsectorsecondaryid.set("store",PRCOMMON.utils.stores.MarketSector());
		//this.marketsectortertiaryid.set("store",PRCOMMON.utils.stores.MarketSector());
		

		this.marketsectorprimaryid.set("store", this._marketsector);
		this.marketsectorsecondaryid.set("store", this._marketsector);
		this.marketsectortertiaryid.set("store", this._marketsector);

		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	load:function( outletid, outlet ,profile, prefix )
	{
		if (prefix != "" && prefix != undefined)
		{
			this.prefix = prefix;
		}
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.outletid.set("value", outletid);
		this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);
		this._outletname = outlet.outlet.outletname;
		this.marketsectorprimaryid.set("value", outlet.outlet.marketsectorprimaryid);
		this.marketsectorsecondaryid.set("value", outlet.outlet.marketsectorsecondaryid);
		this.marketsectortertiaryid.set("value", outlet.outlet.marketsectortertiaryid);

		this.interests.set("value",outlet.interests ) ;
		this.coverage.set("value",outlet.coverage ) ;
		this.supplements.set("value", outlet.supplements );
		if (outlet.serieschildren.length > 0)
		{
			domConstruct.destroy(this.prefix+'_serieschildren_table');
			if (dom.byId(this.prefix+'_serieschildren_td'))
			{
				domConstruct.destroy(this.prefix+'_serieschildren_td');
			};			
			td1 = domConstruct.create('td', {
				'align':'right', 
				'class': 'prmaxrowtag' ,
				'valign':'top',
				'style': {'padding-top': '10px'},
				'id':this.prefix+'_serieschildren_td',
				innerHTML: 'Series Children'
				}, this.prefix+'_serieschildren_tr', 'first');
			
			td2 = domConstruct.create('td', {}, this.prefix+'_serieschildren_tr', 'last');
			div = domConstruct.create('div', {
				'id': this.prefix+'_serieschildren_div'
			}, td2);
			
			table = domConstruct.create('table', {'id':this.prefix+'_serieschildren_table'}, this.prefix+'_serieschildren_div', 'first');
			array.forEach(outlet.serieschildren, function(child, i) {
				var tr = domConstruct.create("tr", {}, table),
					td = domConstruct.create("td", {}, tr),
					txbox = domConstruct.create(new TextBox({
							value: child.outletname,
							'readonly':'readonly'
							}).placeAt(td, 'first')),
					bt = new Button({
						'iconClass': 'fa fa-level-down',
						'title': "Load Child Outlet"
					}).placeAt(td, 'last');

				on(bt, "click", function(evt){
					outletid = child.outletid;
					sourcetypeid = child.sourcetypeid;
					prmax_grouptypeid = "";
					if (child.outlettypeid == 19)
					{
						prmax_grouptypeid = "freelance";
					};						
					topic.publish("LoadChildOutlet", outletid, prmax_grouptypeid, sourcetypeid);		
				});				
			 });	
		}
		else 
		{
			domConstruct.destroy(this.prefix+'_serieschildren_table');
			domConstruct.destroy(this.prefix+'_serieschildren_td');
		};
		
		if (profile.profile)
		{
			this.seriesparentid.set("parentbtnvalue", true);
			this.seriesparentid.set("value", profile.profile.seriesparentid);
			this.supplementofid.set("value", profile.profile.supplementofid)
			this.seriesparentid.set("displayvalue", profile.seriesparentname);
			this.supplementofid.set("displayvalue", profile.supplementofname);
		}
		else
		{
			this.seriesparentid.set("value", null);
			this.supplementofid.set("value", null);
			this.seriesparentid.set("displayvalue", "");
			this.supplementofid.set("displayvalue","");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.publisherid.set("value", null );
		this.outletid.set("value", -1);
		domattr.set(this.serieschildren,"innerHTML","");

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

		request.post('/research/admin/outlets/update_coding',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Updated");
			topic.publish("/coding/update", response);
			this.coverage.clear_selection();
			this.interests.clear_selection();
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
	_delete:function()
	{
			this.outlet_delete_ctrl.load ( this._outletid, this._outletname , this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
	}
});
});





