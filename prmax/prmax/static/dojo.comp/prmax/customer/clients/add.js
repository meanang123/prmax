//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 13/10/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.customer.clients.add");

dojo.require("dijit.Editor");
dojo.require("prmax.customer.clients.headerimage");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.ViewSource");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.Preview");
dojo.require("prmax.customer.clients.pickcolour");
dojo.require("prcommon.clippings.questions.analysis_viewer");

dojo.declare("prmax.customer.clients.add",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		mode: "add",
		templatePath: dojo.moduleUrl( "prmax.customer.clients","templates/add.html"),
	constructor: function()
	{
		this._Save_Call_Back = dojo.hitch(this, this._Save_Call);
		this._Load_Call_Back = dojo.hitch(this, this._Load_Call);
		this._Delete_Call_Back = dojo.hitch(this, this._Delete_Call);
		this._icustomerid = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		dojo.attr( this.client_name,"innerHTML",PRMAX.utils.settings.client_name + " Short Name");

	},
	startup:function()
	{
		if (this.mode == "edit")
		{
			this.save._label = "Update";
			dojo.attr(this.save.containerNode,"innerHTML", "Update");
		}
		else
		{
			this.headerimage_left.show();
			this.headerimage_right.show();
		}
		this.inherited(arguments);

		if ( PRMAX.utils.settings.has_news_rooms == true)
		{
			dojo.removeClass(this.newsroom_avaliable,"prmaxhidden");
		}
		else
		{
			this.tab_newoom.controlButton.domNode.style.display = "none";
		}

		if ( PRMAX.utils.settings.clippings != true || this.mode != "edit")
			this.analysis_tab.controlButton.domNode.style.display = "none";

		if (this.mode != "edit")
		{
			this.frame.resize({w:700, h:567});
		}
	},
	_Add_Customer:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.save.cancel();
			return;
		}

		// Check too see if the news room fields are all present
		if (this.has_news_room.get("checked") == true )
		{
			if (this.news_room_root.get("value") =="")
			{
				alert("Not all required field filled in");
				this.save.cancel();
				this.news_room_root.focus();
				return;
			}
		}

		var content = dojo.mixin(this.form.get("value"),this.form2.get("value"));

		if (this._icustomerid != null)
			content["icustomerid"] = this._icustomerid;

		dojo.xhrPost(
		ttl.utilities.makeParams({
			load: this._Save_Call_Back,
			url:'/clients/save',
			content: content
			}));
	},
	_Save_Call:function( response )
	{
		if ( response.success == "OK" )
		{
			if (this.mode == "edit")
			{
				alert("Updated");
				this.save.cancel();
				if (this._do_parent)
					this._do_parent(2,response.data.client);
				if ( response.data.client.has_news_room)
				{
					dojo.attr(this.show_news_room_form,"action",response.data.newsroom.news_room_url);
					dojo.removeClass(this.show_new_room_url.domNode,"prmaxhidden");
				}
			}
			else
			{
				alert("Added");
				if (this._do_parent)
					this._do_parent (3,response.data.client);
				this.Clear();
			}
		}
		else if ( response.success == "DU" )
		{
			alert(response.message);
			this.clientname.focus();
		}
		else
		{
			alert("Problem");
		}

		this.save.cancel();

	},
	Load:function( clientid, parent_func )
	{
		this._do_parent = parent_func;
		this.Clear();
		if ( clientid != -1 )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._Load_Call_Back,
					url:'/clients/get',
					content: {clientid: clientid,
					extended:true}
			}));
		}
	},
	_Load_Call:function( response )
	{
		if ( response.success == "OK" )
		{
			with (response.data)
			{
				this.clientid.set("value", client.clientid );
				this.clientname.set("value", client.clientname );
				this.www.set("value", client.www );
				this.email.set("value", client.email );
				this.tel.set("value", client.tel );
				this.twitter.set("value", client.twitter );
				this.facebook.set("value", client.facebook );
				this.linkedin.set("value", client.linkedin );
				this.instagram.set("value", client.instagram );
				this.has_news_room.set("checked", client.has_news_room);
				if (newsroom)
				{
					if (client.clientid == 2014)
					{
						newsroom.news_room_url = "https://www.cardiffnewsroom.co.uk/" //live
//						newsroom.news_room_url = "http://testcardiffnewsroom.prmax.co.uk/" //test
					}
					if (client.clientid == 1966)
					{
						newsroom.news_room_url = "https://www.newyddioncaerdydd.co.uk" //live
//						newsroom.news_room_url = "http://testnewyddioncaerdydd.prmax.co.uk/" //test
					}
					this.news_room_root.set("value", newsroom.news_room_root);
					this.about_template.set("value", newsroom.about_template);
					dojo.attr(this.show_news_room_form,"action",newsroom.news_room_url);
					dojo.removeClass(this.show_new_room_url.domNode,"prmaxhidden");
					this.headerimage_left.set("value",client.clientid);
					this.headerimage_right.set("value",client.clientid);
					this.header_colour.set("value",newsroom.header_colour);
					this._new_room_show();
					this.link_1_name.set("value",newsroom.link_1.name);
					this.link_1_url.set("value",newsroom.link_1.url);
					this.link_2_name.set("value",newsroom.link_2.name);
					this.link_2_url.set("value",newsroom.link_2.url);
				}

				if (this._do_parent)
					this._do_parent (1,response.data);
				this.headerimage_left.show();
				this.headerimage_right.show();
				if ( PRMAX.utils.settings.clippings == true )
					this.analysis_ctrl.load(client.clientid);

				dojo.removeClass(this.delete_ctrl.domNode, "prmaxhidden" );
			}
		}
	},
	Clear:function()
	{
		this.clientid.set("value", -1 ) ;
		this.clientid.set("value","");
		this.clientname.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.save.cancel();
		this.clientid.set("value",-1);
		this.news_room_root.set("value", "");
		this.about_template.set("value", "");
		this.default_header_colour.set("checked", false);
		this.headerimage_left.set("value",-1);
		this.headerimage_right.set("value",-1);
		dojo.addClass(this.delete_ctrl.domNode, "prmaxhidden" );
		dojo.addClass(this.show_new_room_url.domNode,"prmaxhidden");
		this.delete_ctrl.cancel();
		this.link_1_name.set("value","");
		this.link_1_url.set("value","");
		this.link_2_name.set("value","");
		this.link_2_url.set("value","");
	},
	_Delete_Call:function ( response )
	{
		if ( response.success == "OK" )
		{
			if (this._do_parent)
				this._do_parent(3, null );
			alert("Deleted");
			this.Clear();
		}
		else if ( response.success == "DU")
		{
			alert ( "In Use");
		}
		else
		{
			alert("Problem Deleting");
		}
		this.delete_ctrl.cancel();
	},
	_Delete_Customer:function()
	{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._Delete_Call_Back,
					url:'/clients/delete',
					content: {clientid: this.clientid.get("value")}
			}));
	},
	_new_room_show:function()
	{
		if (this.has_news_room.get("checked"))
		{
			dojo.removeClass(this.news_room_details,"prmaxhidden");
			this.headerimage_left.show();
			this.headerimage_right.show();
		}
		else
		{
			dojo.addClass(this.news_room_details,"prmaxhidden");
		}
	},
	_show_new_room_url:function()
	{
		this.show_news_room_form.submit();
	},
	resize:function()
	{
		this.inherited(arguments);
		this.frame.resize(arguments[0]);
	},
	_use_default_color:function()
	{
		if (this.default_header_colour.checked)
		{
			this.header_colour.set("value", "#2e74b5")
		}
	},
	_ColourUpdate:function()
	{
		this.default_header_colour.set("checked", false);
	},
	_setIcustomeridAttr:function(value)
	{
		this._icustomerid = value;
	}
});
