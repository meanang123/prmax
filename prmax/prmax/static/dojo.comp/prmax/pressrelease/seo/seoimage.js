//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.seo.seoimage
// Author:  Chris Hoy
// Purpose:
// Created: 18/10/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.seo.seoimage");

dojo.require("dojo.io.iframe");

dojo.declare("prmax.pressrelease.seo.seoimage",
	[ ttl.BaseWidget],
	{
	name:"seoimageid",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.seo","templates/seoimage.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch ( this, this._AddedCall );
		this._ErrorCallBack = dojo.hitch ( this, this._ErrorCall );

		dojo.subscribe("/seo/thumbnail", dojo.hitch ( this, this._image_reloaded_call ));

	},
	_image_reloaded_call:function()
	{
		dojo.attr(this.seoimagepreview,"src", "/emails/seorelease/load_seo_thumbnail");
		dojo.attr(this.seoimageid,"value","-2");
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	resize:function()
	{
		this.borderControl.resize ( arguments[0] ) ;
	}
	,
	_UpLoad:function()
	{
		if (this.seoimage_file.value.length == 0 )
		{
			this.seoimage_file.focus();
			return ;
		}

		var fileName = this.seoimage_file.value;
		var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
		if( ext != "jpg" && ext != "gif" && ext != "png")
			{
				alert("Upload png, jpg, gif files only");
				this.seoimage_file.focus();
				return ;
			}

		this.saveNode.set("disabled",true);
		this.seoimage_cache.value = new Date().valueOf();

		dojo.io.iframe.send(
		{
			url: "/emails/seorelease/thumbnail_image_load",
			handleAs:"json",
			load: this._AddedCallback,
			form: this.upload_form,
			error:this._ErrorCallBack
		});
	},
	_ErrorCall:function(response, ioArgs)
	{
		alert("Problem Uploading Image");
		this._Clear();
	},
	_AddedCall:function( response )
	{
		if (response.success=="OK")
		{
			this._Clear();
			this.load_image_dialog.hide();
			dojo.attr(this.seoimagepreview,"src", "/emails/seorelease/load_seo_thumbnail");
			dojo.attr(this.seoimageid,"value","-2");
			this.enableControls(true);
		}
		else if (response.success=="FA")
		{
			alert(response.message);
			this._Clear();

		}
		else
		{
			alert("Problem Uploading Image Document");
			this._Clear();
		}
	},
	_ShowLoad:function()
	{
		this.load_image_dialog.show();
	},
	_Clear:function()
	{
		dojo.attr(this.seoimagepreview,"src", "");
		dojo.attr(this.seoimageid,"value","-1");
		this.enableControls(false);
		this.saveNode.set("disabled", false);
	},
	isValid:function()
	{
		return true;
	},
	_setValueAttr:function( value )
	{
		dojo.attr(this.seoimageid,"value",value);
		this.enableControls ( ( value == "-1" || value == -1 ) ? false : true );
		if (parseInt(value) > 0 )
			dojo.attr(this.seoimagepreview,"src", "/emails/seorelease/thumbnail_image?seoimageid=" + value );
		else
			dojo.attr(this.seoimagepreview,"src", "" );
	},
	_getValueAttr:function()
	{
		return dojo.attr(this.seoimageid,"value");
	},
	enableControls:function( enable )
	{
		if ( enable )
		{
			dojo.removeClass(this.clearbtn.domNode,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.clearbtn.domNode,"prmaxhidden");
		}
	}
});
