//-----------------------------------------------------------------------------
// Name:    prcommon.newsrooms.viewer.js
// Author:
// Purpose:
// Created: March 2018
//
// To do:
// Update file will be required
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.newsrooms.viewer");


dojo.require("ttl.GridHelpers");
dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.form.Button");
dojo.require("prcommon.data.QueryWriteStore");
dojo.require("prcommon.newsrooms.add");

dojo.declare("prcommon.newsrooms.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.newsrooms","templates/viewer.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore(
			{	url:'/newsroom/newsroom_grid',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				nocallback:true,
				urlPreventCache:true
			});

		this._LoadNewsroomCallBack = dojo.hitch(this,this._LoadNewsroomCall);
		this._UpdateNewsroomCallBack = dojo.hitch(this,this._UpdateNewsroomCall);
		this._DeleteNewsroomCallBack = dojo.hitch(this,this._DeleteNewsroomCall);
		dojo.subscribe('/newsroom/add',  dojo.hitch(this, this._AddNewsroomEvent));
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;

		this.grid.set("structure",this.view);
		this.grid._setStore(this.model);
		this.grid['onCellClick'] = dojo.hitch(this,this._onCellClick);

		this.tabcont.selectChild(this.details);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
		this.tabcont.selectChild(this.details);
	},
	view: {
		cells: [[
		{name: 'Description',width: "200px",field:"description"},
		{name: 'Client',width: "200px",field:"clientname"},
		{name: 'Root',width: "200px",field:"news_room_root"}
		]]
	},
	_onCellClick:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);

		var content={};
		content['newsroomid'] = this._row.i.newsroomid;
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: dojo.hitch(this,this._LoadNewsroomCallBack),
				url:'/newsroom/newsroom_get',
				content: content
			})
		);
	},
	_LoadNewsroomCall:function(response)
	{
		if (response.success=="OK")
		{
			dojo.removeClass(this.display_pane,"prmaxhidden");
			dojo.style(this.contact.controlButton.domNode, {display:"none"});

			this.newsroomid.set("value", response.data.newsroom.newsroomid);
			this.description.set("value", response.data.newsroom.description);
			this.news_room_root.set("value", response.data.newsroom.news_room_root);
			this.link_1_name.set("value", response.data.customlinks.link_1.name);
			this.link_1_url.set("value", response.data.customlinks.link_1.url);
			this.link_2_name.set("value", response.data.customlinks.link_2.name);
			this.link_2_url.set("value", response.data.customlinks.link_2.url);
			this.header_colour.set("value", response.data.newsroom.header_colour);
			this.headerimage_left.set("value", response.data.newsroom.newsroomid);
			this.headerimage_right.set("value", response.data.newsroom.newsroomid);
			this.about_template.set("value", response.data.newsroom.about_template);
			dojo.attr(this.show_news_room_form,"action",response.data.newsroom_url);

			if (response.data.clientmode == false)
			{
				dojo.style(this.contact.controlButton.domNode, {display:"inline-block"});
				if (response.data.ns_contact)
				{
					this.www.set("value", response.data.ns_contact.www);
					this.tel.set("value", response.data.ns_contact.tel);
					this.email.set("value", response.data.ns_contact.email);
					this.linkedin.set("value", response.data.ns_contact.linkedin);
					this.facebook.set("value", response.data.ns_contact.facebook);
					this.twitter.set("value", response.data.ns_contact.twitter);
				}
				else
				{
					this.www.set("value", "");
					this.tel.set("value", "");
					this.email.set("value", "");
					this.linkedin.set("value", "");
					this.facebook.set("value", "");
					this.twitter.set("value", "");
				}
			}
			else
			{
				dojo.style(this.contact.controlButton.domNode, {display:"none"});
			}
		}

//		this.grid.selection.clickSelectEvent(e);
		this.tabcont.selectChild(this.details);
	},
	_AddNewsroom:function()
	{
		this.addnewsroomctrl.Load(this.add_newsroom_dlg);
		this.add_newsroom_dlg.show();
	},
	_AddNewsroomEvent:function(newsroom)
	{
		this.model.newItem(newsroom);
	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.update_form)==false || ttl.utilities.formValidator(this.contact_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}
		if (confirm ("Update?"))
		{
			var content = dojo.mixin(this.update_form.get("value"), this.contact_form.get("value"));
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._UpdateNewsroomCallBack),
					url:'/newsroom/newsroom_update',
					content: content
				})
			);
		}
	},
	_UpdateNewsroomCall:function ( response )
	{
		if (response.success=="OK")
		{
			alert("Newsroom Updated");
			this.update_form_btn.cancel();
			this.model.setValue(this._row, "description", response.data.newsroom.description, true );
			this.model.setValue(this._row, "news_room_root", response.data.newsroom.news_room_root, true );
		}
		else if ( response.success == "DU")
		{
			alert("Newsroom Already Exists");
			this.update_form_btn.cancel();
		}
		else
		{
			alert("Problem updating Newsroom");
			this.update_form_btn.cancel();
		}
	},
	_deleteNewsroom:function()
	{
		if (confirm("Delete Selected Newsroom?"))
		{
			var content = {};
			content['newsroomid'] = this._row.i.newsroomid;
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._DeleteNewsroomCallBack),
					url:"/newsroom/newsroom_delete",
					content: content}));
		}
	},
	_DeleteNewsroomCall:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Newsroom Deleted");
			this.grid.setQuery(ttl.utilities.getPreventCache({}));
			this.Clear();
		}
		else
		{
			alert("Problem Deleting Selected Newsroom");
		}
	},
	Clear:function()
	{
		this._Clear();
	},
	_Clear:function()
	{
		this.newsroomid.set("value", "-1");
		this.description.set("value", "");
		this.news_room_root.set("value", "");
		this.link_1_name.set("value", "");
		this.link_1_url.set("value", "");
		this.link_2_name.set("value", "");
		this.link_2_url.set("value", "");
		this.header_colour.set("value", "");
		this.headerimage_left.set("value", "");
		this.headerimage_right.set("value", "");
		this.about_template.set("value", "");
		this.www.set("value", "");
		this.tel.set("value", "");
		this.email.set("value", "");
		this.linkedin.set("value", "");
		this.facebook.set("value", "");
		this.twitter.set("value", "");
		this.update_form_btn.set("disabled",false);

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
	_show_new_room_url:function()
	{
		this.show_news_room_form.submit();
	},
});


