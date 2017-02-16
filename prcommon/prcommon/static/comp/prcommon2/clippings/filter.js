define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/filter.html",
	"dijit/layout/ContentPane",
	"dojox/data/JsonRestStore",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Select",
	"dojox/form/BusyButton",
	"dijit/form/CheckBox",
	"dijit/form/FilteringSelect",
	"prcommon2/date/daterange",
	"prcommon2/clippings/selecttone"
	], function(declare, BaseWidgetAMD, template, ContentPane,JsonRestStore,topic,domattr,lang,domclass,ItemFileReadStore){
 return declare("prcommon2.clippings.filter",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	showextended:false,
	constructor: function()
	{
		this.start_settings();
		this._clippingtypes = new ItemFileReadStore({ url:"/common/lookups?searchtype=clippingstypes&show_all=0"});
		topic.subscribe("/clipping/refresh_filters", lang.hitch(this, this._refresh_filters));

		this.dirty_filters = false;
		this._update_event = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.date_search.set_range_to_last_30_days();
		this.clientid.set("store", PRCOMMON.data.clients);
		this.issueid.set("store", PRCOMMON.data.issues);
		this.clippingstypeid.set("store",this._clippingtypes);
		this.clippingstypeid.set("value", -1);

		domattr.set(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);
		if ( this.showextended == true)
		{
			domclass.remove(this.clippingstype_label,"prmaxhidden");
			domclass.remove(this.clippingstypeid.domNode,"prmaxhidden");
		}
	},
	_setUpdateeventAttr:function(updevent)
	{
		this._update_event = updevent;
	},
	_update:function()
	{
		if (this.tone_ctrl.isValid()==false)
		{
			alert(this.tone_ctrl.invalidMessage);
			this.updbtn.cancel();
			return ;
		}

		this.dirty_filters = true;
		if (this._update_event != null)
			this._update_event();

		this.updbtn.cancel();
	},
	_change_filter:function()
	{
		var clientid = this.clientid.get("value");
		if (clientid == undefined)
			clientid = -1;

		this.issueid.set("query",{
			clientid: clientid
		});

		this.issueid.set("value",null);
	},
	_getFilterAttr:function()
	{
		return this._get_filters(false);
	},
	_getFilterlimitedAttr:function()
	{
		return this._get_filters(true);
	},
	_setNewsettingsAttr:function(value)
	{
		this.clientid.set("value", value.clientid);
		this.issueid.set("value", value.issueid);
		this.clippingstypeid.set("value", value.clippingstypeid);
		this.tone_ctrl.set("value", value.tones);
		if (value.daterestriction)
		{
			this.date_search.from_date_box.set("value", value.daterestriction);
			this.date_search.to_date_box.set("value", value.daterestriction);
		}
		else
		{
			this.date_search.set("intvalue",value.int_drange);

		}
	},
	_get_filters:function(active_only,is_internal)
	{
		var filter = {
			daterange : this.date_search.get("value"),
			drange : this.date_search.get("value"),
			tones : this.tone_ctrl.get("value"),
		};

		var clientvalue = this.clientid.get("value");
		if (clientvalue=="")
			clientvalue = "-1";

		if (active_only == true && clientvalue != "-1")
			filter.clientid = clientvalue;
		else if ( active_only == false )
			filter.clientid = clientvalue;

		var issuevalue = this.issueid.get("value");
		if (issuevalue=="")
			issuevalue = "-1";

		if (active_only == true && issuevalue != "-1")
			filter.issueid = issuevalue;
		else if ( active_only == false )
			filter.issueid = issuevalue;

		if (this.showextended==true)
		{
			var ctypevalue = this.clippingstypeid.get("value");

			if (active_only == true && ctypevalue != "-1")
				filter.clippingstypeid = ctypevalue;
			else if ( active_only == false )
				filter.clippingstypeid = ctypevalue;
		}
		if (is_internal == true )
		{
			filter.int_drange = this.date_search.get_physical_values();
		}

		return filter;
	},
	update_complete:function()
	{
		this.updbtn.cancel();
	},
	_swap_view:function()
	{
		this.clippingstypeid.get("value");
	},
	_refresh_filters:function(filter)
	{
		if (filter.dirty)
		{
			this.clippingstypeid.set("value", filter.clippingstypeid);
		}
	},
	start_settings:function()
	{
		if (PRCOMMON.data.clients==undefined)
			PRCOMMON.data.clients = new JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		if (PRCOMMON.data.issues==undefined)
			PRCOMMON.data.issues = new JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
	}
});
});
