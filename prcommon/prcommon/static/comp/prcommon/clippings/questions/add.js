//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.questions
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.questions.add");

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

dojo.declare("prcommon.clippings.questions.add",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.questions","templates/add.html"),
	publish_path:"/clippings/question/global",
	constructor: function()
	{
		this._save_call_back=dojo.hitch(this, this._save_call);
		this._clients = new dojox.data.JsonRestStore({target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._clientid = null;
		this._issueid = null;

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");
		this.issueid.set("store", this._issues);
		this.issueid.set("value", "-1" );

		this.answer_grid.set("structure", this.view);
		this._memorystore=dojo.store.Memory();
		this._store = dojo.data.ObjectStore({objectStore: this._memorystore});
		this.answer_grid._setStore(this._store);
		this.answer_grid.canSort = function(){return false};
		this.answer_grid["onRowClick"] = dojo.hitch(this, this._on_row_click );
		this.default_answer_answerid.set("store", this._store);

		var tmp = dojo.attr(this.issue_label_1, "innerHTML").replace("Issue",PRMAX.utils.settings.issue_description);
		dojo.attr(this.issue_label_1, "innerHTML", tmp );
		dojo.attr(this.issue_label_2, "innerHTML", PRMAX.utils.settings.issue_description);
	},
	_on_row_click:function(e)
	{
		var row = this.answer_grid.getItem(event.rowIndex);
		if ( row && confirm("Remove Answer"))
		{
			this._store.deleteItem(row);
		}
	},
	view: {
		cells: [[
		{name: 'Answer Text',width: "auto",field:"answertext"},
		{name: ' ',width:"20px",formatter:ttl.utilities.formatRowCtrl }
		]]
	},
	clear:function()
	{
		this.questiontext.set("value","");
		this.question_is_text.set("checked",true);
		this._memorystore=dojo.store.Memory();
		this._store = dojo.data.ObjectStore({objectStore: this._memorystore});
		this.answer_grid._setStore(this._store);
		this.answer_grid.setQuery(ttl.utilities.getPreventCache({}));
		this.savebtn.cancel();
		this.default_answer_answerid.set("store", this._store);

		this.wizard_pages.selectChild(this.page_start);
	},
	load:function(clientid,issueid)
	{
		this._clientid = clientid;
		if ( this._clientid != null )
		{
			this.restrict_client.set("checked",true);
			this.clientid.set("value", this._clientid);
			dojo.addClass(this.restrict_global_label_view,"prmaxhidden");
			dojo.addClass(this.restrict_campaign_label_view,"prmaxhidden");
		}

		this._issueid = issueid;
		if ( this._issueid != null )
		{
			this.restrict_campaign.set("checked",true);
			this.issueid.set("value", this._issueid);
			dojo.addClass(this.restrict_global_label_view,"prmaxhidden");
			dojo.addClass(this.restrict_client_label_view,"prmaxhidden");
		}
	},
	_next_page_start_page:function()
	{
		if ( ttl.utilities.formValidator(this.main_form)==false)
		{
			this.questiontext.focus();
			return;
		}

		if ( this._has_multiple_answer())
				this.wizard_pages.selectChild(this.page_answers);
			else
			{
				this.wizard_pages.selectChild(this.page_restrictions);
			}
	},
	_next_page_page_answers:function()
	{
		this._store.save();

		if ( this._memorystore.data.length<=0 )
		{
			alert("No Answers Specified");
		}
		else
		{
			this.wizard_pages.selectChild(this.page_restrictions);
		}
	},
	_prev_page_page_answers:function()
	{
		this.wizard_pages.selectChild(this.page_start);
	},
	_prev_page_page_default:function()
	{
		this.wizard_pages.selectChild(this.page_restrictions);
	},
	_next_page_restrict:function()
	{
		var restriction = this.restrict_form.get("value")["restrict"];
		if ( restriction=="2")
		{
			var tmp = this.clientid.get("value");
			if (tmp == null || tmp == "" || tmp == "-1")
			{
				alert("No Client Selected");
				this.clientid.focus();
				return;
			}
		}
		if ( restriction=="3")
		{
			var tmp = this.issueid.get("value");
			if (tmp == null || tmp == "" || tmp == "-1")
			{
				alert("No Issue Selected");
				this.issueid.focus();
				return;
			}
		}

		this._show_default_selection();
		this.wizard_pages.selectChild(this.page_default);
	},
	_prev_page_restrict:function()
	{
		if ( this._has_multiple_answer())
			this.wizard_pages.selectChild(this.page_answers);
		else
		{
			this.wizard_pages.selectChild(this.page_start);
		}
	},
	_save:function()
	{
		if ( ttl.utilities.formValidator(this.main_form)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}

		var content=this.main_form.get("value");
		content=dojo.mixin(content,this.default_form.get("value"));
		content=dojo.mixin(content,this.restrict_form.get("value"));
		this._store.save();
		if ( this._memorystore.data.length>0 )
		{
			var answers= new Array();
			for ( var key in this._memorystore.data)
			{
				answers.push( {answertext:this._memorystore.data[key].answertext, id : this._memorystore.data[key].id} );
			}
			content["answers"]= dojo.toJson(answers);
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/clippings/questions/add',
			content: content}));
	},
	focus:function()
	{
		this.questiontext.focus();
	},
	resize:function()
	{
		this.frame.resize( {w:500, h:500} );
	},
	_has_multiple_answer:function()
	{
		if ( this.question_list.get("checked") == true ||
				 this.question_multiple.get("checked") == true)
			return true;
		else
			return false;
	},
	_show_default_selection:function()
	{
		var questiontypeid = this.main_form.get("value")["questiontypeid"];

		dojo.addClass(this.default_yes_no_view,"prmaxhidden");
		dojo.addClass(this.default_text_view,"prmaxhidden");
		dojo.addClass(this.default_numeric,"prmaxhidden");
		dojo.addClass(this.default_currency_view,"prmaxhidden");
		dojo.addClass(this.default_list_view,"prmaxhidden");

		switch (questiontypeid)
		{
		case "1":
			dojo.removeClass(this.default_yes_no_view,"prmaxhidden");
			break;
		case "2":
			dojo.removeClass(this.default_list_view,"prmaxhidden");
			break;
		case "3":
			dojo.removeClass(this.default_text_view,"prmaxhidden");
			break;
		case "4":
			dojo.removeClass(this.default_numeric,"prmaxhidden");
			break;
		case "5":
			dojo.removeClass(this.default_currency_view,"prmaxhidden");
			break;
		case "6":
			break;
		}
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish(this.publish_path, [response.data, this._clientid, this._issueid]);
		}
		else if ( response.success=="DU")
		{
			alert("Already Exists");
			this.wizard_pages.selectChild(this.page_start);
			this.questiontext.focus();
		}
		else
		{
			alert("Problem Saving Question");
		}

		this.savebtn.cancel();
	},
	_change_restrict_view:function()
	{
		var restriction = this.restrict_form.get("value")["restrict"];
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

		var answertext = this.answertext.get("value");

		this._store.save();
		if ( this._memorystore.data.length>0 )
		{
			for ( var key in this._memorystore.data)
			{
				if ( this._memorystore.data[key].answertext == answertext )
				{
					alert("Answer Already Exists");
					this.addanswerbtn.cancel();
					this.answertext.focus();
					return ;
				}
			}
		}

		this._store.newItem({id:PRCOMMON.utils.uuid.createUUID(),answertext:this.answertext.get("value")});
		this.new_answer_dlg.hide();
		this.addanswerbtn.cancel();
		this.answertext.set("value","");
		this._store.save();
	}
});
