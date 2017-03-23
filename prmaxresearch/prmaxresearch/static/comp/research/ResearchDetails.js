//-----------------------------------------------------------------------------
// Name:    ResearchDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../research/templates/ResearchDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/CheckBox",
	"research/questionnaires/SendSingle"
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass){
 return declare("research.employees.ResearchDetails",
	[BaseWidgetAMD,BorderContainer],{
	templateString:template,
	constructor: function()
	{
		this._objecttypeid = 1;
		this._months =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=months&ignore=1"});

	},
	postCreate:function()
	{
		this.researchfrequencyid.set("store",PRCOMMON.utils.stores.Research_Frequencies());
		this._load_call_back = lang.hitch ( this, this._load_call);
		this._update_call_back = lang.hitch ( this, this._update_call);

		this.quest_month_1.set("store",this._months);
		this.quest_month_2.set("store",this._months);
		this.quest_month_3.set("store",this._months);
		this.quest_month_4.set("store",this._months);

		this.inherited(arguments);
	},
	load:function(  outletid , outlettypeid)
	{
		this.outletid.set("value", outletid );
		this._objecttypeid = 1;
		if ( outlettypeid == 19)
			this._objecttypeid = 4;

		request.post('/research/admin/reseach_details_get',
				utilities2.make_params({ data:{outletid: outletid}})).then
				(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success=="OK")
		{
			if (response.data.research != null )
			{
				this.outletid.set("value", response.data.research.outletid );
				this.surname.set("value", response.data.research.surname );
				this.firstname.set("value", response.data.research.firstname );
				this.prefix.set("value", response.data.research.prefix );
				this.email.set("value", response.data.research.email );
				this.tel.set("value", response.data.research.tel );
				this.researchfrequencyid.set("value", response.data.research.researchfrequencyid );
				this.notes.set("value", response.data.research.notes );
				this.job_title.set("value", response.data.research.job_title );
				this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
				this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
				this._show_months();
				this.last_questionaire_sent.set("value",utilities2.from_object_date_no_date(response.data.last_questionaire_sent));
				this.last_research_completed.set("value",utilities2.from_object_date_no_date(response.data.last_research_completed));
				domattr.set(this.last_research_changed_date,"innerHTML", response.data.last_research_changed_date);
				domattr.set(this.last_customer_questionaire_action,"innerHTML", response.data.last_customer_questionaire_action);
				domattr.set(this.last_sync,"innerHTML", response.data.research.last_sync);
				this.no_sync.set("value", response.data.research.no_sync);

				this.quest_month_1.set("value",response.data.research.quest_month_1==null?-1:response.data.research.quest_month_1);
				this.quest_month_2.set("value",response.data.research.quest_month_2==null?-1:response.data.research.quest_month_2);
				this.quest_month_3.set("value",response.data.research.quest_month_3==null?-1:response.data.research.quest_month_3);
				this.quest_month_4.set("value",response.data.research.quest_month_4==null?-1:response.data.research.quest_month_4);

			}
			else
			{
				this.clear();
				this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
				this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			}
			this.savebtn.set("disabled",false);
		}
	},
	_setCheckedAttr:function( value )
	{
		this.no_sync.set("checked",value);
	},
	_show_months:function()
	{
		var tmp = this.researchfrequencyid.get("value");
		var field1 = dojo.addClass;
		var field2 = dojo.addClass;
		var field3 = dojo.addClass;
		var field4 = dojo.addClass;
		var field1value=-1;
		var field2value=-1;
		var field3value=-1;
		var field4value=-1;

		switch (tmp)
		{
		case "1":
			// 0
			break;
		case "5":
			// 1
			field1=dojo.removeClass;
			field1value=null;
			break;
		case "8":
			// 1,2
			field1=dojo.removeClass;
			field2=dojo.removeClass;
			field1value=null;
			field2value=null;
			break;
		case "7":
			// 1,2,3
			field1=dojo.removeClass;
			field2=dojo.removeClass;
			field3=dojo.removeClass;
			field1value=null;
			field2value=null;
			field3value=null;
			break;
		default:
			// 1,2,3,4
			field1=dojo.removeClass;
			field2=dojo.removeClass;
			field3=dojo.removeClass;
			field4=dojo.removeClass;
			field1value=null;
			field2value=null;
			field3value=null;
			field4value=null;
			break;
		}

		field1(this.quest_month_1_label,"prmaxhidden");
		field2(this.quest_month_2_label,"prmaxhidden");
		field3(this.quest_month_3_label,"prmaxhidden");
		field4(this.quest_month_4_label,"prmaxhidden");
		if (field1value==-1)
			this.quest_month_1.set("value",-1)
		if (field2value==-1)
			this.quest_month_2.set("value",-1)
		if (field3value==-1)
			this.quest_month_3.set("value",-1)
		if (field4value==-1)
			this.quest_month_4.set("value",-1)



	},
	clear:function()
	{
		this.surname.set("value", "" );
		this.firstname.set("value", "" );
		this.prefix.set("value", "" );
		this.email.set("value", "" );
		this.tel.set("value", "" );
		this.job_title.set("value","");
		this.researchfrequencyid.set("value", null );
		this.notes.set("value", "" );
		this.savebtn.set("disabled",true);
		this.last_questionaire_sent.set("value",null);
		this.last_research_completed.set("value", null);
		this.quest_month_1.set("value",-1);
		this.quest_month_2.set("value",-1);
		this.quest_month_3.set("value",-1);
		this.quest_month_4.set("value",-1);
		this._show_months();
		domattr.set(this.last_research_changed_date,"innerHTML", "");
		this.no_sync.set("checked", false);

	},
	_update:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if (this.reasoncodeid.isValid()==false)
		{
			alert("Missing Reason");
			throw "N";
		}

		var tmp = this.form.get("value");
		tmp["reasoncodeid"] = this.reasoncodeid.get("value");
		tmp["last_research_completed"] = utilities2.to_json_date(this.last_research_completed.get("value"));
		tmp["last_questionaire_sent"] = utilities2.to_json_date(this.last_questionaire_sent.get("value"));
		tmp["no_sync"] = this.no_sync.get("checked");

		request.post('/research/admin/reseach_details_update',
				utilities2.make_params({ data:tmp })).then
				(this._update_call_back);
	},
	_update_call:function( response )
	{
		if ( response.success=="OK")
		{
			alert("Research Details Updated");
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		}
		else
		{
			alert("Update Research Details Failed");
		}
		this.savebtn.cancel();
	},
	_show_q_dlg:function()
	{
		this.qctrl.load( this.outletid.get("value") , this._objecttypeid , this.email.get("value"), this.firstname.get("value"), this.qdlg );
	},
	_preview:function()
	{
		domattr.set(this.preview_objecttypeid,"value", this._objecttypeid );
		domattr.set(this.preview_objectid,"value", this.outletid.get("value") );
		this.previewform.submit();
	},
});
});
