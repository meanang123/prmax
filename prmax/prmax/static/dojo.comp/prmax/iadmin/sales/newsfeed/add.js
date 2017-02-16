//-----------------------------------------------------------------------------
// Name:    prmax.iadmin.sales.newsfeed.add
// Author:  Chris Hoy
// Purpose:
// Created: 06/01/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.sales.newsfeed.add");

dojo.require( "ttl.BaseWidget");
dojo.require( "ttl.form.ValidationTextarea");

dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.ViewSource");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("prmax.editor.TtlImgLinkDialog");
dojo.require("prmax.editor.CollateralDialog");
dojo.require("dojox.editor.plugins.Preview");

dojo.declare("prmax.iadmin.sales.newsfeed.add", [ ttl.BaseWidget ], {
	templateString: dojo.cache( "prmax","iadmin/sales/newsfeed/templates/add.html"),
	constructor:function()
	{

		this._newsfeedtypes = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=newsfeedtypes',onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
		this._add_news_call_back = dojo.hitch(this, this._add_news_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.newsfeedtypeid.set("store", this._newsfeedtypes);
		this.newsfeedtypeid.set("value", 1);
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	Load:function( _dialog,  _model)
	{
		this._dialog = _dialog;
		this._model = _model;
		this._Clear();
		this._dialog.show();
	},
	_Clear:function()
	{
		this.addbtn.cancel();
		this.subject.set("value", "");
		this.summary.set("value", "");
		this.newsfeedtypeid.set("value", 1);
		this.embargo.set("value", new Date());
		this.expire.set("value", new Date());
		this.newscontent.set("value", "");
	},
	_add_news_call:function( response )
	{
		if ( response.success == "OK")
		{
			this._model.newItem(response.news);
			alert("News Added");
			this._dialog.hide();
			this._Clear();
		}
		else
		{
			alert("problem adding news");
		}
		this.addbtn.cancel();
	},
	_AddNews:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		var content = this.form.get("value");

		content["embargo"] = ttl.utilities.toJsonDate ( this.embargo.get("value") ) ;
		content["expire"] = ttl.utilities.toJsonDate ( this.expire.get("value") ) ;
		content["newscontent"] = this.newscontent.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._add_news_call_back,
			url:'/iadmin/newsfeed/add',
			content:content}));
	}
});