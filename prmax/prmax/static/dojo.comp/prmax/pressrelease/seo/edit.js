//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.seo.edit
// Author:  Chris Hoy
// Purpose:
// Created: 22/09/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.seo.edit");

dojo.require("dijit.Editor");

dojo.require("ttl.form.ValidationTextarea");
dojo.require("dijit.form.TimeTextBox");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.ViewSource");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.Preview");
dojo.require("prmax.editor.SeoImgLinkDialog");
dojo.require("prmax.editor.CollateralDialog");
dojo.require("prmax.customer.clients.add");
dojo.require("prmax.pressrelease.seo.seoimage");
dojo.require("dijit.form.CheckBox");

dojo.require("dojox.validate");


dojo.declare("prmax.pressrelease.seo.edit",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.seo","templates/edit.html"),
	constructor: function()
	{
		this._nochange = false;
		this._LoadCallBack = dojo.hitch(this,this._LoadCall);
		this._SavedCallBack = dojo.hitch(this,this._SavedCall);
		this._Client_Add_Call_Back = dojo.hitch(this, this._Client_Add_Call);
		this._call_back = null;

		this._client_data = new dojox.data.QueryReadStore (
			{url:'/clients/combo',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});
	},
	postCreate:function()
	{
		dojo.attr(this.client_name,"innerHTML", PRMAX.utils.settings.client_name);
		this.client_add_dialog.set("title",  "Add New " + PRMAX.utils.settings.client_name);

		this.clientid.store = this._client_data;
		this.clientid.set("value",-1);
		this._Client_Get_Call_Back = dojo.hitch(this, this._Client_Get_Call );

		this.inherited(arguments);
	},
	_LoadCall:function(response)
	{
		if ( response.success == "OK")
		{
			this.Load ( response.data.emailtemplateid, response.data );
		}
		else
		{

		}
	},
	_SavedCall:function(response)
	{
		if ( response.success == "OK")
		{
			this.seoreleaseid.set("value", response.data.seoreleaseid ) ;
			if (this._call_back != null )
				this._call_back ( response.data );
			alert("SEO Release Updated");
		}
		else
		{
			alert("Problem updating SEO Release");
		}
	},
	LoadDefault:function( emailtemplateid )
	{
		this.emailtemplateid.set("value",emailtemplateid);
	},
	LoadSeo:function( seoreleaseid, _call_back )
	{
		this._call_back = _call_back ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url: "/emails/seorelease/get" ,
				content: {seoreleaseid:seoreleaseid}
		}));
	},
	Load:function( emailtemplateid, data )
	{
		this.LoadDefault(emailtemplateid);
		this._Load ( data ) ;
	},
	_Load:function ( data )
	{
		this._nochange = true;

		for ( var x = 1 ; x < 26 ; x++ )
			this["cat_" + x].set("value",data["cat_" + x]);

		this.clientid.set("value", ( data.clientid == null ) ? -1 : data.clientid );
		this._nochange = false;
		this.seocontent.set("value", data.content);
		this.emailtemplateid.set("value",data.emailtemplateid);
		this.seoreleaseid.set("value",data.seoreleaseid);
		this.headline.set("value",data.headline);
		this.synopsis.set("value",data.synopsis);
		this.companyname.set("value",data.companyname);
		this.www.set("value", data.www);
		this.email.set("value", data.email );
		this.tel.set("value", data.tel );
		this.twitter.set("value", data.twitter ) ;
		this.facebook.set("value", data.facebook);
		this.linkedin.set("value", data.linkedin);
		this.keywords.set("value",data.keywords);
		this.seoimage.set("value", (data.seoimageid==null)?-1:data.seoimageid);
	},
	Save:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		if ( this.synopsis.get("value").length>254)
		{
			alert("Synopsis too long");
			return false;
		}

		var content = this.form.get("value");
		content["content"] = this.seocontent.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SavedCallBack,
				url: "/emails/seorelease/save" ,
				content: content
			}));

		return true;
	},
	Clear:function()
	{
		this.emailtemplateid.set("value","-1");
		this.seoreleaseid.set("value", "-1")
		this.headline.set("value","");
		this.synopsis.set("value","");
		this.companyname.set("value","");
		this.keywords.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.seocontent.set("value", "");
		this.clientid.set("value",-1);
		this.seoimage.set("value",-1);

		for ( var x = 1 ; x < 26 ; x++ )
			this["cat_" + x].set("value",false);

	},
	resize:function()
	{
		this.frame.resize ( arguments[0] ) ;
	},
	isValid:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		return true;
	},
	seoform:function ( inData )
	{
		var content = this.form.get("value");

		content["content"] = this.seocontent.get("value");

		return dojo.mixin ( inData , content );
	},
	_Client_Get_Call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.www.set("value",response.data.www);
			this.email.set("value",response.data.email);
			this.tel.set("value",response.data.tel);
			this.twitter.set("value",response.data.twitter);
			this.facebook.set("value",response.data.facebook);
			this.linkedin.set("value",response.data.linkedin);
			this.companyname.set("value",response.data.clientname);
		}
	},
	_ChangeClient:function()
	{
		var clientid = this.clientid.get("value");

		if ( clientid != -1 && this._nochange == false )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._Client_Get_Call_Back,
					url: "/clients/get" ,
					content: {clientid : clientid}
				}));
		}
	},
	_Client_Add_Call:function(action, data )
	{
		if ( action == 2 )
		{
			this.clientid.set("value", data.clientid );
			this.client_add_dialog.hide();
		}
	},
	_New_Client:function()
	{
		this.client_add_ctrl.Load(-1, this._Client_Add_Call_Back);
		this.client_add_dialog.show();
	},
	_setSeoreleaseidAttr:function( seoreleaseid )
	{
		this.seoreleaseid.set("value", seoreleaseid ) ;
	}
});
