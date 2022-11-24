//-----------------------------------------------------------------------------
// Name:    subjects.js
// Author:  Chris Hoy
// Purpose:
// Created: 21/05/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../translations/templates/subjects.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojox/data/JsonRestStore",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/Dialog",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/ValidationTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic,  lang, domattr, domclass, JsonRestStore ){
 return declare("research.translations.subjects",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.model =  new Observable( new JsonRest( {target:'/research/admin/subjects/list', idProperty:"subjectid"}));
		this._store = new JsonRestStore( {target:'/research/admin/interests/list', idProperty:"interestid"});

		this._add_subject_call_back = lang.hitch(this,this._add_subject_call );
		this._delete_subject_call_back = lang.hitch(this,this._delete_subject_call ) ;
		this._update_subject_call_back =lang.hitch(this, this._update_subject_call);
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Subject', className:"standard",field:"subjectname"},
			{label: 'Interest', className:"standard",field:"interestname"},
			{label: ' ', field:"delete", className:"grid-field-image-view", formatter:utilities2.delete_row_ctrl},
		];

		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model,
			query: {}
		});

		this.grid_view.set("content", this.grid);
		this.grid.on(" .dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.interestid2.set("store",this._store);
		this.interestid.set("store",this._store);

		this.inherited(arguments);
	},
	_on_cell_call:function ( e )
	{
		var cell = this.grid.cell(e);

		if ( cell == null ) return ;


		if ( cell.column.field == "delete" )
		{
			if ( confirm("Delete Subject"))
			{
				request.post('/research/admin/subjects/delete_subject',
					utilities2.make_params({ data: {subjectid:cell.row.data.subjectid}} )).then
					(this._delete_subject_call_back);
			}
		}
		else
		{
			// edit
			domattr.set(this.heading,"innerHTML",cell.row.data.subjectname);
			this.interestid.set("value",cell.row.data.interestid);
			this.subjectid.set("value",cell.row.data.subjectid);
			this.link_dlg.show();
		}
	},
	_delete_subject_call:function( response)
	{
		if ( response.success == "OK")
		{
			this.model.remove(response.subjectid);
			alert("Subject Deleted");
		}
		else
		{
			alert("Problem Deleting Subject");
		}

	},
	_new_subject_mapping:function()
	{
		this._add_clear();
		this.add_link_dlg.show();
	},
	_refresh:function()
	{
		this.grid.set("query",{});
	},
	_update_subject:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if ( confirm("Update Subject Interest Mapping"))
		{
			request.post('/research/admin/subjects/add_mapping',
					utilities2.make_params({ data: this.form.get("value")} )).then
					(this._update_subject_call_back);
		}
	},
	_update_subject_call:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Updated");
			this.model.put(response.data);
			this.link_dlg.hide();
		}
		else
		{
			alert("Problem Updating Mapping");
		}
	},
	_add_subject:function()
	{
		if ( utilities2.form_validator(this.form2)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if ( confirm("Add Subject Interest Mapping"))
		{
			request.post('/research/admin/subjects/add_mapping',
					utilities2.make_params({ data: this.form2.get("value")} )).then
					(this._add_subject_call_back);
		}
	},
	_add_subject_call:function ( response )
	{
		if ( response.success == "OK")
		{
			alert("Updated");
			this.model.put(response.data);
			this.add_link_dlg.hide();
			this._add_clear();
		}
		else if ( response.success == "DU")
		{
				alert("Subject Exists");
				this.subjectname2.focus();
		}
		else
		{
			alert("Problem Adding Mapping");
		}
	},
	_add_clear:function()
	{
		this.subjectname2.set("value","");
		this.interestid2.set("value",null);
	}
});
});






