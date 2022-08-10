require({cache:{
'url:research/lookups/templates/Countries.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:45px;width:100%;overflow:hidden\",\"class\":\"searchresults\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" data-dojo-props='title:\"Enter Filter\"' data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxlabeltag\">Name</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:true,maxlength:45,type:\"text\"'  ></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxlabeltag\">Type</td><td><select data-dojo-attach-point=\"countrytypeid_filter\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"countrytypeid\",searchAttr:\"name\",labelType:\"html\"' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Clear Filter by\"'></button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\",label:\"Filter by\"'></button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true,label:\"Add\"' data-dojo-attach-event=\"onClick:_show_new\"></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"countries_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",style:\"width:50%;height:100%\",splitter:\"true\"' ></div>\r\n\t<div data-dojo-type=\"dijit/Dialog\" data-dojo-attach-point=\"add_dlg\" data-dojo-props='title:\"Add Country\",style:\"width:400px\"'>\r\n\t\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<table width=\"300px\" cellpadding=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\">Name</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"countryname\" data-dojo-props='required:true,name:\"countryname\",invalidMessage:\"Please Enter Country Name\",trim:true,type:\"text\"'></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\">Type</td><td><select data-dojo-attach-point=\"countrytypeid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"countrytypeid\",searchAttr:\"name\",labelType:\"html\",required:true' /></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\">Parent</td><td><select data-dojo-attach-point=\"regioncountryid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"regioncountryid\",searchAttr:\"name\",labelType:\"html\"' /></td></tr>\r\n\t\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='label:\"Add\",busyLabel:\"Please Wait\",type:\"button\"' data-dojo-attach-point=\"addbtn\" data-dojo-attach-event=\"onClick:_add\"></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/Dialog\" data-dojo-attach-point=\"upd_dlg\" data-dojo-props='title:\"Update Country\",style:\"width:400px\"'>\r\n\t\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"upd_form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"upd_countryid\" data-dojo-props='name:\"countryid\",type:\"hidden\"'>\r\n\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\">Name</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"upd_countryname\" data-dojo-props='required:true,name:\"countryname\",invalidMessage:\"Please Enter Country Name\",trim:true,type:\"text\"'></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\">Type</td><td><select data-dojo-attach-point=\"upd_countrytypeid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"countrytypeid\",searchAttr:\"name\",labelType:\"html\",required:true' /></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\">Parent</td><td><select data-dojo-attach-point=\"upd_regioncountryid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"regioncountryid\",searchAttr:\"name\",labelType:\"html\"' /></td></tr>\r\n\t\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='label:\"Update\",busyLabel:\"Please Wait\",type:\"button\"' data-dojo-attach-point=\"updbtn\" data-dojo-attach-event=\"onClick:_update\"></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Countries.js
// Author:  Chris Hoy
// Purpose:
// Created: 18/07/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/lookups/Countries", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/Countries.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang ){
 return declare("research.lookup.Countries",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this.countries =  new Observable( new JsonRest( {target:'/research/admin/countries/list', idProperty:"countryid"}));
		this.countrytypes_filter = new ItemFileReadStore ({ url:"/common/lookups?searchtype=countrytypes&nofilter=1"});
		this.countrytypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=countrytypes"});
		this.countries_list = new ItemFileReadStore( {url:"/common/lookups?searchtype=countries&nofilter=1"} );

		this._add_call_back = lang.hitch(this, this._add_call);
		this._upd_call_back = lang.hitch(this, this._upd_call);
		this._show_edit_call_back  = lang.hitch(this,this._show_edit_call);

	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Name',className: "standard", field:"countryname"},
			{label: 'Type',className: "standard", field:"countrytypedescription"},
			{label: 'Parent',className: "standard", field:"parentcountryname"}
		];

		this.countries_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.countries,
			query:{}
		});

		this.countries_grid.on("dgrid-select", lang.hitch(this,this._select_country));


		this.countrytypeid_filter.set("store" , this.countrytypes_filter);
		this.countrytypeid_filter.set("value", -1 );
		this.countrytypeid.set("store" , this.countrytypes);
		this.countrytypeid.set("value", 1 );
		this.regioncountryid.set("store", this.countries_list);
		this.regioncountryid.set("value", -1);
		this.upd_countrytypeid.set("store" , this.countrytypes);
		this.upd_regioncountryid.set("store", this.countries_list);

		this.inherited(arguments);
	},
	_select_country:function(e)
	{
		request.post('/research/admin/countries/countries_get',
				utilities2.make_params({ data : {countryid: e.rows[0].data.countryid }})).
				then (this._show_edit_call_back);
	},
	_show_edit_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.upd_countryid.set("value", response.data.countryid);
			this.upd_countryname.set("value", response.data.countryname);
			this.upd_countrytypeid.set("value", response.data.countrytypeid);
			this.upd_regioncountryid.set("value", ( response.data.regioncountryid == null) ? -1 : response.data.regioncountryid );
			this.updbtn.cancel();
			this.upd_dlg.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	startup:function()
	{
		this.inherited(arguments);
		this.countries_grid_view.set("content", this.countries_grid);
	},
	_execute:function()
	{
			var query = {};

			if ( arguments[0].countrytypeid != -1 )
				query["countrytypeid"] = arguments[0].countrytypeid;
			if ( arguments[0].filter != "" )
				query["countryname"] = arguments[0].filter;

			this.countries_grid.set("query",query);
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
		this.countrytypeid.set("value",-1);
	},
	_add:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if ( confirm("Add Country"))
		{
			request.post('/research/admin/countries/countries_add',
				utilities2.make_params({data : this.form.get("value")})).
				then(this._add_call_back);
		}
	},
	_add_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.countries.add( response.country ) ;
			alert ( "Added");
			this.add_dlg.hide();
		}
		else
		{
			if ( response.message)
				alert(response.message ) ;
			else
				alert("Problem");
		}
		this.addbtn.cancel();
		this.updbtn.cancel();
	},
	_upd_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.countries.put( response.country ) ;
			alert ( "Updated");
			this.upd_dlg.hide();
		}
		else if ( response.success == "DU" )
		{
			alert ( "Already Exists");
		}
		else
		{
			if ( response.message)
				alert(response.message ) ;
			else
				alert("Problem");
		}
		this.addbtn.cancel();
		this.updbtn.cancel();
	},
	_show_new:function()
	{
		this.countryname.set("value","");
		this.countrytypeid.set("value",1);
		this.regioncountryid.set("value", -1);
		this.add_dlg.show();
		this.countryname.focus();
	},
	_update:function()
	{
		if ( utilities2.form_validator(this.upd_form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/countries/countries_update',
			utilities2.make_params({data : this.upd_form.get("value")})).
			then(this._upd_call_back);
	}
});
});