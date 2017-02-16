//-----------------------------------------------------------------------------
// Name:    Interests.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.Roles");

dojo.declare("prmax.dataadmin.Roles",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/Roles.html"),
		constructor: function()
		{
			this.model = new prcommon.data.QueryWriteStore(
					{	url:'/dataadmin/rolesall',
						onError:ttl.utilities.globalerrorchecker,
						nocallback:true
					});

			this._AddRoleCall = dojo.hitch(this , this._AddRole );
			this._LoadRoleCall = dojo.hitch(this , this._LoadRole );
			this._SetVisibleCall = dojo.hitch(this , this._SetVisible );
			this._FindRolesResponseCall = dojo.hitch(this , this._FindRolesResponse );
			this._LoadSynonimsCall = dojo.hitch ( this, this._LoadSynonims ) ;
			this._LoadRolesRebuildCall = dojo.hitch ( this, this._LoadRolesRebuild );
			this.inherited(arguments);
		},
		postCreate:function()
		{
			this.roles.set("structure",this._view);
			this.roles._setStore(this.model);
			this.roles.onRowClick = dojo.hitch(this,this._OnRowClick);
			this.inherited(arguments);
		},
		_view:{noscroll: false,
				cells: [[
					{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",field:'visible',formatter:ttl.utilities.formatButtonCell},
					{name: 'Roles',width: "auto",field:'prmaxrole'}
			]]
		},
		_FindRolesResponse:function( response )
		{
			this.role_list.options.length = 0 ;
			for ( var key in response.data )
			{
				var option = response.data[key];
				this.role_list.options[this.role_list.options.length] = new Option(option[1],option[0]);
			}
		},
		_FindRoles:function()
		{
			var tmp = this.role_list_select.get("value");

			if ( tmp.length>0 )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._FindRolesResponseCall,
					url:'/roles/find',
					content: {
						prmaxroleid:this._row.i.prmaxroleid,
						prmaxrole:tmp}}));
			}
		},
		_LoadRole:function( response )
		{
			this.visible_change.set("checked",response.data.prmaxrole.visible);
			dojo.removeClass(this.details,"prmaxhidden");
			this._ShowDetails();


			this.role_select.options.length = 0;
			for ( var key in response.data.prmaxroleslist )
			{
				var option = response.data.prmaxroleslist[key];
				this.role_select.options[this.role_select.options.length] = new Option(option.prmaxrole,option.synonymid);
			}

			if ( response.data.prmaxlistinterests != null )
				this.interests.set("value",response.data.prmaxlistinterests);

			if (response.data.prmaxrole.visible== true )
				dojo.removeClass(this.details_ext,"prmaxhidden");
		},
		_OnRowClick:function(e)
		{
			this._row = this.roles.getItem(e.rowIndex);
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadRoleCall,
				url:'/roles/getext',
				content: {prmaxroleid:this._row.i.prmaxroleid}}))

			this.roles.selection.clickSelectEvent(e);
		},
		resize:function()
		{
			this.frame.resize(arguments[0]);
			this.inherited(arguments);
		},
		_ClearFilter:function()
		{
			this.filter.set("value","");
			this.visible_only.set("checked",false);
		},
		_Execute:function()
		{
			var query = {filter:arguments[0].filter};
			if (arguments[0].visible.length>0)
				query["visible"] = true
			this.roles.setQuery( ttl.utilities.getPreventCache(query));
			this._Clear();
		},
		_AddRole:function( response )
		{
			if (response.success == "OK" )
			{
				alert("Role Added");
			}
			else if (response.success == "DU" )
			{
				alert("Role Already Exists");
			}
			else
			{
				alert("Prioblem Adding role");
			}
		},
		_ExecuteAdd:function()
		{
			if (this.rolename.isValid() == false )
			{
				alert("No Role Specified");
			}
			else
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._AddRoleCall,
					url:'/dataadmin/add',
					content: {rolename:arguments[0].rolename}}));
			}
			return false ;
		},
		_Clear:function()
		{
			this._row = null;
			dojo.addClass(this.details,"prmaxhidden");
		},
		_SetVisible:function( response )
		{
			if (response.success == "OK")
			{
				this._ShowDetails();
				alert("Role Primary Status Updated");
			}
		},
		_ShowDetails:function()
		{
			if (this.visible_change.get("checked")== true )
				dojo.removeClass(this.details_ext,"prmaxhidden");
			else
				dojo.addClass(this.details_ext,"prmaxhidden");
		},
		_SetPrimary:function()
		{
			var content = {prmaxroleid:this._row.i.prmaxroleid};

			if ( this.visible_change.get("checked"))
				content["visible"] = 1;

			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._SetVisibleCall,
				url:'/dataadmin/role_set_visible',
				content: content}));
		},
		_SelectionOptions:function()
		{
			this.button_single.set('disabled',this.role_list.selectedIndex!=-1?false:true);
			this.button_del_all.set('disabled',this.role_select.length?false:true);
			this.button_del_single.set('disabled',this.role_select.selectedIndex!=-1?false:true);
		},
	   roleSelectSingle:function()
		{
			for (var c=0; c<this.role_list.options.length ;c++){
				var option = this.role_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.role_select.options.length ;c1++){
						if (this.role_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.role_select.options[this.role_select.options.length] = new Option(option.text,option.value);
					}
				}
			}
		},
	    roleRemoveAll:function()
		{
			this.role_select.options.length = 0 ;
			this._SelectionOptions();
		},
 	    roleRemoveSingle:function()
		{
			this.role_select.options[this.role_select.selectedIndex] = null ;
			this._SelectionOptions();
		},

		_LoadRolesRebuild:function( response )
		{
			if ( response.success== "OK" )
			{
				alert( "Updated" ) ;
			}
			else
			{
				alert( "Problem Updating" ) ;
			}
		},
		_LoadSynonims:function ( response )
		{
			if ( response.success== "OK" )
			{
				alert( "Synonims Updated" ) ;
			}
			else
			{
				alert( "Problem Updating Synonims" ) ;
			}
		},
		_UpdateSynonims:function()
		{
			var roles = new Array();
			for (var c=0; c<this.role_select.options.length ;c++)
				roles.push ( parseInt(this.role_select.options[c].value));

			var content = {prmaxroleid:this._row.i.prmaxroleid,
										roles:dojo.toJson(roles),
										interests: this.interests.get("value")};

			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadSynonimsCall,
				url:'/dataadmin/update_synonims',
				content: content }));

		},
		destroy:function()
		{
			try
			{
				delete this.model;
				this.inherited(arguments);
			}
			catch(e){}
		}

	}
);





