//-----------------------------------------------------------------------------
// Name:    prmax.iadmin.sales.newsfeed.edit
// Author:  Chris Hoy
// Purpose:
// Created: 06/01/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.sales.newsfeed.edit");

dojo.require( "ttl.BaseWidget");

dojo.declare("prmax.iadmin.sales.newsfeed.edit", [ ttl.BaseWidget ], {
	templateString: dojo.cache( "prmax","iadmin/sales/newsfeed/templates/edit.html"),
	constructor:function()
	{
		this._load_news_call_back = dojo.hitch(this, this._load_news_call);
		this._update_news_call_back = dojo.hitch(this, this._update_news_call);
		this._newsfeedtypes = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=newsfeedtypes',onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
	},
	postCreate:function()
	{

		this.inherited(arguments);
		this.newsfeedtypeid.set("store", this._newsfeedtypes);
		this.newsfeedtypeid.set("value", 1);

	},
	_load_news_call:function( response )
	{
		if (response.success == "OK")
		{
			with(response)
			{
				this.newsfeedid.set("value", news.newsfeedid);
				this.subject.set("value", news.subject);
				this.summary.set("value", news.summary);
				this.newsfeedtypeid.set("value", news.newsfeedtypeid);

				this.embargo.set("value", ttl.utilities.fromObjectDate(news.embargo));
				this.expire.set("value", ttl.utilities.fromObjectDate(news.expire));
				this.newscontent.set("value", news.newscontent);
			}
			this._show_call(1, null);
		}
	},
	Load:function( newsfeedid, _show_call)
	{
		this._show_call = _show_call;
		this.Clear();
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._load_news_call_back,
			url:'/iadmin/newsfeed/get',
			content:{newsfeedid:newsfeedid}}));
	},
	Clear:function()
	{
		this.updbtn.cancel();
		this.subject.set("value", "");
		this.summary.set("value", "");
		this.newsfeedtypeid.set("value", 1);
		this.embargo.set("value", new Date());
		this.expire.set("value", new Date());
		this.newscontent.set("value", "");
	},
	_update_news_call:function(response)
	{
		if ( response.success == "OK")
		{
			this._show_call(2, response.news);
			alert("News Item Updated");
		}
		else
		{
			alert("Problem Updating");
		}

		this.updbtn.cancel();

	},
	_UpdateNews:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			return false;
		}

		var content = this.form.get("value");

		content["embargo"] = ttl.utilities.toJsonDate ( this.embargo.get("value") ) ;
		content["expire"] = ttl.utilities.toJsonDate ( this.expire.get("value") ) ;
		content["newscontent"] = this.newscontent.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._update_news_call_back,
			url:'/iadmin/newsfeed/update',
			content:content}));
	},
	resize:function()
	{
		this.frame.resize( arguments[0]);

		this.inherited(arguments);
	}
});
