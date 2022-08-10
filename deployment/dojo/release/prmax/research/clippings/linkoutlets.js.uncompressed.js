require({cache:{
'url:research/clippings/templates/linkoutlets.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"fa fa-filter fa-3x\",label:\"Filter\",showLabel:false'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td>Source</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_source\" data-dojo-props='name:\"source\",searchAttr:\"name\",labelType:\"html\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Link Code</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_linktext\" data-dojo-props='name:\"linktext\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Link Description</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_linkdescription\" data-dojo-props='name:\"linkdescription\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>URL</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_url\" data-dojo-props='name:\"url\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Not Linked Only</td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"not_linked\" data-dojo-props='name:\"not_linked\",type:\"checkbox\",checked:true' ></td> </tr>\r\n\t\t\t\t\t\t<tr><td>Hide Ignore</td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"hide_ignore\" data-dojo-props='name:\"hide_ignore\",type:\"checkbox\",checked:true' ></td> </tr>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"bottom\",splitter:true,style:\"height:50%;width:100%;\"' data-dojo-attach-point=\"edit_view\" >\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"blank_view\"></div>\r\n\t\t<div data-dojo-type=\"research/clippings/ipcb_outlets\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"ipbc_outlet_link\"></div>\r\n\t\t<div data-dojo-type=\"research/clippings/mbrain_outlets\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"mbrain_outlet_link\"></div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ipbc_outlets.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/clippings/linkoutlets", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/linkoutlets.html",
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
	"dijit/form/FilteringSelect",
	"research/clippings/ipcb_outlets",
	"research/clippings/mbrain_outlets"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, request, utilities2, json, lang ){
return declare("research.clippings.linkoutlets",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/clippings/list_link', idProperty:"outletexternallinkid"}));
		this._clippingsources = new dojo.data.ItemFileReadStore( {url:"/common/lookups?searchtype=clippingsource&nofilter=1" });
		this._show_basic_edit_call_back = lang.hitch(this,this._show_basic_edit_call);
	},
	postCreate:function()
	{
		this.filter_source.set('store', this._clippingsources);
		var cells =
		[
			{label:' ', field:'outletexternallinkid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Link Code',className: "dgrid-column-address-short",field:'linktext'},
			{label: 'Link Name',className: "dgrid-column-address-short",field:'linkdescription'},
			{label: 'Prmax OutletId',className: "dgrid-column-status-small",field:'outletid'},
			{label: 'Prmax Outlet',className: "dgrid-column-address-short",field:'outletname'},
			{label: 'Source',className: "dgrid-column-status-small",field:'clipsource'},
			{label: 'Url',className: "dgrid-column-address-short",field:'url'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{not_linked:true,hide_ignore:true},
			sort: [{ attribute: "linktext", descending: false }]
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
	_on_cell_call:function(e)
	{
		var cell = this.grid.cell(e);

		if (cell && cell.row)
		{

			if ( cell.column.id == "6")
			{
				if ( cell.row.data.url.length > 0)
				{
					var win = window.open(cell.row.data.url, '_blank');
					win.focus();
				}
			}
			else
			{
				switch(cell.row.data.linktypeid)
				{
				case "6":
				case 6:
				case "7":
				case 7:
					this.mbrain_outlet_link.load(cell.row.data.outletexternallinkid,this._show_basic_edit_call_back);
					break;
				default:
					this.ipbc_outlet_link.load(cell.row.data.outletexternallinkid,this._show_basic_edit_call_back);
					break;
				}
			}
		}
	},
	_clear_filter:function()
	{
		this.filter_linktext.set("value","");
		this.filter_linkdescription.set("value","");
		this.filter_url.set("value","");
		this.not_linked.set("checked",true);
		this.hide_ignore.set("checked",true);
		this.filter_source.set("value",-1);
	},
	_execute:function()
	{
		var query = {sourcetypeid:this._sourcetypeid};

		if ( this.not_linked.get("checked"))
			query["not_linked"] = true;

		if (this.hide_ignore.get("checked"))
			query["hide_ignore"] = true;

		if ( this.filter_linktext.get("value"))
			query["linktext"] = this.filter_linktext.get("value");

		if ( this.filter_linkdescription.get("value"))
			query["linkdescription"] = this.filter_linkdescription.get("value");

		if ( this.filter_url.get("value"))
			query["linkurl"] = this.filter_url.get("value");

		if ( this.filter_source.get("value"))
			query["clipsource"] = this.filter_source.get("value");

		this.grid.set("query",query);
		this._clear();
	},
	_clear:function()
	{
		this.edit_view.selectChild(this.blank_view);
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
				case "ipcb_outlets":
					this.edit_view.selectChild(this.ipbc_outlet_link);
					break;
				case "mbrain_outlets":
					this.edit_view.selectChild(this.mbrain_outlet_link);
					break;
			}
		}
	}
});
});
