define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/users.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dijit/Menu",
	"dijit/MenuItem",
	"dijit/form/ValidationTextBox",
	"dijit/form/CheckBox",
	"control/customer/user_add",
	"control/customer/user_update",
	"control/customer/user_reset_password",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,Grid,JsonRest,Observable,Menu,MenuItem){

 return declare("control.customer.users",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	 this.model = new Observable(new JsonRest({target:'/customer/user_list', idProperty:"user_id"}));
	 this._show_func_call_back = lang.hitch(this, this._show_func_call);
	 this._delete_call_back = lang.hitch(this, this._delete_call);
	 this._icustomerid = null;
	 this._std_menu = null;
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'User Id',className:"dgrid-column-type-small",field:'user_id'},
			{label: 'Display Name',className:"dgrid-column-title",field:'display_name'},
			{label: 'Login Name',className:"dgrid-column-title",field:'user_name'},
			{label: 'Email',className:"dgrid-column-title",field:'email_address'}
		];

		this.searchgrid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model,
			sort: [{ attribute: "user_id", descending: false }],
			query:utilities2.EMPTYGRID
		});

		this.grid_view.set("content", this.searchgrid);
		this.searchgrid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
	},
	_on_cell_call:function(evt)
	{
		var cell = this.searchgrid.cell(evt);

		if (cell == null || cell.row == null ) return;

		this._selected_row = cell.row.data;
		if (this._std_menu === null)
		{
			this._std_menu = new Menu();
			this._std_menu.addChild(new MenuItem({label:"Delete", onClick:lang.hitch(this,this._delete_user)}));
			this._std_menu.addChild(new MenuItem({label:"Edit", onClick:lang.hitch(this,this._edit_user)}));
			this._std_menu.addChild(new MenuItem({label:"Re-Set password", onClick:lang.hitch(this,this._reset_password)}));
			this._std_menu.startup();
		}
		if ( this._std_menu != null )
			this._std_menu._openMyself(evt);

	},
	load:function(icustomerid)
	{
		this._icustomerid = icustomerid;
		this.searchgrid.set("query",{icustomerid:icustomerid});
	},
	_add_user:function()
	{
		this.user_add_ctrl.load(this._icustomerid, this._show_func_call_back);
		this.user_add_dlg.show();
	},
	_show_func_call:function(action, data)
	{
		switch(action)
		{
			case "add":
				this.model.add(data);
				this.user_add_dlg.hide();
				this.user_add_ctrl.clear();
				break;
			case "delete":
				this.model.remove(data);
				this.user_add_dlg.hide();
				this.user_add_ctrl.clear();
				break;
			case "update_show":
				this.user_update_dlg.show();
				break;
			case "upd_password_close":
				this.user_password_dlg.hide();
				break;
			case "update_finish":
				this.model.add(data);
				this.user_update_dlg.hide();
				break;
		}
	},
	_delete_user:function()
	{
		if (confirm("Delete - " + this._selected_row.display_name))
		{
			request.post('/customer/user/delete',
					utilities2.make_params({data:{iuserid:this._selected_row.user_id}})).then
					(this._delete_call_back);
		}
	},
	_edit_user:function()
	{
		this.user_update_ctrl.load(this._selected_row.user_id, this._show_func_call_back);
	},
	_reset_password:function()
	{
		this.user_password_ctrl.load(this._selected_row.user_id, this._selected_row.user_name, this._show_func_call_back);
		this.user_password_dlg.show();
	},
	_delete_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.model.remove(this._selected_row.user_id);
			this._selected_row = null;
		}
		else
		{
			alert("Problem");
		}
	}
});
});
