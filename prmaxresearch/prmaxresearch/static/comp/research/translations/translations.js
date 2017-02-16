//-----------------------------------------------------------------------------
// Name:    translation.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../translations/templates/translations.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Cache",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"research/translations/basicedit",
	"research/translations/translatelanguage",
	"research/translations/translatecountry",
	"research/translations/translateinterests",
	"research/translations/translationcirculationsource",
	"research/translations/translatefrequency",
	"research/translations/translatejobrole",
	"research/translations/translatemediatype",
	"research/translations/translateclassification",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, request, utilities2, json, lang ){
return declare("research.translations.translations",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._source_call_back = lang.hitch(this,this._source_call);
		this._show_basic_edit_call_back = lang.hitch(this,this._show_basic_edit_call);
		this._on_cell_call = lang.hitch(this, this._on_cell);
		this._sourcetypeid = null;
		this._store = new Observable( new JsonRest( {target:'/research/international/translation/list', idProperty:"datasourcetranslationid"}));
	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'datasourcetranslationid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Type',className: "standard",field:'fieldname'},
			{label: 'Source',className: "standard",field:'sourcetext'},
			{label: 'English',className: "standard",field:'english'},
			{label: 'Translation',className: "standard",field:'translation'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query: utilities2.EMPTYGRID,
			sort: [{ attribute: "fieldname", descending: false }]
		})

		this.grid.on(".dgrid-row:click", lang.hitch(this,this._on_cell_call));

		this.inherited(arguments);

	},
	startup:function()
	{
		this.inherited(arguments);
		// because of the way this widget is created and displayed it doens't
		// render correcly first time so we need to do it on start up
		this.grid_view.set("content", this.grid);

	},
	_on_cell:function(e)
	{
		var cell = this.grid.cell(e);

		console.log(cell.row.data);

		switch (cell.row.data.fieldname)
		{
			case "language":
				this.language_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			case "country":
				this.country_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			case "interest-words":
				this.interests_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			case "circulation-source":
				this.circulationsource_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			case "frequency-type":
				this.frequency_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			case "jobtitle-areainterest":
				this.jobrole_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			case "classification":
				this.classification_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
			default:
				this.basic_edit.load(cell.row.data.datasourcetranslationid,this._show_basic_edit_call_back);
				break;
		}
	},
	_show_basic_edit_call:function( source, data )
	{
		if ( data )
		{
			this._store.put( data );
			this.edit_view.selectChild(this.blank_view);
		}
		else
		{
			switch(source)
			{
			case "language":
				this.edit_view.selectChild(this.language_edit);
				break;
			case "country":
				this.edit_view.selectChild(this.country_edit);
				break;
			case "classification":
				this.edit_view.selectChild(this.classification_edit);
				break;
			case "circulation-source":
				this.edit_view.selectChild(this.circulationsource_edit);
				break;
			case "frequency":
				this.edit_view.selectChild(this.frequency_edit);
				break;
			case "jobroles":
				this.edit_view.selectChild(this.jobrole_edit);
				break;
			case "mediatype":
				this.edit_view.selectChild(this.mediatype_edit);
				break;
			default:
				this.edit_view.selectChild(this.basic_edit);
				break;
			}
		}
	},
	_clear_filter:function()
	{
		this.filter_sourcetext.set("value","");
		this.filter_sourcefield.set("value",null);
	},
	_execute:function()
	{
		var query = {sourcetypeid:this._sourcetypeid};

		if ( this.not_translated.get("checked"))
			query["not_translated"] = true;

		if ( this.filter_sourcefield.get("value"))
			query["sourcefield"] = this.filter_sourcefield.get("value");

		if ( this.filter_sourcetext.get("value"))
			query["sourcetext"] = this.filter_sourcetext.get("value");


		this.grid.set("query",query);
		this._clear();
	},
	_clear:function()
	{
		this.edit_view.selectChild(this.blank_view);
	},
	_do_show_translations:function()
	{
		this._sourcetypeid = 6;
		if (this.source_stamm.get("checked"))
			this._sourcetypeid = 5;
		if (this.source_cyberwatch.get("checked"))
			this._sourcetypeid = 8;
		if (this.source_madaptive.get("checked"))
			this._sourcetypeid = 10;

		request.post('/research/international/translation/get_for_source',
			utilities2.make_params({ data: {sourcetypeid:this._sourcetypeid}} )).then
			(this._source_call_back);
	},
	_source_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.grid.set("query",{sourcetypeid: this._sourcetypeid});

			this.filter_sourcefield.set("store",new Memory({data: response.data}));

			this.main_view.selectChild(this.trans_view);
		}
	}
});
});
