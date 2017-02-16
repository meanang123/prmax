//-----------------------------------------------------------------------------
// Name:    prmax.lists.NewListDlg
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.projects.newproject");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.projects.newproject",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.projects","templates/newproject.html"),
	constructor: function()
	{
		this.callback = null;
		this._listid = -1;
		this._SavedCall = dojo.hitch(this,this._Saved);
	},
	postCreate:function()
	{
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._SubmitAdd));
	},
	_Save:function()
	{
		this.form.submit();
	},
	_Cancel:function()
	{
		this.hide();
	},

	_SubmitAdd:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}
		console.log(content);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCall,
						url:"/projects/addnew",
						content: this.form.get("value")
						})	);
	},
	_Saved:function(response)
	{
		console.log("_AddProject",response);

		if (response.success=="OK")
		{
				dojo.publish(PRCOMMON.Events.Project_Add,[response.project]);
				alert("Project Added");
				this.hide();
		}
		else if (response.success=="DU")
		{
			alert("Project Already Exists");
			this.projectname.focus();
			this.saveNode.cancel();
		}
		else if (response.success=="VF")
		{
			alert( "Project Name: " + response.error_message[0][1]);
			this.projectname.focus();
		}
		else
		{
			alert("Problem with Project");
			this.projectname.focus();
		}

		this.saveNode.cancel();
	},
	 destroy: function()
	 {
		this.inherited(arguments);
	},
	show:function()
	{
		this.saveNode.cancel();
		this.projectname.set("value",null);
		this.projectname.focus();
		this.dlg.show();
	},

	hide:function()
	{
		this.dlg.hide();
		this.saveNode.cancel();
	}
});
