require({cache:{
'url:prcommon2/clippings/templates/filter.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:hidden;background-color:black;color:white\"' class=\"std_menu_view\" >\r\n\t\t<button data-dojo-attach-event=\"onClick:_show_extended\" data-dojo-attach-point=\"showextbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:left;margin:0px;padding:0px\",type:\"button\",label:\"Filter\",iconClass:\"fa fa-filter fa-3x\"'></button>\r\n\t\t<p style=\"border:1px solid green;float:left\" data-dojo-attach-point=\"filter_details\">No Filter Selected</p>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"filter_dlg\" data-dojo-type=\"dijit/Dialog\" title='<i class=\"fa fa-filter\" aria-hidden=\"true\"></i> Filter' data-dojo-props='style:\"width:450px;height:320px\"'>\r\n\t\t<span class=\"common_prmax_layout\">\r\n\t\t\t<label data-dojo-attach-point=\"client_label_1\" class=\"label_1\"></label><select data-dojo-props='placeHolder:\"No Selection\",autoComplete:true,searchAttr:\"clientname\",labelType:\"html\",style:\"width:8em\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"clientid\" data-dojo-attach-event=\"onChange:_change_filter\"></select></br>\r\n\t\t\t<label data-dojo-attach-point=\"issue_label_1\" class=\"label_1\"></label><select data-dojo-props='placeHolder:\"No Selection\",name:\"issueid\",autoComplete:true,searchAttr:\"name\",required:false,invalidMessage:\"Select\",labelType:\"html\",style:\"width:8em\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"issueid\"></select></br>\r\n\t\t\t<label class=\"label_1\">Dates</label><div data-dojo-type=\"prcommon2/date/daterange\" data-dojo-attach-point=\"date_search\"></div></br>\r\n\t\t\t<label class=\"label_1\">Tone</label><div style=\"position:relative;top:2px;height:30px\"><div data-dojo-type=\"prcommon2/clippings/selecttone\" data-dojo-attach-point=\"tone_ctrl\"></div></div><br/>\r\n\t\t\t<label class=\"label_1\">Text</label><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"textid\" data-dojo-props='placeHolder:\"Search text\",required:false,name:\"textid\",trim:true,type:\"text\",style:\"width:20em\"'><br/>\r\n\t\t\t<label data-dojo-attach-point=\"clippingstype_label\" class=\"label_1 prmaxhidden\">Types</label><select data-dojo-props='name:\"clippingstypeid\",autoComplete:true,labelType:\"html\",style:\"width:10em;color:black\",value:-1, class:\"prmaxhidden\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"clippingstypeid\" data-dojo-attach-event=\"onChange:_swap_view\"></select><br data-dojo-attach-point=\"clippingstype_label_2\" class=\"prmaxhidden\"/>\r\n\t\t\t<label class=\"label_1\">Release</label><select data-dojo-props='placeHolder:\"No Selection\",name:\"emailtemplateid\",autoComplete:true,searchAttr:\"emailtemplatename\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"emailtemplateid\" ></select><br/>\r\n\t\t\t<label data-dojo-attach-point=\"statement_view_1\" class=\"label_1 prmaxhidden\">Statement</label><select data-dojo-props='placeHolder:\"No Selection\",name:\"statementid\",autoComplete:true,searchAttr:\"statementdescription\",labelType:\"html\",\"class\":\"prmaxhidden\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"statementid\" ></select><br data-dojo-attach-point=\"statement_view_2\" class=\"prmaxhidden\"/>\r\n\t\t\t<button data-dojo-attach-point=\"clearbtn\" data-dojo-attach-event=\"onClick:_clear\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:left;padding:0px;margin:0px\",type:\"button\",label:\"Clear\",\"class\":\"dijitReset\"'></button>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_update\" data-dojo-attach-point=\"updbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",busyLabel:\"Please Wait Refreshing ...\",label:\"Refresh\"'></button>\r\n\t\t\t<br/><br/><br/><br/><br/>\r\n\t\t</span>\r\n\t\t<br/><br/><br/><br/>\r\n\t</div>\r\n</div>\r\n"}});
define("prcommon2/clippings/filter", [
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
		this._set_filter_text();
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
		this.textid.set("value", value.textid);

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

		if (active_only == true && this.textid.get("value").length>0)
		{
			filter.textid = this.textid.get("value")
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

		this._add_to_filter_text(this.textid.get("value"),"Clip Text")
		this._add_to_filter_text(this.date_search.get("FilterText"),"Dates");
		//tones

		if (this.filter_text.length==0)
			this.filter_text = "No Filter Selected";

		domattr.set(this.filter_details, "innerHTML", this.filter_text);
	},
	_add_to_filter:function(lookuplist, caption_text)
	{
		var tmp = lookuplist.get("displayedValue");
		if ( tmp != "No Selection" && tmp != "" && tmp != "All Types" && tmp != null)
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
	},
	_clear:function()
	{
			this.clientid.set("value",null);
			this.issueid.set("value",null);
			this.date_search.clear();
			this.tone_ctrl.clear();
			this.textid.set("value","");
			this.clippingstypeid.set("value",-1);
			this.emailtemplateid.set("value",null);
			this.statementid.set("value",null)

	}
});
});
