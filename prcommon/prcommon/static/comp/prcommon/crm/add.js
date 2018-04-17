//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.add");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.search.PersonSelect");
dojo.require("prmax.search.PersonSelect2");
dojo.require("prcommon.crm.issues.selectmultiple");
dojo.require("prcommon.crm.issues.add");
dojo.require("prcommon.common.ExpandedText");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.ContentPane");

dojo.require("prcommon.documents.adddialog");

dojo.declare("prcommon.crm.add",
	[ ttl.BaseWidget, dijit.layout.ContentPane],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/add.html"),
	constructor: function()
	{
		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._contacthistorystatus = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=contacthistorystatus'});
		this._contacthistorytypes = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxcontacthistorytypes'});
		this._dialog = null;
		this._on_select_contact_call_back = dojo.hitch(this,this._on_select_contact);
		this._save_call_back = dojo.hitch(this, this._save_call);
		this._issue_brief_call_back = dojo.hitch(this, this._issue_brief_call);
		this._client_add_call_back = dojo.hitch(this, this._client_add_call);
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._documents = new dojox.data.JsonRestStore( {target:"/crm/documents/rest_combo", idAttribute:"id"});

		this._issues = new dojox.data.QueryReadStore (
			{url:'/crm/issues/issues_list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true});

		for ( var key in this._fields)
		{
			var keyid = this._fields[key];

			this["_chud" + keyid ] = new dojox.data.QueryReadStore (
				{url:'/crm/user_defined?fieldid='+keyid,
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true});
		}

		dojo.subscribe(PRCOMMON.Events.Issue_Add, dojo.hitch(this, this._new_issue_event));
		dojo.subscribe("/crm/settings_change", dojo.hitch(this, this._settings_event));
		dojo.subscribe(PRCOMMON.Events.Document_Add, dojo.hitch(this, this._add_event));
		dojo.subscribe("/crm/update_person", dojo.hitch(this, this._update_person_event));
	},
	_fields:["1","2","3","4"],
	postCreate:function()
	{
		this.taken_by.store = this._users;
		this.follow_up_ownerid.store = this._users;
		this.contacthistorystatusid.store = this._contacthistorystatus;
		this.contacthistorytypeid.store = this._contacthistorytypes;
		this.issueid.store = this._issues;

		var userdefine=false;
		for ( var key in this._fields)
		{
			var keyid = this._fields[key];

			if (PRMAX.utils.settings["crm_user_define_" + keyid ] != "" && PRMAX.utils.settings["crm_user_define_" + keyid] != null )
			{
				dojo.removeClass(this["chud" + keyid + "_view"],"prmaxhidden");
				dojo.attr(this["chud" + keyid +"_label"],"innerHTML",PRMAX.utils.settings["crm_user_define_"+keyid]);
				userdefine=true;
			}

			this["chud"+keyid+"id"].store = this["_chud"+keyid];
		}

		//if (userdefine==true)
		//{
		//	dojo.removeClass(this["chud5_view"],"prmaxhidden");
		//}

		this.clientid.set("store", this._clients);
		if (PRMAX.utils.settings.required_client)
		{
			dojo.addClass(this.clientid,"prmaxrequired");
			this.clientid.set("query",{required_client:true})
			this.clientid.set("store", this._clients);
		}
		else
		{
			dojo.removeClass(this.clientid,"prmaxrequired");
			this.clientid.set("value",  "-1");
		}
		this.documentid.set("store", this._documents);

		this._clear();

		dojo.attr(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		this.new_issue_dlg.set("label",PRMAX.utils.settings.issue_description);
		this.extraissues.set("displaytitle","Other " + PRMAX.utils.settings.issue_description+"s");
		if (PRMAX.utils.settings.crm_subject.length>0)
		{
			dojo.attr(this.subject_label_1,"innerHTML",PRMAX.utils.settings.crm_subject);
		}
		if (PRMAX.utils.settings.crm_outcome.length>0)
		{
			dojo.attr(this.outcome_label_1,"innerHTML",PRMAX.utils.settings.crm_outcome);
		}
		dojo.attr(this.briefing_notes_label, 'innerHTML', PRMAX.utils.settings.briefing_notes_description);
		dojo.attr(this.response_label, 'innerHTML', PRMAX.utils.settings.response_description);

		this.initiate_layout();

		this.inherited(arguments);
	},
	_clear:function()
	{
		this.tabcont.selectChild(this.details_view);

		this.contacthistorystatusid.set("value",2);
		this.contacthistorytypeid.set("value",1);
		this.follow_up_ownerid.set("value",PRMAX.utils.settings.uid);
		this.taken_by.set("value", PRMAX.utils.settings.uid);

		this.taken.set("value",new Date());
		this.follow_up_date.set("value",new Date());

		this.savebtn.cancel();
		this.issueid.set("value",null);
		this.extraissues.clear();

		this.details.set("value","");
		this.outcome.set("value","");
		this.crm_response.set("value","");

		this.follow_up_view_check.set("checked",false);
		this.documentid.set("value",  "-1");
	},
	_clear_contact:function()
	{
		this.employeeid.set("value","-1");
		this.outletid.set("value","-1");
		this.contact.set("Displayvalue", "");
	},
	clear:function()
	{
		this._clear();
		this._clear_contact();
		dojo.addClass(this.follow_up_view,"prmaxhidden");
	},
	_close:function()
	{
		this._clear();

		if ( this._dialog)
		{
			this._dialog.hide();
		}
	},
	_new_issue:function()
	{
		this.new_issue_ctrl.clear();
		this.new_issue_ctrl.set("dialog",this.new_issue_dlg);
		this.new_issue_dlg.show();
	},
	_save:function()
	{
		var content = this.form.get("value");
		var content2 = this.form2.get("value");
		content["taken"] = ttl.utilities.toJsonDate ( this.taken.get("value"));
		content["follow_up_date"] = ttl.utilities.toJsonDate ( this.follow_up_date.get("value"));
		content['outletid'] = this.outletid.value;
		content['employeeid'] = this.employeeid.value;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/crm/add_note',
			content:dojo.mixin(content,content2)}));
	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
			dojo.publish("/crm/newnote", [response.data.ch]);
			if (response.data.task)
				dojo.publish ( PRCOMMON.Events.Task_Add , [response.data.task ]);
			this._close();
		}
		else
		{
			alert("Problem adding note");
			this.savebtn.cancel();
		}
	},
	_on_select_contact:function(employeeid,outletid,contactname,outletname)
	{
		this.outletid.set("value",outletid);
		this.employeeid.set("value",employeeid);

		var display = '';
		if (contactname != undefined && contactname != "")
		{
			display = contactname;
		}
		if (outletname != undefined && outletname != "" && display != null && display != "")
		{
			display +=" (" + outletname + ")";
		}
		this.contact.set("Displayvalue", display);
	},
	_select_contact:function()
	{
		this.person_select_dlg.start_search(this._on_select_contact_call_back);
	},
	_follow_up_view_change:function()
	{
		if ( this.follow_up_view_check.get("checked"))
			dojo.removeClass(this.follow_up_view,"prmaxhidden");
		else
			dojo.addClass(this.follow_up_view,"prmaxhidden");
	},
	load:function(outletid,outletname,employeeid,contactname,contactid)
	{
		if (outletid == "" || outletid == undefined)
		{
			this.outletid.set("value", -1);
		}
		else
		{
			this.outletid.set("value", outletid);
			this.contact.outletid.set("value", outletid);
		}
		if (employeeid == "" || employeeid == undefined)
		{
			this.employeeid.set("value", -1);
		}
		else
		{
			this.employeeid.set("value", employeeid);
			this.contact.employeeid.set("value", employeeid);
		}
		var display = '';
		if (contactname != undefined && contactname != "")
		{
			display = contactname;
		}
		if (outletname != undefined && outletname != "" && display != null && display != "")
		{
			display +=" (" + outletname + ")";
		}
		if (contactid != undefined && contactid != "" )
		{
			this.contact.set("value", contactid);
		}
		this.contact.set("Displayvalue", display);

		this.tabcont.selectChild(this.details_view);

	},
	_new_issue_event:function(issue)
	{
		this.issueid.set("value", issue.issueid);
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	},
	_settings_event:function()
	{

		dojo.addClass(this["chud5_view"],"prmaxhidden");

		for ( var key in this._fields)
		{
			var keyid = this._fields[key];
			if (PRMAX.utils.settings["crm_user_define_" + keyid] != "" && PRMAX.utils.settings["crm_user_define_" + keyid] != null )
			{
				dojo.removeClass(this["chud" + keyid + "_view"],"prmaxhidden");
				dojo.removeClass(this["chud5_view"],"prmaxhidden");

				dojo.attr(this["chud"+keyid+"_label"],"innerHTML",PRMAX.utils.settings["crm_user_define_"+keyid]);
			}
			else
			{
				dojo.addClass(this["chud" + keyid + "_view"],"prmaxhidden");
				dojo.attr(this["chud"+keyid+"_label"],"innerHTML",PRMAX.utils.settings["crm_user_define_"+keyid]);
			}
		}

		this.initiate_layout();
	},
	_new_document:function()
	{
		this.addctrl.show();
	},
	_add_event:function( document )
	{
		this.documentid.set( "value", document.documentid );
	},
	_issue_selected:function()
	{
		var issueid = this.issueid.get("value");

		if (issueid != null && issueid != '' && issueid != '-1')
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._issue_brief_call_back,
				url:'/crm/issues/get_briefing_notes',
				content:{issueid:issueid}}));
		}
	},
	_issue_brief_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.details.set("value", response.data.briefingnotes);
		}
	},
	_new_client:function()
	{
		this.client_add_ctrl.Load(-1, this._client_add_call_back);
		this.client_add_dialog.show();
	},
	_client_add_call:function(action, data )
	{
		this.clientid.set("value", data.clientid );
		this.client_add_dialog.hide();
	},
	resize:function()
	{
		this.tabcont.resize({w:600, h:600});
	},
	_update_person_event:function(response)
	{
		this.outletid.set("value", response.outletid);
		this.employeeid.set("value", response.employeeid);
	},
	_expand_response:function()
	{
		this.text_view_ctrl.show_control( this.crm_response, this.text_view_dlg, PRMAX.utils.settings.response_description);
	},
	_expand_details:function()
	{
		this.text_view_ctrl.show_control( this.details, this.text_view_dlg, PRMAX.utils.settings.briefing_notes_description);
	},
	_expand_outcome:function()
	{
		this.text_view_ctrl.show_control( this.outcome, this.text_view_dlg, "Outcome");
	},
	initiate_layout:function()
	{
		var parent_loc = null;

		parent_loc = (PRMAX.utils.settings.crm_outcome_page_1) ? this.page_1_point_2 : this.page_2_point_1;
		dojo.place(this.outcome_node, parent_loc);

		parent_loc = (PRMAX.utils.settings.crm_analysis_page_1) ? this.page_1_point_1 : this.page_2_point_2;
		dojo.place(this.analysis_node, parent_loc);

		parent_loc = (PRMAX.utils.settings.crm_response_page_1) ? this.page_1_point_4 : this.page_2_point_4;
		dojo.place(this.crm_response_zone, parent_loc);

		parent_loc = (PRMAX.utils.settings.crm_briefingnotes_page_1) ? this.page_1_point_3 : this.page_2_point_3;
		dojo.place(this.briefing_node, parent_loc);

		//dojo.place(this.crm_response_zone, parent_loc);

	}
});
