//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.seo.add
// Author:  Chris Hoy
// Purpose:
// Created: 22/09/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.seo.add");

dojo.require("prmax.pressrelease.seo.edit");

dojo.require("prmax.email.loadworddocument");

dojo.declare("prmax.pressrelease.seo.add",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.seo","templates/add.html"),
	constructor: function()
	{
		this._PublishCallBack = dojo.hitch(this, this._PublishCall);
		this._SaveCallBack = dojo.hitch(this, this._SaveCall);
		this._parent_call_back = null;

		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));

	},
	_Load_Word_Doc:function ( htmldata )
	{
		this.editctrl.seocontent.set("value", htmldata );
		this.dlg_load_word.hide();
	},
	postCreate:function()
	{
		this.word_ctrl.Load ( dojo.hitch(this, this._Load_Word_Doc ));
		this.inherited(arguments);

	},
	resize:function()
	{
		this.borderControl.resize ( arguments[0] ) ;
	},
	_PublishCall:function( response )
	{
		if ( response.success == "OK")
		{
			alert("SEO Release Published");
			if ( this._parent_call_back )
				this._parent_call_back( response.data );

			this.editctrl.Clear();

		}
		else
		{
			alert("Problem Publishing SEO");
		}
	},
	Load:function( parent_call_back )
	{
		this._parent_call_back = parent_call_back;
	},
	Clear:function()
	{
		this.editctrl.Clear();
	},
	_Publish:function()
	{
		if ( this.editctrl.isValid() == false )
			return;

		if ( confirm("Publish SEO Release")==true)
		{
				dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._PublishCallBack,
					url: "/emails/seorelease/save_and_publish" ,
					content: this.editctrl.seoform({})
			}));
		}
	},
	_LoadWord:function()
	{
		this.word_ctrl.Clear();
		this.dlg_load_word.show();
	},
	_Close:function ( )
	{
		this.word_ctrl.Clear();
		this.dlg_load_word.hide();
	},
	_SaveCall:function( response)
	{
		if ( response.success == "OK")
		{
			this.editctrl.set("seoreleaseid", response.data.seoreleaseid);
			if ( this._parent_call_back )
				this._parent_call_back( response.data );
			alert("SEO Saved");
		}
		else
		{
			alert("Problem Saving SEO");
		}
	},
	_Save:function()
	{
		if ( this.editctrl.isValid() == false )
			return;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveCallBack,
				url: "/emails/seorelease/save" ,
				content: this.editctrl.seoform({})
		}));
	},
	_word_html_data_event:function(html)
	{
		if ( html.sourcename == "seo_add")
		{
			this.editctrl.seocontent.set("value", html.html) ;
		}
	}
});
