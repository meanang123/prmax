//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.questions.selectquestion
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.questions.selectquestion");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");

dojo.declare("prcommon.clippings.questions.selectquestion",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.questions","templates/selectquestion.html"),
	publish_path:"/clippings/question/analysis",
	globalonly:false,
	constructor: function()
	{
		this._questions = new dojox.data.JsonRestStore( {target:"/clippings/questions/list_by_source", idAttribute:"questionid"});
		this._save_call_back = dojo.hitch (this, this._save_call);
	},
	postCreate:function()
	{
		this.questionid.set("store", this._questions);
		this.inherited(arguments);
		if (this.globalonly==true)
		{
			var query={globalonly:1};
			this.savebtn.cancel();
			this.questionid.set("query", query);
			this.questionid.set("value", null);

		}
	},
	load:function(clientid,issueid)
	{
		this.clientid.set("value", clientid);
		this.issueid.set("value", issueid);
		this._clientid = clientid;
		this._issueid = issueid;

		var query={};
		if (clientid!=null)
			query["iclientid"]=clientid;
		if (issueid!=null)
			query["iissueid"]=issueid;

		this.savebtn.cancel();
		this.questionid.set("query", query);
		this.questionid.set("value", null);
	},
	_save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/clippings/analyse/add_question_to_analysis',
			content: this.form.get("value")}));
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish(this.publish_path, [response.data,this._clientid,this._issueid]);
		}
		else
		{
			alert("Problem");
		}
		this.savebtn.cancel();
	},
	clear:function()
	{
		if (this.globalonly==true)
		{
			var query={globalonly:1};
			this.savebtn.cancel();
			this.questionid.set("query", query);
			this.questionid.set("value", null);

		}
	}
});
