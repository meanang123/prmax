require({cache:{
'url:research/translations/templates/translations.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"center\",splitter:true' data-dojo-attach-point=\"main_view\" >\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%;\"' data-dojo-attach-point=\"supplier_view\">\r\n\t\t\t<p>Select Data Supplier Source </p>\r\n\t\t\t<br/>\r\n\t\t\t<label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"source_stamm\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='\"class\":\"prmaxdefault\",checked:\"checked\",type:\"radio\",value:\"5\"'/>Stamm</label><br/>\r\n\t\t\t<label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"source_nijgh\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"radio\",value:\"6\"'/>Nijgh Periodieken</label><br/>\r\n\t\t\t<label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"source_cyberwatch\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"radio\",value:\"8\"'/>Cyberwatch</label><br/>\r\n\t\t\t<label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"source_madaptive\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"radio\",value:\"8\"'/>Madaptive</label><br/>\r\n\t\t\t<br/>\r\n\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:left\",type:\"button\",label:\"Display Translations\"' data-dojo-attach-event=\"onClick:_do_show_translations\"></button>\r\n\t\t\t<br/>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:100%;\",gutters:false' data-dojo-attach-point=\"trans_view\" >\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"fa fa-filter fa-3x\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t\t\t<table>\r\n\t\t\t\t\t\t\t\t<tr><td>Source Text</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_sourcetext\" data-dojo-props='name:\"sourcetext\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td>Not Translated Only</td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"not_translated\" data-dojo-props='name:\"not_translated\",type:\"checkbox\",checked:true' ></td> </tr>\r\n\t\t\t\t\t\t\t\t<tr><td>Source Field</td><td ><select data-dojo-attach-point=\"filter_sourcefield\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"sourcefield\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",required:false,placeHolider:\"No Selection\"'/></td></tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"bottom\",splitter:true,style:\"height:50%;width:100%;\"' data-dojo-attach-point=\"edit_view\" >\r\n\t\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"blank_view\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/basicedit\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"basic_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translatelanguage\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"language_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translatecountry\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"country_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translateinterests\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"interests_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translationcirculationsource\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"circulationsource_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translatefrequency\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"frequency_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translatejobrole\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"jobrole_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translatemediatype\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"mediatype_edit\"></div>\r\n\t\t\t\t<div data-dojo-type=\"research/translations/translateclassification\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"classification_edit\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
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
define("research/translations/translations", [
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
