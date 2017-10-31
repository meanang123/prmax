//-----------------------------------------------------------------------------
// Name:    prmax.freelance.FreelanceEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.user.UserAdmin");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dojox.form.PasswordValidator");

dojo.declare("prmax.user.UserAdmin",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.user","templates/UserAdmin.html"),
	constructor: function() {
		this.modelUserList = new prcommon.data.QueryWriteStore(
				{	url:'/user/list',
					nocallback:true,
					onError:ttl.utilities.globalerrorchecker
				});
	},
	postCreate:function()
	{
		this.usergrid.set("structure",this._view);
		this.usergrid._setStore (  this.modelUserList  ) ;
		this.usergrid.onRowClick = dojo.hitch(this,this.onSelectRow);
		this.usergrid.onStyleRow = ttl.GridHelpers.onStyleRow;

		// Load the data
		dojo.connect(this.addform,"onSubmit",dojo.hitch(this,this._Add));
		dojo.connect(this.resetform,"onSubmit",dojo.hitch(this,this._UpdatePassword));

		this._SavedCall = dojo.hitch(this , this._Saved ) ;
		this._UpdatedCall = dojo.hitch(this, this._Updated );
		this._DeletedCall = dojo.hitch(this, this._Deleted );
		this._PasswordResetCall = dojo.hitch(this, this._PasswordReset );
		this._getModelItemCall = dojo.hitch(this, this._getModelItem );
	},
	_view:{noscroll: false,
			cells: [[
				{name: 'Display Name',width: "250px",field:'display_name'},
				{name: 'Email',width: "250px",field:'user_name'}
			]]
	},
	onSelectRow : function(e) {
		console.log("selectRow ",e);
		this.row=this.usergrid.getItem(e.rowIndex).i;
		this._showPanel();
		this.usergrid.selection.clickSelectEvent(e);
	},
	_showPanel:function()
	{
		dojo.removeClass(this.display_panel, "prmaxhidden");
		this.update_email.set("value",  this.row.user_name);
		this.update_displayname.set("value", this.row.display_name);
	},
	_hidePanel:function()
	{
		dojo.addClass(this.display_panel, "prmaxhidden");
		this.row=null;
		this.update_email.set("value",  "");
		this.update_displayname.set("value", "");
	},
	_ShowAddUser:function()
	{
		this.saveAddNode.cancel();
		this.email.set("value",null);
		this.displayname.set("value",null);
		this.password.set("value",null);
		this.adddialog.show();
		this.email.focus();
	},
	_CloseAddDialog:function()
	{
		this.adddialog.hide();
	},
    _AddUser:function()
	{
		if ( ttl.utilities.formValidator(this.addform)==false)
		{
			alert("Not all required field filled in");
			this.saveAddNode.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCall,
			url:'/user/add',
			content: this.addform.get("value")}));
	},
	_Saved:function( response )
	{
		if ( response.success == "OK" )
		{
			this.saveAddNode.cancel();
			// add to grid etc
			this.modelUserList.newItem(response.data);
			this.adddialog.hide();
		}
		else
		{
			alert ( response.message ) ;
			this.saveAddNode.cancel();
		}
	},
	_Add:function()
	{
		this.addform.submit();
	},
	_PasswordReset:function (response )
	{
		if ( response.success == "OK" )
		{
			alert("Password Changed");
			this.resetPasswordNode.cancel();
			this.resetdialog.hide();
		}
		else
		{
			alert("Problem changing password");
			this.resetPasswordNode.cancel();
		}
	},
	_CloseDialog:function()
	{
		this.resetdialog.hide();
	},
	_UpdatePassword:function()
	{
		if ( ttl.utilities.formValidator(this.resetform)==false)
		{
			alert("Not all required field filled in");
			this.resetPasswordNode.cancel();
			return;
		}

		if (confirm("Update Password?")== true )
		{
			var content = this.resetform.get("value");

			content["iuserid"] = this.row.user_id;
			content["password"] = this.password.value;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._PasswordResetCall,
				url:'/user/update_password',
				content: content}));
		}
		else
		{
			this.resetPasswordNode.cancel();
		}
	},
	_ResetPassword:function()
	{
		this.resetPasswordNode.cancel();
		this.password_1.value = "";
		this.password_2.value = "";
		this.resetdialog.show();
	},
	_ResetPasswordButton:function()
	{
		this.resetform.submit();
	},
	_getModelItem:function()
	{
		console.log("_getModelItem",arguments);
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_Deleted:function( response )
	{
		if (response.success=="OK")
		{
			var item  = {identity:this.row.user_id,
						onItem:  this._getModelItemCall};

			this.modelUserList.fetchItemByIdentity(item);
			if (this.tmp_row)
				this.modelUserList.deleteItem(this.tmp_row);
			this._hidePanel();
		}
		else
		{
			alert("Problem Deleting User");
		}
		this.deleteNode.cancel();
	},
	_DeleteUser:function()
	{
		if (confirm("Delete user" + this.row.display_name + "?" )== true )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._DeletedCall,
				url:'/user/delete',
				content: {ruserid: this.row.user_id }}));
		}
		else
		{
			this.deleteNode.cancel();
		}
	},
	_Updated:function(response)
	{
		if (response.success=="OK")
		{
			var item  = {identity:this.row.user_id,
						onItem:  this._getModelItemCall};

			this.modelUserList.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.modelUserList.setValue(  this.tmp_row, "display_name" , data.display_name, true );
				this.modelUserList.setValue(  this.tmp_row, "user_name" , data.user_name, true );
			}
		}
		else
		{
			if (response.message != undefined)
				alert(response.message);
			else
				alert("Problem updating");
		}
		this.updateNode.cancel();
	},
	_UpdateUser:function()
	{
		if ( ttl.utilities.formValidator(this.updateform)==false)
		{
			alert("Not all required field filled in");
			this.updateNode.cancel();
			return;
		}

		if (confirm("Update user details")== true )
		{
			var content = this.updateform.get("value");

			content["ruserid"] = this.row.user_id;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._UpdatedCall,
				url:'/user/update',
				content: content}));
		}
		else
		{
			this.updateNode.cancel();
		}
	},
	resize:function()
	{
		console.log("resize freelance");
		this.borderControl.resize(arguments[0]);
	},
	Clear:function()
	{
		this._hidePanel();
		this.usergrid.setQuery(ttl.utilities.getPreventCache({}));
	}
});
