//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.questions
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.questions.analysis_viewer");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.form.RadioButton");

dojo.require("prcommon.clippings.questions.add");
dojo.require("prcommon.clippings.questions.selectquestion");

dojo.declare("prcommon.clippings.questions.analysis_viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.questions","templates/analysis_viewer.html"),
	constructor: function()
	{
		this._questions = new dojox.data.JsonRestStore( {target:"/clippings/analyse/list_by_source", idAttribute:"clippingsanalysistemplateid"});
		this._clientid=null;
		this._issueid=null;
		this._menu_item=null;
		this._is_load=false;
		dojo.subscribe("/clippings/question/analysis", dojo.hitch(this,this._new_question_event));
		dojo.subscribe("/clippings/question/analysis/select", dojo.hitch(this, this._selected_question_event));
		this._remove_question_call_back = dojo.hitch(this, this._remove_question_call);
	},
	view1:{noscroll: false,
		cells: [[
			{name: ' ',styles: 'text-align: center;', width: "15px",formatter:ttl.utilities.format_row_ctrl},
			{name: 'Name',width: "250px",field:'questiontext'},
			{name: 'Type',width: "100px",field:'questiondescription'}
			]]
	},
	postCreate:function()
	{

		this.viewer_grid.set("structure",this.view1 );
		this.viewer_grid["onRowClick"] = dojo.hitch(this, this._on_row_click );
		this.viewer_grid.canSort = function(){return false};

		this.inherited(arguments);

	},
	_on_row_click:function(e)
	{
		var row = this.viewer_grid.getItem(event.rowIndex);
		if ( row )
		{
			this._row = row;
			if (this._menu_item==null)
			{
				this._menu_item = new dijit.Menu();
				this._menu_item.addChild(new dijit.MenuItem({label:"Remove", onClick:dojo.hitch(this,this._remove_question)}));
			}
			this._menu_item._openMyself(e);
		}
	},
	_remove_question:function()
	{
		if ( confirm ( "Remove " + this._row.questiontext + " from analysis?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._remove_question_call_back,
				url:'/clippings/analyse/remove_question',
				content: {clippingsanalysistemplateid:this._row.clippingsanalysistemplateid}}));
		}
	},
	_remove_question_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._questions.deleteItem( this._row );
		}
	},
	resize:function()
	{
		this.border_control.resize(arguments[0]);
	},
	load:function(clientid, issueid)
	{
		if (this._is_load==false)
		{
			this.viewer_grid._setStore (this._questions);
			this._is_load=true;
		}

		var content = {};

		if (clientid != null)
			content["clientid"] = clientid;
		if (issueid != null)
			content["issueid"] = issueid;

		this.viewer_grid.setQuery(ttl.utilities.getPreventCache(content));
		this._clientid=clientid;
		this._issueid=issueid;
		this.add_new_question_ctrl.load(this._clientid, this._issueid);
		this.select_question_ctrl.load(this._clientid, this._issueid);
	},
	_new_question:function()
	{
		this.add_new_question_ctrl.clear();
		this.add_new_question_dlg.show();
	},
	_select_question:function()
	{
		this.select_question_dlg.show();
	},
	_new_question_event:function(analysis,clientid,issueid)
	{
		if (this._clientid === clientid || this._issueid === issueid)
		{
			this._questions.newItem(analysis);
		}
		this.add_new_question_dlg.hide();
		this.select_question_dlg.hide();
	},
	_selected_question_event:function(question)
	{
		this._questions.newItem(question);
		this.select_question_dlg.hide();

	}
});
