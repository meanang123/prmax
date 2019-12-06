//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.questions
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.questions.edit");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dojo.store.Memory");
dojo.require("dojo.data.ObjectStore");
dojo.require("dojo.store.util.SimpleQueryEngine");

dojo.declare("prcommon.clippings.questions.edit",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.questions","templates/edit.html"),
	constructor: function()
	{
		this._save_call_back=dojo.hitch(this, this._save_call);
		this._load_call_back=dojo.hitch(this, this._load_call);
		this._save_answer_call_back = dojo.hitch(this, this._save_answer_call);
		this._update_default_call_back = dojo.hitch(this, this._update_default_call);
		this._remove_answer_call_back = dojo.hitch(this, this._remove_answer_call);
		this._rename_answer_call_back = dojo.hitch(this, this._rename_answer_call);

		this._clients = new dojox.data.JsonRestStore({target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._answers = new dojox.data.JsonRestStore({target:"/clippings/questions/answers_list", idAttribute:"questionanswerid"});

		this._menu_item = null;

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");
		this.issueid.set("store", this._issues);
		this.issueid.set("value", "-1" );

		this.answer_grid.set("structure", this.view);
		this.answer_grid._setStore(this._answers);
		this.answer_grid.canSort = function(){return false};
		this.answer_grid["onRowClick"] = dojo.hitch(this, this._on_row_click );
		this.default_answer_answerid.set("store", this._answers);

		dojo.attr(this.issue_label_1, "innerHTML", "&nbsp;"+ PRMAX.utils.settings.issue_description);
		dojo.attr(this.issue_label_2, "innerHTML", PRMAX.utils.settings.issue_description);

		dojo.attr(this.client_label_1, "innerHTML", "&nbsp;"+ PRMAX.utils.settings.client_name);
		dojo.attr(this.client_label_2, "innerHTML", PRMAX.utils.settings.client_name);
	},
	_on_row_click:function(e)
	{
		var row = this.answer_grid.getItem(event.rowIndex);
		if ( row )
		{
			this._row = row;
			if (this._menu_item==null)
			{
				this._menu_item = new dijit.Menu();
				this._menu_item.addChild(new dijit.MenuItem({label:"Remove", onClick:dojo.hitch(this,this._remove_answer_start)}));
				this._menu_item.addChild(new dijit.MenuItem({label:"Rename", onClick:dojo.hitch(this,this._rename_answer_start)}));
			}
			this._menu_item._openMyself(e);
		}
	},
	_rename_answer_start:function()
	{
		dojo.attr(this.old_answer_text,"innerHTML", this._row.answertext);
		this.rename_questionanswerid.set("value", this._row.questionanswerid);
		this.rename_answertext.set("value","");
		this.rename_answer_dlg.show();
	},
	_remove_answer_start:function()
	{
		if ( this._row && confirm("Remove Answer - " + this._row.answertext + " ?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._remove_answer_call_back,
				url:'/clippings/questions/answer_delete',
				content: {questionanswerid:this._row.questionanswerid}}));
		}
	},
	_remove_answer_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._answers.deleteItem(this._row);
			this._row = null;
		}
		else
		{
			alert("Failed to delete Answer");
		}
	},
	view: {
		cells: [[
		{name: ' ',width:"20px",formatter:ttl.utilities.format_row_ctrl },
		{name: 'Answer Text',width: "auto",field:"answertext"}
		]]
	},
	clear:function()
	{
		this.questiontext.set("value","");
		this.answer_grid.setQuery(ttl.utilities.getPreventCache({}));
		this.updbtn.cancel();
		this.default_answer_answerid.set("query", {});

	},
	load:function(questionid, show_function)
	{
		this._show_function = show_function;
		this.default_answer_answerid.set("query",{questionid:questionid});


		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._load_call_back,
			url:'/clippings/questions/get_question_from_edit',
			content: {questionid:questionid}}));

	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			with ( response)
			{
				this._question = data;

				this.questiontext.set("value", data.questiontext);
				this.questionid.set("value", data.questionid);
				this.answer_questionid.set("value", data.questionid);
				this.default_answer_questionid.set("value", data.questionid);
				this.rename_answer_questionid.set("value", data.questionid);
				this.answer_grid.setQuery(ttl.utilities.getPreventCache({questionid:data.questionid}));
				//this.default_answer_answerid.set("query",{questionid:data.questionid});
				this.default_answer_text.set("value",data.default_answer_text);
				this.default_answer_answerid.set("value",data.default_answerid);
				this.default_answer_answerid.value = data.default_answerid;
				
				this.default_answer_boolean.set("check",data.default_answer_boolean);
				this.default_answer_number.set("value",data.default_answer_number);
				this.default_answer_currency.set("value",data.default_answer_currency);

				switch ( this._question.restrict)
				{
					case 1:
					dojo.addClass(this.restrict_client_view,"prmaxhidden");
					dojo.addClass(this.restrict_issue_view,"prmaxhidden");
					this.issueid.set("required",false);
					this.clientid.set("required",false);
					this.issueid.set("value",-1);
					this.clientid.set("required",-1);
					this.restrict_global.set("checked",true);
					break;
				case 2:
					dojo.removeClass(this.restrict_client_view,"prmaxhidden");
					dojo.addClass(this.restrict_issue_view,"prmaxhidden");
					this.issueid.set("required",false);
					this.issueid.set("value",-1);
					this.clientid.set("required",true);
					this.clientid.set("value", data.clientid);
					this.restrict_client.set("checked",true);
					break;
				case 3:
					dojo.addClass(this.restrict_client_view,"prmaxhidden");
					dojo.removeClass(this.restrict_issue_view,"prmaxhidden");
					this.issueid.set("required",true);
					this.clientid.set("required",false);
					this.clientid.set("value",-1);
					this.issueid.set("value", data.issueid);
					this.restrict_campaign.set("checked",true);
					break;
				}

				switch(this._question.questiontypeid)
				{
					case 2:
						dojo.style(this.page_default.controlButton.domNode, "display", "");
						dojo.style(this.page_answers.controlButton.domNode, "display", "");
						break;
					case 6:
						dojo.style(this.page_answers.controlButton.domNode, "display", "");
						dojo.style(this.page_default.controlButton.domNode, "display", "none");
						break;
					default :
						dojo.style(this.page_answers.controlButton.domNode, "display", "none");
						dojo.style(this.page_default.controlButton.domNode, "display", "");
						break;
				}

				this.updbtn.cancel();
				this._show_default_selection();
				this.page_view.selectChild(this.name_view);
				this._show_function();
			}
		}
		else
		{
			alert("Problem");
		}
	},
	_update:function()
	{
		if ( ttl.utilities.formValidator(this.main_form)==false)
		{
			alert("Not all required field filled in");
			this.updbtn.cancel();
			return;
		}

		var restriction = this._question.restrict;

		if ( restriction==2)
		{
			var tmp = this.clientid.get("value");
			if (tmp == null || tmp == "" || tmp == "-1")
			{
				alert("No Client Selected");
				this.clientid.focus();
				return;
			}
		}
		if ( restriction==3)
		{
			var tmp = this.issueid.get("value");
			if (tmp == null || tmp == "" || tmp == "-1")
			{
				alert("No Issue Selected");
				this.issueid.focus();
				return;
			}
		}

		var content=this.main_form.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/clippings/questions/update_question_details',
			content: content}));
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish("/clippings/question/update", [response.data]);
		}
		else if ( response.success=="DU")
		{
			alert("Already Exists");
			this.questiontext.focus();
		}
		else
		{
			alert("Problem Saving Question");
		}

		this.updbtn.cancel();
	},
	_change_restrict_view:function()
	{
		var restriction = this.main_form.get("value")["restrict"];

		switch (restriction)
		{
		case "1":
			dojo.addClass(this.restrict_client_view,"prmaxhidden");
			dojo.addClass(this.restrict_issue_view,"prmaxhidden");
			this.issueid.set("required",false);
			this.clientid.set("required",false);
			this.issueid.set("value",-1);
			this.clientid.set("required",-1);
			break;
		case "2":
			dojo.removeClass(this.restrict_client_view,"prmaxhidden");
			dojo.addClass(this.restrict_issue_view,"prmaxhidden");
			this.issueid.set("required",false);
			this.issueid.set("value",-1);
			this.clientid.set("required",true);
			break;
		case "3":
			dojo.addClass(this.restrict_client_view,"prmaxhidden");
			dojo.removeClass(this.restrict_issue_view,"prmaxhidden");
			this.issueid.set("required",true);
			this.clientid.set("required",false);
			this.clientid.set("value",-1);
			break;
		}
	},
	_add_answer:function()
	{
		this.answertext.set("value","");
		this.addanswerbtn.cancel();
		this.new_answer_dlg.show();
	},
	_add_answer_add:function()
	{
		if ( ttl.utilities.formValidator(this.add_answer_form)==false)
		{
			alert("Not all required field filled in");
			this.addanswerbtn.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_answer_call_back,
			url:'/clippings/questions/add_answer',
			content: this.add_answer_form.get("value")}));
	},
	_save_answer_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._answers.newItem(response.data);
			this.new_answer_dlg.hide();

		}
		else if ( response.success=="DU")
		{
			alert("Answer Already Exists");
		}
		else
		{
			alert("Problem adding Answer");
		}

		this.addanswerbtn.cancel();

	},
	_show_default_selection:function()
	{

		dojo.addClass(this.default_yes_no_view,"prmaxhidden");
		dojo.addClass(this.default_text_view,"prmaxhidden");
		dojo.addClass(this.default_numeric,"prmaxhidden");
		dojo.addClass(this.default_currency_view,"prmaxhidden");
		dojo.addClass(this.default_list_view,"prmaxhidden");

		switch (this._question.questiontypeid)
		{
		case 1:
			dojo.removeClass(this.default_yes_no_view,"prmaxhidden");
			break;
		case 2:
			dojo.removeClass(this.default_list_view,"prmaxhidden");
			break;
		case 3:
			dojo.removeClass(this.default_text_view,"prmaxhidden");
			break;
		case 4:
			dojo.removeClass(this.default_numeric,"prmaxhidden");
			break;
		case 5:
			dojo.removeClass(this.default_currency_view,"prmaxhidden");
			break;
		case 6:
			break;
		}
	},
	_update_default:function()
	{

		if ( ttl.utilities.formValidator(this.default_form)==false)
		{
			alert("Not all required field filled in");
			this.upddefbtn.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._update_default_call_back,
			url:'/clippings/questions/update_question_defaults',
			content: this.default_form.get("value")}));
	},
	_update_default_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}

		this.upddefbtn.cancel();
	},
	_rename_answer_add:function()
	{
		if ( ttl.utilities.formValidator(this.rename_answer_form)==false)
		{
			alert("Not all required field filled in");
			this.renameanswerbtn.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._rename_answer_call_back,
			url:'/clippings/questions/rename_answer',
			content: this.rename_answer_form.get("value")}));
	},
	_rename_answer_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._answers.setValue(this._row,"answertext",response.data.answertext);
			this.rename_answer_dlg.hide();

		}
		else
		{
			alert("Problem");
		}
		this.renameanswerbtn.cancel();
	},
	_close:function()
	{
		this.new_answer_dlg.hide();
		this.rename_answer_dlg.hide();
	}
});
