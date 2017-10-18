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
		topic.subscribe("/clipping/refresh_filters", lang.hitch(this, this._refresh_filters));

		this.dirty_filters = false;
		this._update_event = null;
		this._close_event= lang.hitch(this,this._close);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.date_search.set_range_to_last_30_days();
		this.clientid.set("store", PRCOMMON.data.clients);
		this.issueid.set("store", PRCOMMON.data.issues);
		this.emailtemplateid.set("store", PRCOMMON.data.email_templates);
		this.emailtemplateid.set("query", {restrict:"sent",include_no_select:1});
		this.statementid.set("store", PRCOMMON.data.statements);

		this.clippingstypeid.set("store", PRCOMMON.data._clippingtypes);
		this.clippingstypeid.set("value", -1);

		domattr.set(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);
		if ( this.showextended == true)
		{
			domclass.remove(this.clippingstype_label,"prmaxhidden");
			domclass.remove(this.clippingstype_label_2,"prmaxhidden");
			domclass.remove(this.clippingstypeid.domNode,"prmaxhidden");
		}

		if (PRMAX.utils.settings.crm == true )
		{
			domclass.remove(this.statement_view_1,"prmaxhidden");
			domclass.remove(this.statement_view_2,"prmaxhidden");
			domclass.remove(this.statementid.domNode,"prmaxhidden");
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

		setTimeout(this._close_event,300);
		this._set_filter_text();

		this.dirty_filters = true;
		if (this._update_event != null)
			this._update_event();

		this.updbtn.cancel();
	},
	_close:function()
	{
		this.filter_dlg.hide();
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
		this.emailtemplateid.set("value", value.emailtemplateid);
		this.statementid.set("value", value.statementid);

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

		var emailtemplatevalue = this.emailtemplateid.get("value");
		if (emailtemplatevalue=="")
			emailtemplatevalue = "-1";

		if (active_only == true && emailtemplatevalue != "-1")
			filter.emailtemplateid = emailtemplatevalue;
		else if ( active_only == false )
			filter.emailtemplateid = emailtemplatevalue;

		var statementvalue = this.statementid.get("value");
		if (statementvalue=="")
			statementvalue = "-1";

		if (active_only == true && statementvalue != "-1")
			filter.statementid = statementvalue;
		else if ( active_only == false )
			filter.statementid = statementvalue;

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
		if (PRCOMMON.data.email_templates==undefined)
			PRCOMMON.data.email_templates = new JsonRestStore({target:"/emails/templates_list_rest", idAttribute:"id"});
		if (PRCOMMON.data.statements==undefined)
			PRCOMMON.data.statements = new JsonRestStore({target:"/statement/statement_combo_rest", idAttribute:"id"});
		if (PRCOMMON.data._clippingtypes==undefined)
			PRCOMMON.data._clippingtypes = new ItemFileReadStore({ url:"/common/lookups?searchtype=clippingstypes&show_all=0"});

	},
	_show_extended:function()
	{
		this.filter_dlg.show();
	},
	_set_filter_text:function()
	{
		this.filter_text = "";

		this._add_to_filter(this.clientid, PRMAX.utils.settings.client_name);
		this._add_to_filter(this.issueid, PRMAX.utils.settings.issue_description);
		if (PRMAX.utils.settings.crm == true )
			this._add_to_filter(this.statementid, "Statement");
		this._add_to_filter(this.emailtemplateid, "Release");
		if ( this.showextended == true)
			this._add_to_filter(this.clippingstypeid, "Type");
		this._add_to_filter(this.tone_ctrl, "Tones");


		this._add_to_filter_text(this.date_search.get("FilterText"),"Dates");
		//tones

		if (this.filter_text.length==0)
			this.filter_text = "No Filter Selected";

		domattr.set(this.filter_details, "innerHTML", this.filter_text);
	},
	_add_to_filter:function(lookuplist, caption_text)
	{
		var tmp = lookuplist.get("displayedValue");
		if ( tmp != "No Selection" && tmp != "" && tmp != "All Types")
		{
			if (this.filter_text.length>0)
				this.filter_text += " ; ";
			this.filter_text += this._get_caption_formatted(caption_text) + tmp ;
		}
	},
	_add_to_filter_text:function(valuetext, caption_text)
	{
		if ( valuetext != "" )
		{
			if (this.filter_text.length>0)
				this.filter_text += " ; ";
			this.filter_text += this._get_caption_formatted(caption_text) + valuetext ;
		}
	},
	_get_caption_formatted:function(caption_text)
	{
		return "<label style='font-weight:900'>" + caption_text + "</label>" + " : ";
	}
});
});
