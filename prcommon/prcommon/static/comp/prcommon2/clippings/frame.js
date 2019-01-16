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
	"prcommon2/clippings/optionsviewer",
	"prcommon2/clippings/dashboard",
	"prcommon2/clippings/dashboardsettings",
	"prcommon2/clippings/emails",
	"prcommon2/clippings/add_server",
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
	back_colour:"black",
	back_panel_colour:"black",
	fore_color:"lightblue",
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
		domclass.remove(this.emailsbtn.domNode,"prmaxhidden");
		this._change_view_event("clippings_view");
	},
	_summary_btn_event:function()
	{
		domclass.add(this.emailsbtn.domNode,"prmaxhidden");
		this._show_hide_details(this.piechart);
	},
	_time_btn_event:function()
	{
		domclass.add(this.emailsbtn.domNode,"prmaxhidden");
		this._show_hide_details(this.lineschart);
	},
	_refesh_chart_event:function()
	{
		if ( this._active_page )
			this._active_page.refesh_view();
	},
	_add_btn_event:function()
	{
		domclass.add(this.emailsbtn.domNode,"prmaxhidden");
		this.add_private.clear();
		this.controls.selectChild(this.add_private);
		this._active_page = null;
	},
	_email_btn_event:function()
	{
		this.emails_ctrl.load(this.email_dlg);
		this.email_dlg.show();
	},
	_change_view_event:function(move_to_view)
	{
		switch (move_to_view)
		{
			case "clippings_view":
				domclass.remove(this.emailsbtn.domNode,"prmaxhidden");
				this._show_hide_details(this.clippings_view);
				break;
			case "linechart":
				domclass.add(this.emailsbtn.domNode,"prmaxhidden");
				this._show_hide_details(this.lineschart);
				break;
			case "newclipping":
				domclass.add(this.emailsbtn.domNode,"prmaxhidden");
				this._add_btn_event();
				break;
		}
	},
	_options_btn_event:function()
	{
		domclass.add(this.emailsbtn.domNode,"prmaxhidden");
		this.controls.selectChild(this.options_view);
		this._active_page = null;
	},
	_dashboard_btn_event:function()
	{
		domclass.add(this.emailsbtn.domNode,"prmaxhidden");
		this.controls.selectChild(this.dashboard_view);
		this.dashboard_view.load(PRMAX.utils.settings.cid);
		this._active_page = null;
	},
	_dashboardsettings_btn_event:function()
	{
		domclass.add(this.emailsbtn.domNode,"prmaxhidden");
		this.controls.selectChild(this.dashboardsettings_view);
		this.dashboardsettings_view.load(PRMAX.utils.settings.cid,1);
		this._active_page = null;
	}
});
});
