/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.dataadmin.Roles"]){dojo._hasResource["prmax.dataadmin.Roles"]=true;dojo.provide("prmax.dataadmin.Roles");dojo.declare("prmax.dataadmin.Roles",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div  dojoAttachPoint=\"frame\"  dojotype=\"dijit.layout.BorderContainer\"  style=\"width:100%;height:100%;overflow: hidden\" gutters=\"false\">\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" region=\"top\" style=\"height:42px;width:100%;overflow:hidden\" class=\"searchresults\">\r\n\t\t\t<div style=\"height:40px;width:100%;overflow:hidden;padding:0px;margin:0px\" class=\"searchresults\">\r\n\t\t\t\t<div style=\"height:100%;width:15%;float:left;padding:0px;margin:0px\" class=\"dijitToolbar prmaxrowdisplaylarge\">Manage Roles</div>\r\n\t\t\t\t<div class=\"dijitToolbarTop\" dojoType=\"dijit.Toolbar\" style=\"float:left;height:100%;width:85%;padding:0px;margin:0px\" >\r\n\t\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\"   iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\">\r\n\t\t\t\t\t\t<span>Filter  By</span>\r\n\t\t\t\t\t\t<div dojoType=\"dijit.TooltipDialog\" title=\"Enter Roles filter\" dojoAttachEvent=\"execute: _Execute\">\r\n\t\t\t\t\t\t\t<table>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td><label for=\"user\">Text</label></td>\r\n\t\t\t\t\t\t\t\t\t<td><input dojoType=\"dijit.form.TextBox\"name=\"filter\" dojoAttachPoint=\"filter\" trim=\"true\" maxlength=\"45\" type=\"text\"  ></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td><label for=\"user\">Primary Only</label></td>\r\n\t\t\t\t\t\t\t\t\t<td><input dojoType=\"dijit.form.CheckBox\"name=\"visible\" dojoAttachPoint=\"visible_only\" type=\"checkbox\"  ></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td align=\"left\"><button dojoAttachEvent=\"onClick: _ClearFilter\" dojoType=\"dijit.form.Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t\t\t<td align=\"right\"><button dojoType=\"dijit.form.Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\"   iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\">\r\n\t\t\t\t\t\t<span>New Role</span>\r\n\t\t\t\t\t\t<div dojoType=\"dijit.TooltipDialog\" title=\"Enter New Role\" dojoAttachEvent=\"execute: _ExecuteAdd\">\r\n\t\t\t\t\t\t\t<table>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td><label >Role</label></td>\r\n\t\t\t\t\t\t\t\t\t<td><input required=\"true\" invalidMessage=\"Role Name Required\" dojoType=\"dijit.form.ValidationTextBox\" name=\"rolename\" dojoAttachPoint=\"rolename\" trim=\"true\" maxlength=\"45\" type=\"text\"  ></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td align=\"right\" colspan=\"2\"><button dojoType=\"dijit.form.Button\" type=\"submit\" name=\"submit\">Add Role</button></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" region=\"center\">\r\n\t\t\t<div dojoAttachPoint=\"roles\" dojoType=\"dojox.grid.DataGrid\" query=\"{ name:'*'}\" rowsPerPage=\"50\" style=\"width:100%:height:100%\"  ></div>\r\n\t\t</div>\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" region=\"bottom\" style=\"height:50%;width:100%;overflow:auto;overflow-x:hidden\">\r\n\t\t\t<div class=\"prmaxhidden\" dojoAttachPoint=\"details\">\r\n\t\t\t\t<table>\r\n\t\t\t\t\t<tr><td><label >Primary Only</label><input dojoType=\"dijit.form.CheckBox\" dojoAttachPoint=\"visible_change\" type=\"checkbox\"  ></td>\r\n\t\t\t\t\t\t<td ><button dojoType=\"dijit.form.Button\" type=\"button\" dojoAttachEvent=\"onClick:_SetPrimary\">Set Primary</button></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t\t<div class=\"prmaxhidden\" dojoAttachPoint=\"details_ext\">\r\n\t\t\t\t\t<form  dojotype=\"dijit.form.Form\" dojoAttachPoint=\"ext_form\" onsubmit=\"return false;\" dojoAttachEvent=\"onSubmit:_FindRoles\">\r\n\t\t\t\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t\t\t\t\t\t<tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t\t\t\t<tr><td colspan=\"3\">\r\n\t\t\t\t\t\t\t\t<table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t\t\t\t\t<tr><td width=\"40%\" dojoAttachPoint=\"master_type_text\"><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" dojoType=\"dijit.form.TextBox\" style=\"width:60%\" dojoAttachPoint=\"role_list_select\" /><button dojoType=\"dijit.form.Button\" type=\"submit\" >Find</button> </td>\r\n\t\t\t\t\t\t\t\t</tr></table>\r\n\t\t\t\t\t\t\t</td></tr>\r\n\t\t\t\t\t\t\t<tr><td ><select style=\"width:100%\" dojoAttachPoint=\"role_list\" size=\"7\" class=\"lists\" multiple=\"multiple\" dojoAttachEvent=\"onchange:_SelectionOptions,ondblclick:roleSelectSingle\" ></select></td>\r\n\t\t\t\t\t\t\t\t<td >\r\n\t\t\t\t\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_single\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:roleSelectSingle\">&gt;&nbsp;</button><br/>\r\n\t\t\t\t\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_del_all\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:roleRemoveAll\">&lt;&lt;</button><br/>\r\n\t\t\t\t\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_del_single\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:roleRemoveSingle\">&lt;&nbsp;</button></td>\r\n\t\t\t\t\t\t\t\t<td ><select style=\"width:100%\" dojoAttachPoint=\"role_select\" size=\"7\" class=\"lists\" multiple=\"multiple\" dojoAttachEvent=\"onchange:_SelectionOptions\" ></select></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" valign=\"top\" >Keywords:</td></tr>\r\n\t\t\t\t\t\t\t<tr><td colspan=\"3\"><div displaytitle=\"\" dojoType=\"prcommon.interests.Interests\"  restrict=\"0\" dojoAttachPoint=\"interests\" size=\"6\" name=\"interests\" startopen=\"true\" selectonly=\"true\" nofilter=\"true\" keytypeid=\"1\" interesttypeid=\"1\" ></div></td></tr>\r\n\t\t\t\t\t\t\t<tr><td colspan=\"3\"><button type=\"button\" type=\"button\" dojoAttachEvent=\"onClick:_UpdateSynonims\" dojoType=\"dijit.form.Button\">Update </button></td></tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</form>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this.model=new prcommon.data.QueryWriteStore({url:"/dataadmin/rolesall",onError:ttl.utilities.globalerrorchecker,nocallback:true});this._AddRoleCall=dojo.hitch(this,this._AddRole);this._LoadRoleCall=dojo.hitch(this,this._LoadRole);this._SetVisibleCall=dojo.hitch(this,this._SetVisible);this._FindRolesResponseCall=dojo.hitch(this,this._FindRolesResponse);this._LoadSynonimsCall=dojo.hitch(this,this._LoadSynonims);this._LoadRolesRebuildCall=dojo.hitch(this,this._LoadRolesRebuild);this.inherited(arguments);},postCreate:function(){this.roles.set("structure",this._view);this.roles._setStore(this.model);this.roles.onRowClick=dojo.hitch(this,this._OnRowClick);this.inherited(arguments);},_view:{noscroll:false,cells:[[{name:" ",width:"13px",styles:"text-align: center;",width:"20px",field:"visible",formatter:ttl.utilities.formatButtonCell},{name:"Roles",width:"auto",field:"prmaxrole"}]]},_FindRolesResponse:function(_1){this.role_list.options.length=0;for(var _2 in _1.data){var _3=_1.data[_2];this.role_list.options[this.role_list.options.length]=new Option(_3[1],_3[0]);}},_FindRoles:function(){var _4=this.role_list_select.get("value");if(_4.length>0){dojo.xhrPost(ttl.utilities.makeParams({load:this._FindRolesResponseCall,url:"/roles/find",content:{prmaxroleid:this._row.i.prmaxroleid,prmaxrole:_4}}));}},_LoadRole:function(_5){this.visible_change.set("checked",_5.data.prmaxrole.visible);dojo.removeClass(this.details,"prmaxhidden");this._ShowDetails();this.role_select.options.length=0;for(var _6 in _5.data.prmaxroleslist){var _7=_5.data.prmaxroleslist[_6];this.role_select.options[this.role_select.options.length]=new Option(_7.prmaxrole,_7.synonymid);}if(_5.data.prmaxlistinterests!=null){this.interests.set("value",_5.data.prmaxlistinterests);}if(_5.data.prmaxrole.visible==true){dojo.removeClass(this.details_ext,"prmaxhidden");}},_OnRowClick:function(e){this._row=this.roles.getItem(e.rowIndex);dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadRoleCall,url:"/roles/getext",content:{prmaxroleid:this._row.i.prmaxroleid}}));this.roles.selection.clickSelectEvent(e);},resize:function(){this.frame.resize(arguments[0]);this.inherited(arguments);},_ClearFilter:function(){this.filter.set("value","");this.visible_only.set("checked",false);},_Execute:function(){var _8={filter:arguments[0].filter};if(arguments[0].visible.length>0){_8["visible"]=true;}this.roles.setQuery(ttl.utilities.getPreventCache(_8));this._Clear();},_AddRole:function(_9){if(_9.success=="OK"){alert("Role Added");}else{if(_9.success=="DU"){alert("Role Already Exists");}else{alert("Prioblem Adding role");}}},_ExecuteAdd:function(){if(this.rolename.isValid()==false){alert("No Role Specified");}else{dojo.xhrPost(ttl.utilities.makeParams({load:this._AddRoleCall,url:"/dataadmin/add",content:{rolename:arguments[0].rolename}}));}return false;},_Clear:function(){this._row=null;dojo.addClass(this.details,"prmaxhidden");},_SetVisible:function(_a){if(_a.success=="OK"){this._ShowDetails();alert("Role Primary Status Updated");}},_ShowDetails:function(){if(this.visible_change.get("checked")==true){dojo.removeClass(this.details_ext,"prmaxhidden");}else{dojo.addClass(this.details_ext,"prmaxhidden");}},_SetPrimary:function(){var _b={prmaxroleid:this._row.i.prmaxroleid};if(this.visible_change.get("checked")){_b["visible"]=1;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SetVisibleCall,url:"/dataadmin/role_set_visible",content:_b}));},_SelectionOptions:function(){this.button_single.set("disabled",this.role_list.selectedIndex!=-1?false:true);this.button_del_all.set("disabled",this.role_select.length?false:true);this.button_del_single.set("disabled",this.role_select.selectedIndex!=-1?false:true);},roleSelectSingle:function(){for(var c=0;c<this.role_list.options.length;c++){var _c=this.role_list.options[c];if(_c.selected){_c.selected=false;var _d=true;for(var c1=0;c1<this.role_select.options.length;c1++){if(this.role_select.options[c1].value==_c.value){_d=false;break;}}if(_d){this.role_select.options[this.role_select.options.length]=new Option(_c.text,_c.value);}}}},roleRemoveAll:function(){this.role_select.options.length=0;this._SelectionOptions();},roleRemoveSingle:function(){this.role_select.options[this.role_select.selectedIndex]=null;this._SelectionOptions();},_LoadRolesRebuild:function(_e){if(_e.success=="OK"){alert("Updated");}else{alert("Problem Updating");}},_LoadSynonims:function(_f){if(_f.success=="OK"){alert("Synonims Updated");}else{alert("Problem Updating Synonims");}},_UpdateSynonims:function(){var _10=new Array();for(var c=0;c<this.role_select.options.length;c++){_10.push(parseInt(this.role_select.options[c].value));}var _11={prmaxroleid:this._row.i.prmaxroleid,roles:dojo.toJson(_10),interests:this.interests.get("value")};dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadSynonimsCall,url:"/dataadmin/update_synonims",content:_11}));},destroy:function(){try{delete this.model;this.inherited(arguments);}catch(e){}}});}