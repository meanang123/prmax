//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.distributiontemplate.template_add
// Author:  Chris Hoy
// Purpose:
// Created: 29/01/2016
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.distributiontemplate.template_add");

dojo.require("prmax.email.loadworddocument");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.ViewSource");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.Preview");
dojo.require("prmax.email.TtlImgLinkDialog");


dojo.declare("prmax.pressrelease.distributiontemplate.template_add",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.distributiontemplate","templates/template_add.html"),
	s_distributiontemplatetypeid:1,
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this, this._save_call);
		this._show = null;
		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.distributiontemplatetypeid.set("value", this.s_distributiontemplatetypeid);
		//this.resize();
	},
	load:function(show_function, distributiontemplatetypeid )
	{
		this._show = show_function;
		this.distributiontemplatetypeid.set("value", distributiontemplatetypeid);
	},
	clear:function()
	{
		this.description.set("value","");
		this.emailtemplatecontent.set("value","");
		this.wordtohtml.Clear();
		this.savebtn.cancel();
	},
	_add_template:function()
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
			load: this._save_call_back,
			url:'/emails/distributiontemplates/add',
			content: content }));
	},
	_save_call:function(response)
	{
		if (response.success=="OK")
		{
			this._show("hide",response.data);
			this.clear();
		}
		else if (response.success=="DU")
		{
			alert("Already Exists");
			this.description.focus();
		}
		else
		{
			alert("Problem");
		}
		this.savebtn.cancel();
	},
	resize:function()
	{
		var b = dojo.contentBox(this.emailtemplatecontent.domNode);
		b.h = 300;

		this.emailtemplatecontent.resize ( b ) ;
	},
	_word_html_data_event:function(html)
	{
		if ( html.sourcename == "template_add")
		{
			this.emailtemplatecontent.set("value", html.html) ;
		}
	}
});






