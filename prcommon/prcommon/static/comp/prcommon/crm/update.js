//-----------------------------------------------------------------------------
// Name:    update.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/08/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.update");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.search.PersonSelect");
dojo.require("prmax.search.PersonSelect2");
dojo.require("prmax.search.PersonSelectDetails");
dojo.require("prcommon.crm.issues.selectmultiple");
dojo.require("prcommon.crm.issues.add");
dojo.require("prcommon.crm.responses.sendreply");
dojo.require("prcommon.common.ExpandedText");
dojo.require("prcommon.documents.adddialog");


dojo.declare("prcommon.crm.update",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/update.html"),
	history_view:"/crm/history_view?contacthistoryhistoryid=${contacthistoryhistoryid}",
	show_close:true,
	constructor: function()
	{
		this._DocumentCallBack = dojo.hitch(this, this._DocumentCall);

		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._contacthistorystatus = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=contacthistorystatus'});
		this._contacthistorytypes = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxcontacthistorytypes'});
		this._load_call_back = dojo.hitch(this, this._load_call);
		this._save_call_back = dojo.hitch(this, this._save_call);
		this._delete_call_back = dojo.hitch(this, this._delete_call);
		this._error_call_back = dojo.hitch(this, this._error_call);
		this._client_add_call_back = dojo.hitch(this, this._client_add_call);
		this._on_select_contact_call_back = dojo.hitch(this,this._on_select_contact);
		this._tmp_size = null;
		this._contactemail = '';

		this._issues = new dojox.data.QueryReadStore (
			{url:'/crm/issues/issues_list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true});

		this._history = new prcommon.data.QueryWriteStore (
			{url:'/crm/ch_history',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
			});

		for ( var key in this._fields)
		{
			var keyid = this._fields[key];

			this["_chud" + keyid ] = new dojox.data.QueryReadStore (
				{url:'/crm/user_defined?fieldid='+keyid,
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true});
		}

		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._documents = new dojox.data.JsonRestStore( {target:"/crm/documents/rest_combo", idAttribute:"id"});

		dojo.subscribe(PRCOMMON.Events.Issue_Add, dojo.hitch(this, this._new_issue_event));
		dojo.subscribe("/crm/settings_change", dojo.hitch(this, this._settings_event));
		dojo.subscribe(PRCOMMON.Events.Document_Add, dojo.hitch(this, this._add_event));
		dojo.subscribe("/crm/update_response", dojo.hitch(this, this._update_response_event));
		dojo.subscribe("/crm/update_person", dojo.hitch(this, this._update_person_event));
	},
	_fields:["1","2","3","4"],
	view:{
		cells: [[
			{name: 'Changed', width: "65px",field: 'created_display'},
			{name: 'Type', width: "65px",field: 'changetype'},
			{name: 'User', width: "auto",field: 'user_name'}
			]]
	},
	postCreate:function()
	{
		this.taken_by.store = this._users;
		this.follow_up_ownerid.store = this._users;
		this.contacthistorystatusid.store = this._contacthistorystatus;
		this.contacthistorytypeid.store = this._contacthistorytypes;
		this.issueid.store = this._issues;
		this.clientid.set("store", this._clients);
		dojo.attr(this.sendreplybtn, "disabled", true);

		if (PRMAX.utils.settings.required_client)
		{
			dojo.addClass(this.clientid,"prmaxrequired");
			this.clientid.set("query",{required_client:true})
		}
		else
		{
			dojo.removeClass(this.clientid,"prmaxrequired");
			this.clientid.set("value",  "-1");
		}
		this.documentid.set("store", this._documents);

		this.history_grid.set("structure", this.view);
		this.history_grid._setStore(this._history);
		this.history_grid.onRowClick = dojo.hitch(this, this._on_select_row);

		this.chud1id.store = this._chud1;
		this.chud2id.store = this._chud2;
		this.chud3id.store = this._chud3;
		this.chud4id.store = this._chud4;

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

		if (userdefine==true)
		{
			dojo.removeClass(this["chud5_view"],"prmaxhidden");
			dojo.removeClass(this["chud6_view"],"prmaxhidden");
		}

		if ( this.show_close == false )
		{
			dojo.addClass(this.closebtn.domNode,"prmaxhidden");
		}

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
		if (this.briefing_notes_label)
		{
			dojo.attr(this.briefing_notes_label, 'innerHTML', PRMAX.utils.settings.briefing_notes_description);
		}
		if (this.response_label)
		{
			dojo.attr(this.response_label, 'innerHTML', PRMAX.utils.settings.response_description);
		}

		this.inherited(arguments);
	},
	_on_select_row:function(e)
	{
		this._selected_row = this.history_grid.getItem(e.rowIndex);
		this.history_view_ctrl.set("href",dojo.string.substitute(this.history_view,{contacthistoryhistoryid:this._selected_row.i.contacthistoryhistoryid}));
	},
	load:function(contacthistoryid, contactemail)
	{
		this._clear();
		this._contacthistoryid = contacthistoryid;
		this._contactemail = contactemail;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._load_call_back,
						url:"/crm/get_edit" ,
						content: {contacthistoryid:contacthistoryid}
						}));
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.contacthistoryid.set("value", response.data.ch.contacthistoryid);
			var display = response.data.contactname;
			if (response.data.outlet == null || response.data.outlet.outletid == "")
			{
				this.outletid.set("value", -1);
			}
			else
			{
				this.outletid.set("value", response.data.outlet.outletid);
				this.contact.outletid.set("value", response.data.outlet.outletid);
			}
			if (response.data.employee == null || response.data.employee.employeeid == "")
			{
				this.employeeid.set("value", -1);
			}
			else
			{
				this.employeeid.set("value", response.data.employee.employeeid);
				this.contact.employeeid.set("value", response.data.employee.employeeid);
			}
			if (response.data.outlet != null && response.data.outlet.outletname != "")
			{
				if (display != null && display != "")
					display +=" (" + response.data.outlet.outletname + ")";
				else
					display = " Outlet: " + response.data.outlet.outletname;
			}
			if (response.data.contact)
			{
				this.contact.set("value", response.data.contact.contactid);
			}
			this.contact.set("Displayvalue", display);

			if (response.data.ch.crm_response == '')
			{
				this.sendreplybtn.set("disabled", true);
			}
			else
			{
				this.sendreplybtn.set("disabled", false);
			}

			this.taken.set("value", ttl.utilities.fromJsonDate( response.data.ch.taken) );
			this.taken_by.set("value",response.data.ch.taken_by);
			this.contacthistorystatusid.set("value", response.data.ch.contacthistorystatusid);
			this.contacthistorytypeid.set("value", response.data.ch.contacthistorytypeid);
			this.clientid.set("value",response.data.ch.clientid);
			this.documentid.set("value",response.data.ch.documentid);
			this._document_data = response.data.document;

			this.details.set("value", response.data.ch.details);
			this.outcome.set("value", response.data.ch.outcome);
			this.crm_response.set("value", response.data.ch.crm_response);
			this.crm_subject.set("value", response.data.ch.crm_subject);

			for ( var key in this._fields)
			{
				var keyid = this._fields[key];

				this["chud"+keyid+"id"].set("value",response.data.ch["chud"+keyid+"id"]);
			}
			if (response.data.chi.primary)
				this.issueid.set("value", response.data.chi.primary.issueid);
			else
				this.issueid.set("value", null);

			this.extraissues.set("value", response.data.chi.si );

			if ( response.data.task)
			{
				this.follow_up_view_check.set("checked",true);
				this._follow_up_view_change();
				this.follow_up_ownerid.set("value", response.data.ch.follow_up_ownerid );
				this.follow_up_date.set("value", ttl.utilities.fromJsonDate( response.data.ch.follow_up_date) );
			}

			this.display_view.selectChild(this.tabcont);
			this.tabcont.selectChild(this.details_view);
			this.history_grid.setQuery({contacthistoryid:response.data.ch.contacthistoryid});
		}
		else
		{

		}
	},
	_clear:function()
	{
		this.clientid.set("value",-1);
		this.documentid.set("value",-1);
		this.history_view_ctrl.set("href",dojo.string.substitute(this.history_view,{contacthistoryhistoryid:-1}));

		this.tabcont.selectChild(this.details_view);
	},
	clear:function()
	{
		this.display_view.selectChild(this.blank);

		this._clear();
	},
	_new_issue:function()
	{
		this.new_issue_ctrl.clear();
		this.new_issue_ctrl.set("dialog",this.new_issue_dlg);
		this.new_issue_dlg.show();
	},
	_save:function()
	{
		if ( this.details.get("value") == "")
		{
			this.savebtn.cancel();
			alert(PRMAX.utils.settings.briefing_notes_description + " cannot be empty");
			return ;
		}
		var content = this.form.get("value");

		content["taken"] = ttl.utilities.toJsonDate ( this.taken.get("value"));
		content["follow_up_date"] = ttl.utilities.toJsonDate ( this.follow_up_date.get("value"));
		content['outletid'] = this.outletid.value;
		content['employeeid'] = this.employeeid.value;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			error: this._error_call_back,
			url:'/crm/update_note',
			content:content}));

	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
//			this._load_call(response);
			alert(PRMAX.utils.settings.crm_engagement + " changed");
			dojo.publish("/crm/update_note", [response.data]);
		}
		else
		{
			alert("Problem updating " + PRMAX.utils.settings.crm_engagement);
		}

		this.savebtn.cancel();
	},
	_follow_up_view_change:function()
	{
		if ( this.follow_up_view_check.get("checked"))
			dojo.removeClass(this.follow_up_view,"prmaxhidden");
		else
			dojo.addClass(this.follow_up_view,"prmaxhidden");
	},
	_new_issue_event:function(issue)
	{
		this.issueid.set("value", issue.issueid);
	},
	resize:function()
	{
		if (arguments[0]==null)
		{
			this.frame.resize(this._tmp_size);
		}
		else
		{
			this.frame.resize(arguments[0]);
		}
	},
	_error_call:function(response, ioArgs)
	{
		ttl.utilities.xhrPostError(response, ioArgs);
		this.savebtn.cancel();
		this.deletebtn.cancel();
	},
	_setTmpsizeAttr:function(actualsize)
	{
		if (actualsize)
		{
			this._tmp_size = new Object();
			this._tmp_size.w = 580;
			this._tmp_size.h = actualsize.h;
		}
	},
	_settings_event:function()
	{
		for ( var key in this._fields)
		{
			var keyid = this._fields[key];
			if (PRMAX.utils.settings["crm_user_define_" + keyid] != "" && PRMAX.utils.settings["crm_user_define_" + keyid] != null )
			{
				dojo.removeClass(this["chud" + keyid + "_view"],"prmaxhidden");
				dojo.attr(this["chud"+keyid+"_label"],"innerHTML",PRMAX.utils.settings["crm_user_define_"+keyid]);
			}
			else
			{
				dojo.addClass(this["chud" + keyid + "_view"],"prmaxhidden");
				dojo.attr(this["chud"+keyid+"_label"],"innerHTML",PRMAX.utils.settings["crm_user_define_"+keyid]);
			}
		}
	},
	_download:function()
	{
		ttl.utilities.gotoDialogPageStatic("/crm/documents/download/"+ this._document_data.documentid+this._document_data.ext);
	},
	_close:function()
	{
		dojo.publish("/crm/update_note_close");

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
	_new_document:function()
	{
		this.addctrl.show();
	},
	_add_event:function( document )
	{
		this.documentid.set( "value", document.documentid );
	},
	_send_reply:function()
	{
		this.send_reply_ctrl.set("dialog",this.send_reply_dlg,this.crm_subject.value, this.contacthistoryid.value, this._contactemail);
		this.send_reply_ctrl.load(this.send_reply_dlg,this.crm_subject.value, this.contacthistoryid.value, this._contactemail);
		this.send_reply_dlg.show();
	},
	_update_response_event:function( response )
	{
		this.history_grid.setQuery({contacthistoryid:response.data.contacthistoryid});
	},
	_delete:function()
	{

		if (confirm("Delete " + PRMAX.utils.settings.crm_engagement + "?"))
		{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._delete_call_back,
			error: this._error_call_back,
			url:'/crm/deletenote',
			content:{contacthistoryid: this._contacthistoryid}}));
		}
		else
		{
			this.deletebtn.cancel();
		}
	},
	_delete_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish("/crm/delete_note", [this._contacthistoryid]);
		}
		else
		{
			alert("Problem Deleting " + PRMAX.utils.settings.crm_engagement);
		}

		this.deletebtn.cancel();
	},
	_on_select_contact:function(employeeid,outletid,contactname,outletname)
	{
		this.outletid.set("value", outletid);
		this.employeeid.set("value", employeeid);

		var display = contactname;
		if (outletname != "")
		{
			display +=" (" + outletname + ")";
		}
		dojo.attr(this.contact_display,"innerHTML",display);
	},
	_select_contact:function()
	{
		this.person_select_dlg.start_search(this._on_select_contact_call_back);
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

//	_preview:function()
//	{
//		ttl.utilities.gotoDialogPageStatic("/crm/documents/download/"+ this._data.documentid+this._data.ext);
//	}
	_preview:function()
	{
		this._show_document();
	},
	_show_document:function()
	{
		var content = {};
		content['documentid'] = this.documentid.get("value");
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._DocumentCallBack,
			url:"/crm/documents/get",
			content:content}));	
	},	
	_DocumentCall:function(response)
	{
		if (response.success == "OK")
		{


			ttl.utilities.gotoDialogPageStatic("/crm/documents/download/"+ response.data.documentid + response.data.ext);

//			content = "<html>\n\t<head></head>\n\t<body>\n" + response.data.ext + "\n\t</body>\n</html>";
//			var win = window.open("javascript: ''", "", "status=1,menubar=0,location=0,toolbar=0");
//			win.document.open();
//			win.document.write(content);
//			win.document.close();
		}
	},
	
});





