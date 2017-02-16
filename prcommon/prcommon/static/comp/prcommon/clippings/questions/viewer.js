//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.questions
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.questions.viewer");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");

dojo.require("prcommon.clippings.questions.add");
dojo.require("prcommon.clippings.questions.edit");

dojo.declare("prcommon.clippings.questions.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.questions","templates/viewer.html"),
	constructor: function()
	{
		this._questions = new dojox.data.JsonRestStore( {target:"/clippings/questions/list_by_source", idAttribute:"questionid"});
		this._menu_item_std = null;
		this._menu_item_deleted = null;

		dojo.subscribe("/clippings/question/global", dojo.hitch(this,this._add_question_event));
		dojo.subscribe("/clippings/question/update", dojo.hitch(this,this._update_question_event));

		this._remove_question_call_back = dojo.hitch(this, this._remove_question_call);
		this._restore_question_call_back = dojo.hitch(this, this._restore_question_call);
		this._show_edit_call_back = dojo.hitch(this, this._show_edit);
	},
	view1:{noscroll: false,
		cells: [[
			{name: ' ',styles: 'text-align: center;', width: "15px",formatter:ttl.utilities.formatRowCtrl},
			{name: 'Name',width: "250px",field:'questiontext'},
			{name: 'Type',width: "100px",field:'questiondescription'},
			{name: 'Scope',width: "100px",field:'scopetype'},
			{name: 'Description',width: "100px",field:'scopename'},
			{name: 'Status',width:"80px",field:'has_been_deleted'}
			]]
	},
	postCreate:function()
	{
		this.viewer_grid.set("structure",this.view1 );
		this.viewer_grid._setStore ( this._questions ) ;
		this.viewer_grid["onRowClick"] = dojo.hitch(this, this._on_row_click );

		this.inherited(arguments);
	},
	_on_row_click:function(e)
	{
		var row = this.viewer_grid.getItem(event.rowIndex);
		if ( row )
		{
			this._row = row;
			if ( this._row.has_been_deleted == "Deleted")
			{
				if (this._menu_item_deleted==null)
				{
					this._menu_item_deleted = new dijit.Menu();
					this._menu_item_deleted.addChild(new dijit.MenuItem({label:"Restore", onClick:dojo.hitch(this,this._restore_question)}));
				}
				this._menu_item_deleted._openMyself(e);
			}
			else
			{
				if (this._menu_item_std==null)
				{
					this._menu_item_std = new dijit.Menu();
					this._menu_item_std.addChild(new dijit.MenuItem({label:"Remove", onClick:dojo.hitch(this,this._remove_question)}));
					this._menu_item_std.addChild(new dijit.MenuItem({label:"Edit", onClick:dojo.hitch(this,this._edit_question)}));
				}
				this._menu_item_std._openMyself(e);
			}
		}
	},
	_restore_question:function()
	{
		if ( confirm ( "Restore " + this._row.questiontext + " from analysis?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._restore_question_call_back,
				url:'/clippings/questions/restore_question',
				content: {questionid:this._row.questionid}}));
		}
	},
	_restore_question_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._questions.setValue(this._row,"has_been_deleted","");
			this.details_view.selectChild(this.blank);
		}
		else
		{
			alert("Problem");
		}
	},
	_remove_question:function()
	{
		if ( confirm ( "Remove " + this._row.questiontext + " from analysis?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._remove_question_call_back,
				url:'/clippings/questions/remove_question',
				content: {questionid:this._row.questionid}}));
		}
	},
	_edit_question:function()
	{
		this.edit_question_ctrl.load(this._row.questionid, this._show_edit_call_back);
	},
	_show_edit:function()
	{
		this.details_view.selectChild(this.edit_question_ctrl);
	},
	_remove_question_call:function(response)
	{
		if ( response.success=="OK")
		{
			if (response.msg)
			{
				alert(response.msg);
				this._questions.setValue(this._row,"has_been_deleted","Deleted");
				this.details_view.selectChild(this.blank);
			}
			else
			{
				this._questions.deleteItem(this._row);
				this.details_view.selectChild(this.blank);
			}
		}
		else
		{
			alert("Problem");
		}
	},
	resize:function()
	{
		this.border_control.resize(arguments[0]);
	},
	load:function( sourcetypeid, objectid)
	{
		this.viewer_grid.setQuery(ttl.utilities.getPreventCache({sourcetypeid:sourcetypeid}));
	},
	_new_question:function()
	{
		this.details_view.selectChild(this.blank);
		this.add_new_question_ctrl.clear();
		this.add_new_question_dlg.show();
	},
	_add_question_event:function(question)
	{
		this._questions.newItem(question);
		this.add_new_question_dlg.hide();
		this.details_view.selectChild(this.blank);
	},
	_update_question_event:function(question)
	{
		this._questions.setValue(this._row,"questiontext",question.questiontext);
		this._questions.setValue(this._row,"questiondescription",question.questiondescription);
		this._questions.setValue(this._row,"scopetype",question.scopetype);
		this._questions.setValue(this._row,"scopename",question.scopename);
		this._questions.setValue(this._row,"has_been_deleted",question.has_been_deleted);
	}
});
