//-----------------------------------------------------------------------------
// Name:    settings.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/08/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.settings");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.crm.userdefined");

dojo.declare("prcommon.crm.settings",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/settings.html"),
	constructor: function()
	{
		this._dialog = null;
		this._save_call_back = dojo.hitch(this, this._save_call);
		this._load_call_back = dojo.hitch(this, this._load_call);
		this._error_call_back = dojo.hitch(this, this._error_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_clear:function()
	{
	},
	_close:function()
	{
		this._clear();

		if ( this._dialog)
		{
			this._dialog.hide();
		}
	},
	_save:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/crm/update_settings',
			error: this._error_call_back,
			content:this.form.get("value")}));

	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
			PRMAX.utils.settings.crm_user_define_1 = response.data.crm_user_define_1;
			PRMAX.utils.settings.crm_user_define_2 = response.data.crm_user_define_2;
			PRMAX.utils.settings.crm_user_define_3 = response.data.crm_user_define_3;
			PRMAX.utils.settings.crm_user_define_4 = response.data.crm_user_define_4;
			dojo.publish("/crm/settings_change",[]);
			this._close();
		}
		else
		{
			alert("Problem updating settings");
		}

		this.savebtn.cancel();
	},
	_fields : ["1","2","3","4"],
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			for ( var key in this._fields)
			{
				var keyid = this._fields[key];
				this["crm_user_define_"+ keyid].set("value", response.data["crm_user_define_" + keyid]);
				if (response.data["crm_user_define_" + keyid] != ""  && response.data["crm_user_define_" + keyid ] != null )
					this["crm_user_define_"+keyid+"_on"].set("checked",true);
				else
					this["crm_user_define_"+keyid+"_on"].set("checked",false);

				this["crm_user_define_menu_"+keyid].force_startup();
			}
			this.crm_user_define_1.startup();
			this.crm_user_define_2.startup();
			this.crm_user_define_3.startup();
			this.crm_user_define_4.startup();
			this._dialog.show();
			this._display_fields();
		}
		else
		{

			alert("Problem Loading Settings");

		}
	},
	load:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._load_call_back,
			url:'/crm/load_settings'}));
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	},
	_display_fields:function()
	{
		for ( var key in this._fields)
		{
			var keyid = this._fields[key];
			var tmp_1 = this["crm_user_define_" + keyid + "_on"].get("checked");
			if ( tmp_1)
			{
				dojo.removeClass(this["crm_user_define_"+keyid].domNode,"prmaxhidden");
				dojo.removeClass(this["crm_user_define_menu_"+keyid].domNode,"prmaxhidden");
				dojo.removeClass(this["crm_user_define_"+keyid+"_label"],"prmaxhidden");
				this["crm_user_define_menu_" + keyid].force_startup();
			}
			else
			{
				dojo.addClass(this["crm_user_define_" + keyid ].domNode,"prmaxhidden");
				dojo.addClass(this["crm_user_define_menu_" + keyid ].domNode,"prmaxhidden");
				dojo.addClass(this["crm_user_define_"+keyid+"_label"],"prmaxhidden");
			}
		}
	},
	_error_call:function(response, ioArgs)
	{
		ttl.utilities.xhrPostError(response, ioArgs);
		this.savebtn.cancel();
	}
});





