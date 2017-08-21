//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.questions.globalsetup
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.questions.globalsetup");

dojo.declare("prcommon.clippings.questions.globalsetup",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.questions","templates/globalsetup.html"),
	constructor: function()
	{
		this._questions = new dojox.data.JsonRestStore( {target:"/clippings/analyse/global_analysis", idAttribute:"clippingsanalysistemplateid"});

		this._update_global_template_back = dojo.hitch(this, this._update_global_template);
		this._remove_question_call_back = dojo.hitch(this, this._remove_question_call);
		this._menu_item_std = null;

		dojo.subscribe("/clippings/question/global/add", dojo.hitch(this,this._add_question_event));
		dojo.subscribe("/clippings/question/global/select", dojo.hitch(this,this._update_question_event));

	},
	postCreate:function()
	{
		this.viewer_grid.set("structure",this.view1 );
		this.viewer_grid._setStore ( this._questions ) ;
		this.viewer_grid["onRowClick"] = dojo.hitch(this, this._on_row_click);

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
				}
				this._menu_item_std._openMyself(e);
			}
		}
	},
	resize:function()
	{
		this.border_control.resize(arguments[0]);
	},
	_new_question:function()
	{
		this.add_new_question_ctrl.clear();
		this.add_new_question_dlg.show();
	},
	_select_question:function()
	{
		this.select_question_ctrl.clear();
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
	view1:{noscroll: false,
		cells: [[
		{name: ' ',styles: 'text-align: center;', width: "15px",formatter:ttl.utilities.format_row_ctrl},
			{name: 'Name',width: "350px",field:'questiontext'},
			{name: 'Type',width: "100px",field:'questiondescription'}
			]]
	},
	_add_question_event:function(question)
	{
		this._questions.newItem(question);
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._update_global_template_back,
			url:'/clippings/analyse/add_question_to_analysis',
			content: {questionid:question.questionid}}));

	},
	_update_global_template:function(response)
	{
		this.add_new_question_dlg.hide();
	},
	_remove_question:function()
	{
		if ( confirm ( "Remove " + this._row.questiontext + " from analysis?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._remove_question_call_back,
				url:'/clippings/analyse/delete_question_to_analysis',
				content: {clippingsanalysistemplateid:this._row.clippingsanalysistemplateid}}));
		}
	},
	_remove_question_call:function(response)
	{
		if ( response.success=="OK")
		{
			if (response.msg)
			{
				alert(response.msg);
				this._questions.deleteItem(this._row);
			}
			else
			{
				this._questions.deleteItem(this._row);
			}
		}
		else
		{
			alert("Problem");
		}
	},
	_update_question_event:function(question)
	{
		this._questions.newItem(question);
		this.select_question_dlg.hide();
	}
});
