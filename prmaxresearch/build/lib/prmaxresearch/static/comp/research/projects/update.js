//-----------------------------------------------------------------------------
// Name:    create.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/update.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dojo/date",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DateTextBox"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, topic, lang, ItemFileReadStore, DojoDate, domclass ){
 return declare("research.projects.update",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._load_call_back = lang.hitch(this, this._load_call ) ;
		this._update_call_back = lang.hitch(this, this._update_call ) ;

		this._users = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.ownerid.set("store",this._users);
		this.ownerid.set("value", -1);
	},
	load:function(researchprojectid)
	{
		request.post('/research/admin/projects/projects_get',
			utilities2.make_params({data:{researchprojectid:researchprojectid}})).then
			(this._load_call_back, this._error_call_back);
	},
	_load_call:function( response )
	{
		if ( response.success=="OK")
		{
			this.researchprojectid.set("value", response.data.researchprojectid);
			this.researchprojectname.set("value", response.data.researchprojectname);
			if (response.data.ownerid==null)
			{
				this.ownerid.set("value", -1);
			}
			else
			{
				this.ownerid.set("value", response.data.ownerid);
			}

			this.startdate.set("value", utilities2.from_object_date_no_date(response.data.startdate_json));
			this.questionnaire_completion.set("value", utilities2.from_object_date_no_date(response.data.questionnaire_completion_json));

			this.project_dlg.show();
		}
	},
	_update:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.searchbutton.cancel();
			throw "N";
		}

		var tmp = this.form.get("value");


		tmp["startdate"] = utilities2.to_json_date(this.startdate.get("value"));
		tmp["questionnaire_completion"] = utilities2.to_json_date(this.questionnaire_completion.get("value"));

		if ( confirm("Update Project"))
		{
				request.post('/research/admin/projects/projects_update',
				utilities2.make_params({data:tmp})).then
				(this._update_call_back);
		}
	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
			topic.publish("/project/update", response.data);
			this.project_dlg.hide();
		}
	}
});
});





