//-----------------------------------------------------------------------------
// Name:    prcommon2/clippings/windowsettings
// Author:
// Purpose:
// Created: January 2018
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/windowsettings.html",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/data/ItemFileWriteStore",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dijit/form/Select",
	"dojox/validate/regexp",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/date/daterange",
	"dijit/form/ComboBox"
	], function(declare,BaseWidgetAMD,template,ContentPane,BorderContainer,utilities2,topic,request,JsonRestStore,JsonRest,Observable,lang,domattr,ItemFileReadStore,ItemFileWriteStore,domclass,domConstruct){
return declare("prcommon2.clippings.windowsettings",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._updatesettings_call_back = lang.hitch(this, this._updatesettings_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._questions = new JsonRestStore ({target:'/clippings/analyse/get_global_list', idAttribute:'id'});
		this._clients = new JsonRestStore({target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._chartview =  new ItemFileReadStore({url:"/common/lookups?searchtype=chartview"});
		this._dateranges =  new ItemFileReadStore({url:"/common/lookups?searchtype=dateranges"});
		this._groupby =  new ItemFileWriteStore({
			url:"/common/lookups?searchtype=groupby",
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
		});
		this._dashboardsettingsmode =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=dashboardsettingsmode"});
		this._dashboardsettingsstandard =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=dashboardsettingsstandard"});
//		this._dashboardsettingsstandardsearchby =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=dashboardsettingsstandardsearchby"});
		this._dashboardsettingsstandardsearchby =  new ItemFileWriteStore({
			url:"/common/lookups?searchtype=dashboardsettingsstandardsearchby",
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
		});

		this._change_client_enabled=true;
		this._windowid = null;
		this._customerid = PRMAX.utils.settings.cid;

	},
	postCreate:function()
	{
		this.chartviewid.set("store",this._chartview);
		this.daterangeid.set("store", this._dateranges);
		this.groupbyid.set("store", this._groupby);
		this.dashboardsettingsmodeid.set("store", this._dashboardsettingsmode);
		this.dashboardsettingsstandardid.set("store", this._dashboardsettingsstandard);
		this.dashboardsettingsstandardsearchbyid.set("store", this._dashboardsettingsstandardsearchby);
		this.questionid.set("store", this._questions);
		this.clientid.set("store",this._clients);
		this.issueid.set("store", this._issues);

		domattr.set(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);

		this.chartviewid.set("value", 1);
		this.daterangeid.set("value", 1);
		this.groupbyid.set("value", 1);
		this.dashboardsettingsmodeid.set("value", 1);
		this.dashboardsettingsstandardid.set("value", 1);
		this.dashboardsettingsstandardsearchbyid.set("value", 1);
		this.clientid.set("value", null );
		this.issueid.set("value", null );

		this.inherited(arguments);
	},
	load:function(dialog, windowid, customerid)
	{
		this._clear();
		this._dialog = dialog;	
		this._windowid = windowid;
		this._customerid = customerid;
		
		this._dashboardsettingsstandardsearchby.deleteItem(this._dashboardsettingsstandardsearchby._itemsByIdentity[2]);
		this._dashboardsettingsstandardsearchby.deleteItem(this._dashboardsettingsstandardsearchby._itemsByIdentity[3]);

		request.post('/clippings/dashboardsettings/get_for_edit',
				utilities2.make_params({ data : {customerid:this._customerid, windowid:this._windowid}})).
				then (this._load_call_back);		
	},
	_load_call:function(response)
	{
		if ( response.success == "OK")
		{
			if (response.data != null)
			{
				this.dashboardsettingsmodeid.set("value", response.data.dashboardsettingsmodeid);
				if (response.data.dashboardsettingsmodeid == 1)
				{
					domclass.add(this.questionlabel, "prmaxhidden");
					domclass.add(this.questionid.domNode, "prmaxhidden");
					domclass.remove(this.dashboardsettingsstandardlabel, "prmaxhidden");
					domclass.remove(this.dashboardsettingsstandardid.domNode, "prmaxhidden");
					domclass.remove(this.dashboardsettingsstandardsearchbylabel, "prmaxhidden");
					domclass.remove(this.dashboardsettingsstandardsearchbyid.domNode, "prmaxhidden");
				}
				else if (response.data.dashboardsettingsmodeid == 2)
				{
					domclass.add(this.dashboardsettingsstandardlabel, "prmaxhidden");
					domclass.add(this.dashboardsettingsstandardid.domNode, "prmaxhidden");
					domclass.add(this.dashboardsettingsstandardsearchbylabel, "prmaxhidden");
					domclass.add(this.dashboardsettingsstandardsearchbyid.domNode, "prmaxhidden");
					domclass.remove(this.questionlabel, "prmaxhidden");
					domclass.remove(this.questionid.domNode, "prmaxhidden");
				}
				this.dashboardsettingsstandardid.set("value", response.data.dashboardsettingsstandardid);
				this.dashboardsettingsstandardsearchbyid.set("value", response.data.dashboardsettingsstandardsearchbyid);
				this.questionid.set("value", response.data.questionid);
	
				this._change_client_enabled = false;
				this.by_client.set("value", response.data.by_client);
				if (response.data.by_client == true)
				{
					domclass.remove(this.client_label_1, "prmaxhidden");
					domclass.remove(this.clientid.domNode, "prmaxhidden");
				}
				else
				{
					domclass.add(this.client_label_1, "prmaxhidden");
					domclass.add(this.clientid.domNode, "prmaxhidden");
				}
				this.clientid.set("value", response.data.clientid);
				this.by_issue.set("value", response.data.by_issue);
				if (response.data.by_issue == true)
				{
					domclass.remove(this.issue_label_1, "prmaxhidden");
					domclass.remove(this.issueid.domNode, "prmaxhidden");
				}
				else
				{
					domclass.add(this.issue_label_1, "prmaxhidden");
					domclass.add(this.issueid.domNode, "prmaxhidden");
				}
				this.issueid.set("value", response.data.issueid);
				this.chartviewid.set("value", response.data.chartviewid);
				if (response.data.chartviewid == 1)
				{
					domclass.add(this.groupby_label, "prmaxhidden");	
					domclass.add(this.groupbyid.domNode, "prmaxhidden");	
				}
				else
				{
					domclass.remove(this.groupby_label, "prmaxhidden");	
					domclass.remove(this.groupbyid.domNode, "prmaxhidden");	
				}
				this.daterangeid.set("value", response.data.daterangeid);
				this.groupbyid.set("value", response.data.groupbyid);
			}
		}
		else
		{
			alert("Problem");
		}
	},
	_clear:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.dashboardsettingsmodeid.set("value", 1);
		this.dashboardsettingsstandardid.set("value", null);
		this.dashboardsettingsstandardsearchbyid.set("value", null);

		this.questionid.set("value", null);
		this.chartviewid.set("value", 1);
		this.daterangeid.set("value", 1);
		this.groupbyid.set("value", 1);
		domclass.add(this.groupby_label, "prmaxhidden");
		domclass.add(this.groupbyid.domNode, "prmaxhidden");
		this.by_client.set("checked", false);
		this.by_issue.set("checked", false);
		domclass.add(this.client_label_1, "prmaxhidden");
		domclass.add(this.clientid.domNode, "prmaxhidden");
		domclass.add(this.issue_label_1, "prmaxhidden");
		domclass.add(this.issueid.domNode, "prmaxhidden");
		this._change_client_enabled = false;
		this.clientid.set("value", null );
		this.issueid.set("value", null );
		this._change_client_enabled = true;
		this.savesettingsbtn.cancel();
	},
	_client_change:function()
	{
		var clientid = this.clientid.get("value");
		if (clientid == undefined)
			clientid = -1;

		this.issueid.set("query",{ clientid: clientid});
		if (this._change_client_enabled==true)
		{
			this.issueid.set("value",null);
		}
		this._change_client_enabled = true ;
	},
	_save_settings:function()
	{
		if (utilities2.form_validator(this.formnode) == false)
		{
			alert("Please Enter Details");
			this.savesettingsbtn.cancel();
			return false;
		}
		var content = this.formnode.get("value");
		content["windowid"] = this._windowid;
		content["dashboardsettingsstandardid"] = null;
		content["dashboardsettingsstandardsearchbyid"] = null;
		content["questionid"] = null;
		content['clientid'] = null;
		content['issueid'] = null;
		content['by_client'] = false;
		content['by_issue'] = false;
		content['customerid'] = this._customerid;
		
		content["dashboardsettingsmodeid"] = this.dashboardsettingsmodeid.get("value");
		if (this.dashboardsettingsmodeid == 1)
		{
			if (this.dashboardsettingsstandardid.get("value") == "") this.dashboardsettingsstandardid.set("value") = 1;
			if (this.dashboardsettingsstandardsearchbyid.get("value") == "") this.dashboardsettingsstandardsearchbyid.set("value") = 1;
			content['dashboardsettingsstandardid'] = this.dashboardsettingsstandardid.get("value");
			content['dashboardsettingsstandardsearchbyid'] = this.dashboardsettingsstandardsearchbyid.get("value");
			if (this.by_client.checked && (this.clientid.get("value") == -1 || this.clientid.get("value") == null || this.clientid.get("value") == ''))
			{
				alert("Please Select a Client");
				this.savesettingsbtn.cancel();
				return false;			
			}
			if (this.by_issue.checked && (this.issueid.get("value") == -1 || this.issueid.get("value") == null || this.issueid.get("value") == ''))
			{
				alert("Please Select an Issue");
				this.savesettingsbtn.cancel();
				return false;			
			}
		}
		else if (this.dashboardsettingsmodeid == 2)
		{
			content["questionid"] = this.questionid.get("value");
			content["questiontypeid"] = this.questionid.item.typeid;
		}
			
		if (this.by_client.checked)
		{
			content['by_client'] = true;
			content['clientid'] = this.clientid.get("value");
		}
		if (this.by_issue.checked)
		{
			content['by_issue'] = true;
			content['issueid'] = this.issueid.get("value");
		}
		content["chartviewid"] = this.chartviewid.get("value");
		content["daterangeid"] = this.daterangeid.get("value");
		content["groupbyid"] = this.groupbyid.get("value");
		this.savesettingsbtn.makeBusy();

		request.post('/clippings/dashboardsettings/dashboardsettings_update', 
			utilities2.make_params({data : content})).
			then(this._updatesettings_call_back);
	},
	_updatesettings_call:function(response)
	{
		if (response.success == "OK")
		{
			alert("Settings saved");
			this._dialog.hide();
			
			topic.publish('/dashboardsettings/update', [response.data]);
		}
		else
		{
			alert("Problem saving settings");
		}		
		this.savesettingsbtn.cancel();
	},
	_change_mode:function()
	{
		if (this.dashboardsettingsmodeid.get("value") == 1)
		{
			domclass.remove(this.dashboardsettingsstandardlabel, "prmaxhidden");
			domclass.remove(this.dashboardsettingsstandardid.domNode, "prmaxhidden");
			domclass.remove(this.dashboardsettingsstandardsearchbylabel, "prmaxhidden");
			domclass.remove(this.dashboardsettingsstandardsearchbyid.domNode, "prmaxhidden");
			domclass.add(this.questionlabel, "prmaxhidden");
			domclass.add(this.questionid.domNode, "prmaxhidden");
		}
		else 
		{
			domclass.add(this.dashboardsettingsstandardlabel, "prmaxhidden");
			domclass.add(this.dashboardsettingsstandardid.domNode, "prmaxhidden");
			domclass.add(this.dashboardsettingsstandardsearchbylabel, "prmaxhidden");
			domclass.add(this.dashboardsettingsstandardsearchbyid.domNode, "prmaxhidden");
			domclass.remove(this.questionlabel, "prmaxhidden");
			domclass.remove(this.questionid.domNode, "prmaxhidden");
		}
	},
	_by_client:function()
	{
		if (this.by_client.checked)
		{
			domclass.remove(this.client_label_1, "prmaxhidden");
			domclass.remove(this.clientid.domNode, "prmaxhidden");
		}
		else
		{
			domclass.add(this.client_label_1, "prmaxhidden");
			domclass.add(this.clientid.domNode, "prmaxhidden");
		}
	},
	_by_issue:function()
	{
		if (this.by_issue.checked)
		{
			domclass.remove(this.issue_label_1, "prmaxhidden");
			domclass.remove(this.issueid.domNode, "prmaxhidden");
		}
		else
		{
			domclass.add(this.issue_label_1, "prmaxhidden");
			domclass.add(this.issueid.domNode, "prmaxhidden");
		}
	},
	_chartview_change:function()
	{
		if (this.chartviewid.get("value") == 1)
		{
			domclass.add(this.groupby_label, "prmaxhidden");
			domclass.add(this.groupbyid.domNode, "prmaxhidden");
		}
		else
		{
			domclass.remove(this.groupby_label, "prmaxhidden");
			domclass.remove(this.groupbyid.domNode, "prmaxhidden");
		}
	},
	_change_daterange:function()
	{
		if (this.daterangeid.get("value") >= 6 )
		{
			this._groupby.deleteItem(this._groupby._itemsByIdentity[1]);
			this._groupby.save();
			if (this.groupbyid.get("value") == 1)
			{
				this.groupbyid.set("value", 2);
			}
		}
		else if (this.daterangeid.get("value") < 6)
		{
			this._groupby.close();
			this.groupbyid.set("query",{});
		}
	}
});
});
