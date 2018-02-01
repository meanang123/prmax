//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.distributionistemplate.template_update
// Author:  Chris Hoy
// Purpose:
// Created: 29/01/2016
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.distributiontemplate.template_update");

dojo.declare("prmax.pressrelease.distributiontemplate.template_update",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.distributiontemplate","templates/template_update.html"),
	constructor: function()
	{
		this._load_call_back = dojo.hitch(this, this._load_call);
		this._update_call_back = dojo.hitch(this, this._update_call);
		this._delete_call_back = dojo.hitch(this, this._delete_call);

		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));

	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function(distributiontemplateid, _show_update_call_back)
	{
		this._show = _show_update_call_back;
		this.distributiontemplateid.set("value",distributiontemplateid);

			dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._load_call_back,
			url:'/emails/distributiontemplates/load',
			content: {distributiontemplateid:distributiontemplateid} }));
	},
	_load_call:function(response)
	{
		if ( response.success == "OK")
		{
			with (response)
			{
				this.description.set("value",data.description);
				this.emailtemplatecontent.set("value",data.templatecontent);
				this.distributiontemplateid.set("value",data.distributiontemplateid);
			}
			this._show("show");
		}
		else
		{
			alert("Problem");
		}
	},
	clear:function()
	{
		this.description.set("value","");
		this.emailtemplatecontent.set("value","");
		this.wordtohtml.Clear();
		this.savebtn.cancel();
		this.deletebtn.cancel();
		this.distributiontemplateid.set("value","-1");
	},
	_update_template:function()
	{
		if ( ttl.utilities.formValidator(this.main_form)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}

		var content = this.main_form.get("value");
		content["templatecontent"] = this.emailtemplatecontent.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._update_call_back,
			url:'/emails/distributiontemplates/update',
			content: content }));
	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
		}
		else
		{

		}
		this.savebtn.cancel();
	},
	_delete_template:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._delete_call_back,
			url:'/emails/distributiontemplates/delete',
			content: {distributiontemplateid:this.distributiontemplateid.get("value")}}));
	},
	_delete_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._show("delete");
			this.clear();
		}
		else
		{

		}
	},
	resize:function()
	{
		var b = dojo.contentBox(this.emailtemplatecontent.domNode);

		b.h = 300;

		this.emailtemplatecontent.resize(b);

	},
	_word_html_data_event:function(html)
	{
		if (html.sourcename == "template_update")
		{
			this.emailtemplatecontent.set("value", html.html) ;
		}
	}
});






