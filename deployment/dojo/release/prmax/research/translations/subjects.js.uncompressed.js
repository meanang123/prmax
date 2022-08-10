require({cache:{
'url:research/translations/templates/subjects.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:44px;width:100%;overflow:hidden\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"float:left;height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_new_subject_mapping\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\"'><span>Add Mapping</span></div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_refresh\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxRefreshIcon\"'><span>Refresh</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"'></div>\r\n\t<div data-dojo-attach-point=\"link_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Subject to Keyword\"'>\r\n\t\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"' >\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"-1\",name:\"subjectid\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"subjectid\"/>\r\n\t\t\t<table width=\"500px\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"80px\">Subject</td><td  data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Keyword</td><td ><select data-dojo-attach-point=\"interestid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"interestid\",searchAttr:\"interestname\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Update\"' data-dojo-attach-event=\"onClick:_update_subject\" ></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"add_link_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Subject and Keyword\"'>\r\n\t\t<form data-dojo-attach-point=\"form2\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"' >\r\n\t\t\t<table width=\"300px\" class=\"prmaxtable\" cellpadding=\"1\" cellspacing=\"1\"  border =\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"80px\">Subject</td><td ><input data-dojo-attach-point=\"subjectname2\" data-dojo-props='style:\"width:95%\",name:\"subjectname\",type:\"text\",required:true' data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Keyword</td><td ><select data-dojo-attach-point=\"interestid2\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"interestid\",searchAttr:\"interestname\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/>\r\n\t\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Add\"' data-dojo-attach-event=\"onClick:_add_subject\" ></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n"}});
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
define("research/translations/subjects", [
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






