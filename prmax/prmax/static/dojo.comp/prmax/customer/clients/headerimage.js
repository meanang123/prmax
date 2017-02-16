//-----------------------------------------------------------------------------
// Name:    prmax.customer.client.headerimage
// Author:  Chris Hoy
// Purpose:
// Created: 11/06/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.customer.clients.headerimage");

dojo.require("dojo.io.iframe");

dojo.declare("prmax.customer.clients.headerimage",
	[ ttl.BaseWidget],
	{
	name:"",
	imagetypeid:1,
	title:"",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.customer.clients","templates/headerimage.html"),
	constructor: function()
	{
		this._added_call_back = dojo.hitch ( this, this._added_call );
		this._error_call_back = dojo.hitch ( this, this._error_call );

		dojo.subscribe("/clients/headerimage", dojo.hitch ( this, this._image_reloaded_call ));

	},
	_image_reloaded_call:function()
	{
		dojo.attr(this.headerimagepreview,"src", "/clients/load_image");
		dojo.attr(this.headerimageid,"value","-2");
	},
	postCreate:function()
	{
		this.inherited(arguments);
		dojo.attr(this.f_imagetypeid,"value",this.imagetypeid);
	},
	show:function()
	{
		this.inherited(arguments);
		this.borderControl.resize( {h:80,w:450}  ) ;
	},
	resize:function()
	{
		this.borderControl.resize( {h:80,w:450}  ) ;
	},
	_up_load:function()
	{
		if (this.headerimage_file.value.length == 0 )
		{
			this.headerimage_file.focus();
			return ;
		}

		var fileName = this.headerimage_file.value;
		var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
		if( ext != "jpg" && ext != "gif" && ext != "png")
			{
				alert("Upload png, jpg, gif files only");
				this.headerimage_file.focus();
				return ;
			}

		this.save_node.set("disabled",true);
		this.headerimage_cache.value = new Date().valueOf();

		dojo.io.iframe.send(
		{
			url: "/clients/header_load",
			handleAs:"json",
			load: this._added_call_back,
			form: this.upload_form,
			error:this._error_call_back
		});
	},
	_error_call:function(response, ioArgs)
	{
		alert("Problem Uploading Image");
		this._clear();
	},
	_added_call:function( response )
	{
		if (response.success=="OK")
		{
			this._clear();
			this.load_image_dialog.hide();
			dojo.attr(this.headerimagepreview,"src", "/clients/load_header_temp?imagetypeid=" + this.imagetypeid);
			dojo.attr(this.headerimageid,"value","-2");
			dojo.attr(this.f_imagetypeid,"value",this.imagetypeid);
			this.enable_controls(true);
		}
		else if (response.success=="FA")
		{
			alert(response.message);
			this._Clear();

		}
		else
		{
			alert("Problem Uploading Image");
			this._Clear();
		}
	},
	_show_load:function()
	{
		this.load_image_dialog.show();
	},
	_clear:function()
	{
		dojo.attr(this.headerimagepreview,"src", "");
		dojo.attr(this.headerimageid,"value","-1");
		this.enable_controls(false);
		this.save_node.set("disabled", false);
	},
	isValid:function()
	{
		return true;
	},
	_setValueAttr:function( value )
	{
		dojo.attr(this.headerimageid,"value",value);
		this.enable_controls ( ( value == "-1" || value == -1 ) ? false : true );
		if (parseInt(value) > 0 )
			dojo.attr(this.headerimagepreview,"src", "/clients/header_image?clientid=" + value + "&imagetypeid=" + this.imagetypeid );
		else
			dojo.attr(this.headerimagepreview,"src", "" );
	},
	_getValueAttr:function()
	{
		return dojo.attr(this.headerimageid,"value");
	},
	enable_controls:function( enable )
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
