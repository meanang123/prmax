//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.newrelease
// Author:  Chris Hoy
// Purpose: To Select and existing release and then start the release wizard
// Created: 09/03/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.newrelease");

dojo.declare("prmax.pressrelease.newrelease",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/newrelease.html"),
	constructor: function()
	{
		this._SavedCall = dojo.hitch(this,this._Saved);
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._change_client_enabled=true;
	},
	postCreate:function()
	{
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");
		this.issueid.set("store", this._issues);
		this.issueid.set("value", "-1" );

		this.inherited(arguments);

		dojo.attr(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		dojo.attr(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);

		if (PRMAX.utils.settings.crm)
			dojo.removeClass(this.issue_view,"prmaxhidden");
	},
	_Cancel:function()
	{
		this.hide();
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SavedCall,
				url: "/emails/templates_add" ,
				content: this.form.get("value")
			}));
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.PressReleaseStart, [response.data]) ;
			this.hide();
			this._Clear();
		}
		else if (response.success=="DU")
		{
			alert("Press Release Name Already Exists");
			this.emailtemplatename.focus();
		}
		else if (response.success=="VF")
		{
			alert( "Press Release: " + response.error_message[0][1]);
			this.emailtemplatename.focus();
		}
		else
		{
			alert("Problem with Press Release");
			this.emailtemplatename.focus();
		}
		this.saveNode.cancel();
	},
	_Clear:function()
	{
		this.emailtemplatename.set("value",null);
		this._change_client_enabled = false;
		this.clientid.set("value",  "-1");
		this.issueid.set("value",  "-1");
		this._change_client_enabled = false;

		this.saveNode.cancel();
	},
	show:function()
	{
		this._Clear();
		this.dlg.show();
	},
	hide:function()
	{
		this.dlg.hide();
		this._Clear();
	},
	_client_change:function()
	{
		if (PRMAX.utils.settings.crm)
		{
			var clientid = this.clientid.get("value");
			if (clientid == undefined)
				clientid = -1;

			this.issueid.set("query",{ clientid: clientid});
			if (this._change_client_enabled==true)
			{
				this.issueid.set("value",null);
			}

			this._change_client_enabled = true ;
		}
	}
});
