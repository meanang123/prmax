//-----------------------------------------------------------------------------
// Name:    DeskAdd
// Author:  Chris Hoy
// Purpose:
// Created: 04/02/2013
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../desks/templates/DeskAdd.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/topic",
	"dojo/data/ItemFileReadStore",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, request, utilities2, json, lang, domclass, domattr, topic, ItemFileReadStore){
 return declare("prcommon2.outlet.desks.DeskAdd",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
		this._dialog = null;

		this._months = new ItemFileReadStore({url:"/common/lookups?searchtype=months&ignore=1"});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.researchfrequencyid.set("store",PRCOMMON.utils.stores.Research_Frequencies());

		for(var count=1; count <5 ; ++count)
		{
			this["quest_month_" + count].set("store",this._months);
			this["quest_month_" + count].set("value",-1);
		}
	},
	_add_dates:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		var data = lang.mixin(this.form.get("value"), this.form1.get("value"));

		data["last_research_completed"] = utilities2.to_json_date(this.last_research_completed.get("value"));
		data["last_questionaire_sent"] = utilities2.to_json_date(this.last_questionaire_sent.get("value"));

		if (this.mode == "add")
		{
			if ( confirm("Add Desk?"))
			{
				request.post('/research/admin/desks/add',
					utilities2.make_params({ data : data })).
					then(this._add_call_back);
			}
			else
			{
				this.savenode.cancel();
				throw "N";
			}
		}
		else
		{
			if ( confirm("Update Desk?"))
			{
				request.post('/research/admin/desks/update',
					utilities2.make_params({ data : data })).
					then(this._update_call_back);
			}
			else
			{
				this.savenode.cancel();
				throw "N";
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Desk Added");
			this.clear();
			if (this._dialog)
				this._dialog("hide");
			topic.publish(PRCOMMON.Events.Desk_Added, response.data);
		}
		else if ( response.success == "DU")
		{
			alert("Desk Already Exists");
			this.deskname.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	_update_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Desk Updated");
			topic.publish(PRCOMMON.Events.Desk_Updated, response.data);
		}
		else if ( response.success == "DU")
		{
			alert("Desk Already Exists");
			this.deskname.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.deskname.set("value","");
		this.outletdeskid.set("value",-1);
		this.email.set("value", "");
		this.tel.set("value", "");
		this.fax.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.linkedin.set("value", "");
		this.instagram.set("value", "");
		this.research_surname.set("value","");
		this.research_firstname.set("value","");
		this.research_prefix.set("value","");
		this.research_job_title.set("value","");
		this.research_email.set("value","");
		this.research_tel.set("value","");
		this.research_required.set("checked",true);
		this.researchfrequencyid.set("value",4);
		this.has_address.set("checked", false );
		this._address_show_do(false);
		this.address1.set("value", "");
		this.address2.set("value", "");
		this.townname.set("value", "");
		this.county.set("value", "");
		this.postcode.set("value","");

		this.notes.set("value", "" );
		this.last_questionaire_sent.set("value",null);
		this.last_research_completed.set("value", null);
		domattr.set(this.last_research_changed_date,"innerHTML", "");

		this._change_view();
		this._show_months();
		this.savenode.cancel();

		domclass.add(this.delete_button,"prmaxhidden");

	},
	focus:function()
	{
		this.deskname.focus();
	},
	_setDialogAttr:function (dialog)
	{
		this._dialog = dialog;
	},
	_setOutletidAttr:function ( outletid )
	{
		this.outletid.set("value", outletid);
	},
	load:function( outletdeskid )
	{
		this.savenode.cancel();
		domclass.add(this.delete_button,"prmaxhidden");

		request.post('/research/admin/desks/get',
				utilities2.make_params({ data : {outletdeskid:outletdeskid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			var tmp_research_required = false;
			
			this.outletdeskid.set("value", response.data.outletdesk.outletdeskid);
			this.deskname.set("value", response.data.outletdesk.deskname);
			if (response.data.outletdeskcomms)
			{
				this.email.set("value", response.data.outletdeskcomms.email);
				this.tel.set("value", response.data.outletdeskcomms.tel);
				this.fax.set("value", response.data.outletdeskcomms.fax);
				this.twitter.set("value", response.data.outletdeskcomms.twitter);
				this.facebook.set("value", response.data.outletdeskcomms.facebook);
				this.linkedin.set("value", response.data.outletdeskcomms.linkedin);
				this.instagram.set("value", response.data.outletdeskcomms.instagram);
			}
			else
			{
				this.email.set("value", "");
				this.tel.set("value", "");
				this.fax.set("value", "");
				this.twitter.set("value", "");
				this.facebook.set("value", "");
				this.linkedin.set("value", "");
				this.instagram.set("value", "");
			}
			if (response.data.deskaddress != null )
			{
				this.has_address.set("checked", true );
				this._address_show_do(true);
				this.address1.set("value", response.data.deskaddress.address1);
				this.address2.set("value", response.data.deskaddress.address2);
				this.townname.set("value", response.data.deskaddress.townname);
				this.county.set("value", response.data.deskaddress.county);
				this.postcode.set("value",response.data.deskaddress.postcode);
			}
			else
			{
				this.has_address.set("checked", false );
				this._address_show_do(false);
				this.address1.set("value", "");
				this.address2.set("value", "");
				this.townname.set("value", "");
				this.county.set("value", "");
				this.postcode.set("value","");


			}
			if (response.data.researchoutletdesk)
			{
				this.research_required.set("checked",true);
				tmp_research_required = true;
				this.research_surname.set("value", response.data.researchoutletdesk.surname);
				this.research_firstname.set("value", response.data.researchoutletdesk.firstname);
				this.research_prefix.set("value", response.data.researchoutletdesk.prefix);
				this.research_job_title.set("value", response.data.researchoutletdesk.job_title);
				this.research_email.set("value", response.data.researchoutletdesk.email);
				this.research_tel.set("value", response.data.researchoutletdesk.tel);

				this.researchfrequencyid.set("value", response.data.researchoutletdesk.researchfrequencyid==null?4: response.data.researchoutletdesk.researchfrequencyid);
				this.quest_month_1.set("value",response.data.researchoutletdesk.quest_month_1==null?-1:response.data.researchoutletdesk.quest_month_1);
				this.quest_month_2.set("value",response.data.researchoutletdesk.quest_month_2==null?-1:response.data.researchoutletdesk.quest_month_2);
				this.quest_month_3.set("value",response.data.researchoutletdesk.quest_month_3==null?-1:response.data.researchoutletdesk.quest_month_3);
				this.quest_month_4.set("value",response.data.researchoutletdesk.quest_month_4==null?-1:response.data.researchoutletdesk.quest_month_4);
				this.last_questionaire_sent.set("value",utilities2.from_object_date_no_date(response.data.last_questionaire_sent));
				this.last_research_completed.set("value",utilities2.from_object_date_no_date(response.data.last_research_completed));
				domattr.set(this.last_research_changed_date,"innerHTML", response.data.last_research_changed_date);
				this.notes.set("value", response.data.researchoutletdesk.notes);

			}
			else
			{
				this.research_required.set("checked",false);
				this.research_surname.set("value", "");
				this.research_firstname.set("value", "");
				this.research_prefix.set("value", "");
				this.research_job_title.set("value", "");
				this.research_email.set("value", "");
				this.research_tel.set("value", "");
				this.researchfrequencyid.set("value", 4 );
				this.quest_month_1.set("value",-1);
				this.quest_month_2.set("value",-1);
				this.quest_month_3.set("value",-1);
				this.quest_month_4.set("value",-1);
				this.last_questionaire_sent.set("value",null);
				this.last_research_completed.set("value",null);
				domattr.set(this.last_research_changed_date,"innerHTML", "");
				this.notes.set("value", "");
			}

			domclass.remove(this.delete_button,"prmaxhidden");
			domclass.add(this.close_button,"prmaxhidden");
			this._change_view();
			this._show_months(tmp_research_required);
			this._dialog("show");
		}
		else
		{
			alert("Problem");
		}
	},
	_close:function()
	{
		if ( this._dialog)
			this._dialog("hide");
	},
	_delete:function()
	{
		if ( confirm("Delete Desk"))
		{
			request.post('/research/admin/desks/delete',
					utilities2.make_params({ data : {outletdeskid : this.outletdeskid.get("value")}})).
					then(this._delete_call_back);
		}
	},
	_delete_call:function( response)
	{
		if (response.success=="OK")
		{
			alert("Desk Deleted");
			if (this._dialog)
				this._dialog("hide");
			topic.publish(PRCOMMON.Events.Desk_Deleted, this.outletdeskid.get("value"));
		}
		else
		{
				alert("Failed");
		}
	},
	_change_view:function()
	{
		var domcommand = domclass.add;

		if (this.research_required.get("checked"))
			domcommand = domclass.remove;

		for (var count = 1; count < 12; ++count)
			domcommand(this["research_required_" + count],"prmaxhidden");

		for (var count=1; count <5 ; ++count)
		{
			domcommand(this["quest_month_2_label_" + count] ,"prmaxhidden");
		}

		this._show_months(this.research_required.get("checked"));

		var outletdeskid = this.outletdeskid.get("value");
		if (outletdeskid == "-1" || outletdeskid == null)
		{
			for (var count = 8; count < 11; ++count)
				domclass.add(this["research_required_" + count],"prmaxhidden");
		}
	},
	_show_months_check:function()
	{
		this._show_months(this.research_required.get("checked"));
	},
	_show_months:function(research_required)
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

		if (research_required==false)
			tmp = "1";

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

		field1(this.quest_month_2_label_1,"prmaxhidden");
		field2(this.quest_month_2_label_2,"prmaxhidden");
		field3(this.quest_month_2_label_3,"prmaxhidden");
		field4(this.quest_month_2_label_4,"prmaxhidden");
		if (field1value==-1)
			this.quest_month_1.set("value",-1);
		if (field2value==-1)
			this.quest_month_2.set("value",-1);
		if (field3value==-1)
			this.quest_month_3.set("value",-1);
		if (field4value==-1)
			this.quest_month_4.set("value",-1);

	},
	_address_show:function()
	{
		this._address_show_do ( this.has_address.get("checked") ) ;
	},
	_address_show_do:function ( show_it )
	{
		var _HidFields = ["addr1","addr2","addr3","addr4","addr5"];

		if ( show_it == false )
		{
			for ( var key in _HidFields )
				domclass.add(this[_HidFields[key]], "prmaxhidden");
		}
		else
		{
			for ( var key in _HidFields )
				domclass.remove(this[_HidFields[key]], "prmaxhidden");
		}
	}
});
});
