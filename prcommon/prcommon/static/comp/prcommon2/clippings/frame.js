define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/frame.html",
	"dijit/layout/BorderContainer",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojox/data/JsonRestStore",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/Toolbar",
	"dijit/form/Button",
	"prcommon2/clippings/charts/piechart",
	"prcommon2/clippings/charts/lineschart",
	"prcommon2/clippings/filter",
	"prcommon2/clippings/detailedviewer",
	"prcommon2/clippings/edit_private",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, BorderContainer, domgeom, lang, JsonRest, Observable, Grid, utilities2, topic, request, domattr,domclass){
 return declare("prcommon2.clippings.frame",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	as_frame:0,
	constructor: function()
	{
		this._active_page=null;

		topic.subscribe("/clipping/change_view", lang.hitch(this, this._change_view_event));

	},
	postCreate:function()
	{
		if (this.as_frame==1)
		{
			domclass.add(this.logo_view,"prmaxhidden");
		}

		this.inherited(arguments);

		this._active_page = this.lineschart;

		this.inherited(arguments);

	},
	_show_hide_details:function(newpage)
	{
		this.controls.selectChild(newpage);
		this._active_page = newpage;
	},
	_details_btn_event:function()
	{
		this._change_view_event("clippings_view");
	},
	_summary_btn_event:function()
	{
		this._show_hide_details(this.piechart);
	},
	_time_btn_event:function()
	{
		this._show_hide_details(this.lineschart);
	},
	_refesh_chart_event:function()
	{
		if ( this._active_page )
			this._active_page.refesh_view();
	},
	_add_btn_event:function()
	{
		this.add_private.clear();
		this.controls.selectChild(this.add_private);
		this._active_page = null;
	},
	_change_view_event:function(move_to_view)
	{
		switch (move_to_view)
		{
			case "clippings_view":
				this._show_hide_details(this.clippings_view);
				break;
			case "linechart":
				this._show_hide_details(this.lineschart);
				break;
			case "newclipping":
			this._add_btn_event();
				break;

		}
	}
});
});
