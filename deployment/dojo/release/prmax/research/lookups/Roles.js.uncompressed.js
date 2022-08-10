require({cache:{
'url:research/lookups/templates/Roles.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Roles filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Text</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Primary Only</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"visible_only\" data-dojo-props='name:\"visible\",type:\"checkbox\"' ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true'>\r\n\t\t\t\t<span>New Role</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter New Role\" data-dojo-attach-event=\"execute: _execute_add\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Role</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-props='trim:true,maxlength:45,type:\"text\",required:true,invalidMessage:\"Role Name Required\",name:\"rolename\"' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"rolename\" ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Add Role</button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"height:50%;width:100%;overflow:auto;overflow-x:hidden\"'>\r\n\t\t<div class=\"prmaxhidden\" data-dojo-attach-point=\"detail_view\">\r\n\t\t\t<table style=\"width:100%;height:50px\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td><label >Primary Only</label><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"visible_change\" type=\"checkbox\"  ></td>\r\n\t\t\t\t\t<td><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_set_primary\">Set Primary</button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t\t<div class=\"prmaxhidden\" data-dojo-attach-point=\"details_ext\">\r\n\t\t\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"ext_form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0px\">\r\n\t\t\t\t\t\t<tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t\t\t<tr><td colspan=\"3\">\r\n\t\t\t\t\t\t\t<table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t\t\t\t<tr><td width=\"40%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" data-dojo-type=\"dijit/form/TextBox\" style=\"width:60%\" data-dojo-attach-point=\"role_list_select\" /><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_find_roles\" >Find</button> </td>\r\n\t\t\t\t\t\t\t</tr></table>\r\n\t\t\t\t\t\t</td></tr>\r\n\t\t\t\t\t\t<tr><td ><select style=\"width:100%\" data-dojo-attach-point=\"role_list\" size=\"7\" class=\"lists\" multiple=\"multiple\" data-dojo-attach-event=\"onchange:_selection_options,ondblclick:role_select_single\" ></select></td>\r\n\t\t\t\t\t\t\t<td >\r\n\t\t\t\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_single\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:role_select_single\">&gt;&nbsp;</button><br/>\r\n\t\t\t\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:role_remove_all\">&lt;&lt;</button><br/>\r\n\t\t\t\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:role_remove_single\">&lt;&nbsp;</button></td>\r\n\t\t\t\t\t\t\t<td ><select style=\"width:100%\" data-dojo-attach-point=\"role_select\" size=\"7\" class=\"lists\" multiple=\"multiple\" data-dojo-attach-event=\"onchange:_selection_options\" ></select></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" valign=\"top\" colspan=\"3\"><div data-dojo-props='keytypeid:6' data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-attach-point=\"interests\" ></div></td></tr>\r\n\t\t\t\t\t\t<tr><td colspan=\"3\"></td></tr>\r\n\t\t\t\t\t\t<tr><td colspan=\"3\"><button type=\"button\" type=\"button\" data-dojo-attach-event=\"onClick:_update_synonims\" data-dojo-type=\"dijit/form/Button\">Update</button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Roles.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/lookups/Roles", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/Roles.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Cache",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, request, utilities2, json, lang, domclass ){
 return declare("research.lookup.Roles",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/roles/rolesall', idProperty:"prmaxroleid"}));

		this._add_role_call = lang.hitch(this , this._add_role );
		this._load_role_call = lang.hitch(this , this._load_role );
		this._set_visible_call = lang.hitch(this , this._set_visible );
		this._find_roles_response_call = lang.hitch(this , this._find_roles_response );
		this._load_synonims_call = lang.hitch ( this, this._load_synonims ) ;
		this._load_roles_rebuild_call = lang.hitch ( this, this._load_roles_rebuild );
	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'prmaxroleid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label:'P', field:'visible', sortable: false, formatter:utilities2.check_cell,className:"grid-field-image-view"},
			{label: 'Roles',className: "standard",field:'prmaxrole'},
			{label: 'Job Roles',className: "standard",field:'roles'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{visible : true}
		})
		this.grid.on("dgrid-select", lang.hitch(this,this._on_cell_call));

		this.inherited(arguments);

	},
	startup:function()
	{
		this.inherited(arguments);
		// because of the way this widget is created and displayed it doens't
		// render correcly first time so we need to do it on start up
		this.grid_view.set("content", this.grid);

	},
	_find_roles_response:function( response )
	{
		this.role_list.options.length = 0 ;
		for ( var key in response.data )
		{
			var option = response.data[key];
			this.role_list.options[this.role_list.options.length] = new Option(option[1],option[0]);
		}
	},
	_find_roles:function()
	{
		var tmp = this.role_list_select.get("value");

		if ( tmp.length>0 )
		{
		request.post('/research/admin/roles/find',
				utilities2.make_params({ data: {
					prmaxroleid:this._row.prmaxroleid,
					prmaxrole:tmp}})).
				then ( this._find_roles_response_call);
		}
	},
	_load_role:function( response )
	{
		this.visible_change.set("checked",response.data.prmaxrole.visible);
		domclass.remove(this.detail_view,"prmaxhidden");
		this._show_details();

		this.role_select.options.length = 0;
		for ( var key in response.data.prmaxroleslist )
		{
			var option = response.data.prmaxroleslist[key];
			this.role_select.options[this.role_select.options.length] = new Option(option.prmaxrole,option.synonymid);
		}

		if ( response.data.prmaxlistinterests != null )
			this.interests.set("value",response.data.prmaxlistinterests);

		if (response.data.prmaxrole.visible== true )
			domclass.remove(this.details_ext,"prmaxhidden");
	},
	_on_cell_call:function(e)
	{
		this.interests.clear();
		this.role_list.options.length = 0 ;
		this.role_list_select.set("value","");


		this._row = e.rows[0].data;
		request.post('/research/admin/roles/getext',
			utilities2.make_params({data:{prmaxroleid:this._row.prmaxroleid}})).
			then (this._load_role_call);
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
		this.visible_only.set("checked",false);
	},
	_execute:function()
	{
		var query = {filter:arguments[0].filter};
		if (arguments[0].visible.length>0)
			query["visible"] = true
		this.grid.set("query",query);
		this._clear();
	},
	_add_role:function( response )
	{
		if (response.success == "OK" )
		{
			this._store.add( response.data);
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
	_execute_add:function()
	{
		if (this.rolename.isValid() == false )
		{
			alert("No Role Specified");
		}
		else
		{
			request.post('/research/admin/roles/add',
				utilities2.make_params({data:{rolename:arguments[0].rolename}})).
				then(this._add_role_call);
		}
		return false ;
	},
	_clear:function()
	{
		this._row = null;
		domclass.add(this.detail_view,"prmaxhidden");
		this.interests.clear();
		this.role_list.options.length = 0 ;
		this.role_list_select.set("value","");
	},
	_set_visible:function( response )
	{
		if (response.success == "OK")
		{
			this._show_details();
			alert("Role Primary Status Updated");
		}
	},
	_show_details:function()
	{
		if (this.visible_change.get("checked")== true )
			domclass.remove(this.details_ext,"prmaxhidden");
		else
			domclass.add(this.details_ext,"prmaxhidden");
	},
	_set_primary:function()
	{
		var content = {prmaxroleid:this._row.prmaxroleid};

		if ( this.visible_change.get("checked"))
			content["visible"] = 1;

		request.post ('/research/admin/roles/role_set_visible',
			utilities2.make_params({data:content})).
			then (this._set_visible_call);
	},
	_selection_options:function()
	{
		this.button_single.set('disabled',this.role_list.selectedIndex!=-1?false:true);
		this.button_del_all.set('disabled',this.role_select.length?false:true);
		this.button_del_single.set('disabled',this.role_select.selectedIndex!=-1?false:true);
	},
	role_select_single:function()
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
	role_remove_all:function()
	{
		this.role_select.options.length = 0 ;
		this._selection_options();
	},
	role_remove_single:function()
	{
		this.role_select.options[this.role_select.selectedIndex] = null ;
		this._selection_options();
	},
	_load_roles_rebuild:function( response )
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
	_load_synonims:function ( response )
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
	_update_synonims:function()
	{
		var roles = new Array();
		for (var c=0; c<this.role_select.options.length ;c++)
			roles.push ( parseInt(this.role_select.options[c].value));

		var content = {prmaxroleid:this._row.prmaxroleid,
									roles:json.stringify(roles),
									interests: this.interests.get("value")};

		request.post( '/research/admin/roles/update_synonims',
			utilities2.make_params({data:content})).
			then(this._load_synonims_call);
	}
});
});
