/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.collateral.view"]){dojo._hasResource["prmax.collateral.view"]=true;dojo.provide("prmax.collateral.view");dojo.require("ttl.GridHelpers");dojo.require("ttl.BaseWidget");dojo.require("dijit.form.Form");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dojox.form.BusyButton");dojo.require("dijit.form.Button");dojo.require("prmax.collateral.adddialog");formatRowDelete=function(_1){return isNaN(_1)?"...":"<img height=\"18px\" width=\"18px\" style=\"padding:0x;margin:0px\" src=\"/static/images/delete.gif\" title=\"Delete\" ></img>";};formatRowCtrl=function(_2){return isNaN(_2)?"...":"<img height=\"10px\" width=\"10px\" style=\"padding:0x;margin:0px\" src=\"/static/images/rowctrl.gif\"></img>";};dojo.declare("prmax.collateral.view",[ttl.BaseWidget],{templateString:"<div>\r\n\t<div data-dojo-attach-point=\"borderControl\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false' >\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"top\", style:\"height:42px;width:100%;overflow:hidden\", \"class\":\"std_menu_view\"'>\r\n\t\t\t<div style=\"height:38px;width:100%;overflow:hidden\" class=\"std_menu_view\">\r\n\t\t\t\t<div style=\"height:100%;width:100px;float:left;padding-top:10px;\" class=\"prmaxrowdisplaylarge\">Collateral</div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='\"class\":\"dijitToolbarTop\", style:\"float:left:height:94%;width:400px\"' >\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_AddCollateral\" data-dojo-attach-point=\"addbutton\" data-dojo-props='label:\"New Collateral\", iconClass:\"fa fa-plus fa-3x\",showLabel:false'></div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"deletebutton\" data-dojo-attach-event=\"onClick:_delete\"  data-dojo-props='label:\"Delete Collateral\", iconClass:\"fa fa-trash fa-3x\",showLabel:false'></div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.form.DropDownButton\"  data-dojo-props='iconClass:\"fa fa-filter fa-3x\",label:\"Filter\",showLabel:false'>\r\n\t\t\t\t\t\t<div data-dojo-type=\"dijit.TooltipDialog\" data-dojo-props='title:\"Filter By\"' data-dojo-attach-event=\"execute:_filter\">\r\n\t\t\t\t\t\t\t<br/>\r\n\t\t\t\t\t\t\t<table>\r\n\t\t\t\t\t\t\t\t<tr><td><label>Ignore Automatically Loaded</label></td><td><input data-dojo-type=\"dijit.form.CheckBox\" data-dojo-attach-point=\"ignore_automated\" data-dojo-props='type:\"checkbox\",name:\"ignore_automated\",checked:false,value:\"1\"' ></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' >Clear</button></td>\r\n\t\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Submit</button></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\", splitter:true'>\r\n\t\t\t<div data-dojo-attach-point=\"grid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='query:{ }, rowsPerPage:30' ></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='style:\"width:60%;height:100%\", region:\"right\", splitter:true'>\r\n\t\t\t<div style=\"padding:2px\" data-dojo-attach-point =\"display_pane\" class=\"prmaxhidden\">\r\n\t\t\t\t<form data-dojo-attach-point=\"update_form\" data-dojo-props='\"class\":\"prmaxdefault\", onsubmit:\"return false\"' data-dojo-type=\"dijit.form.Form\">\r\n\t\t\t\t\t<input data-dojo-attach-point=\"collateralid\" data-dojo-props='name:\"collateralid\", type:\"hidden\", value:\"-1\"' data-dojo-type=\"dijit.form.TextBox\" >\r\n\t\t\t\t\t<table class=\"prmaxtable\" width=\"500px\" >\r\n\t\t\t\t\t\t<tr><td colspan=\"2\" align=\"center\" class=\"prmaxrowdisplaylarge\" > Collateral Details</td></tr>\r\n\t\t\t\t\t\t<tr><td width=\"20%\" class=\"prmaxrowtag\" >Code</td><td class=\"prmaxrowdisplay\" width=\"76%\"><input data-dojo-props='style:\"width:98%\", \"class\":\"prmaxrequired\", name:\"collateralcode\", type:\"text\", maxlength:10, trim:true, required:true, invalidMessage:\"Code field must be filled in\"' data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-attach-point=\"code\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" >Description</td><td class=\"prmaxrowdisplay\" width=\"76%\"><input data-dojo-props='invalidMessage:\"Description field must be filled in\", style:\"width:98%\", \"class\":\"prmaxrequired\", name:\"description\", type:\"text\", maxlength:80, trim:true, required:true' data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-attach-point=\"description\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" >File Name</td><td class=\"prmaxrowdisplay\" width=\"76%\" data-dojo-attach-point=\"filename\"></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" >PRMax Id</td><td class=\"prmaxrowdisplay\" width=\"76%\" data-dojo-attach-point=\"prmaxid\"></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" data-dojo-attach-point=\"client_label\">Client Name</td><td><select data-dojo-attach-point=\"clientid\" data-dojo-type =\"dijit.form.FilteringSelect\" data-dojo-props='name:\"clientid\", searchAttr:\"clientname\", labelType:\"html\", style:\"width:98%\" ' data-dojo-attach-event=\"onChange: _show_hide_fields\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag prmaxhidden\" data-dojo-attach-point=\"newsroom_label\">Newsroom</td><td><select data-dojo-attach-point=\"newsroomid\" data-dojo-type =\"dijit.form.FilteringSelect\" data-dojo-props='\"class\":\"prmaxhidden\", name:\"newsroomid\", searchAttr:\"description\", labelType:\"html\", style:\"width:98%\" ' data-dojo-attach-event=\"onChange: _show_hide_fields\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" >Controls</td><td class=\"prmaxrowdisplay\" width=\"76%\">\r\n\t\t\t\t\t\t\t<button data-dojo-props='\"class\":\"prmaxbutton\", type:\"button\", label:\"Update\", busyLabel:\"Please Wait Updating\" ' data-dojo-type=\"dojox.form.BusyButton\" data-dojo-attach-event=\"onClick:_Update\" data-dojo-attach-point=\"update_form_btn\"></button>\r\n\t\t\t\t\t\t\t<button data-dojo-props='\"class\":\"prmaxbutton\", type:\"button\", label:\"Delete\"' data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Delete\"></button>\r\n\t\t\t\t\t\t\t<button data-dojo-props='\"class\":\"prmaxbutton\", type:\"button\", label:\"Preview\"' data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Preview\"></button>\r\n\t\t\t\t\t\t</td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"addctrl\" data-dojo-type=\"prmax.collateral.adddialog\"></div>\r\n</div>\r\n",constructor:function(){this._has_global_newsroom=PRMAX.utils.settings.has_global_newsroom;this.model=new prcommon.data.QueryWriteStore({url:"/icollateral/collateral_grid",tableid:7,oncallback:dojo.hitch(this,this._selection_changed),onError:ttl.utilities.globalerrorchecker,oncallbackparams:dojo.hitch(this,this._get_context)});this._client_data=new dojox.data.QueryReadStore({url:"/clients/combo?include_no_select",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,urlPreventCache:true});this._newsroom_data=new dojox.data.QueryReadStore({url:"/newsroom/combo?include_no_select",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,urlPreventCache:true});dojo.subscribe(PRCOMMON.Events.Collateral_Add,dojo.hitch(this,this._AddCollateralEvent));this._DeleteCollateralCallBack=dojo.hitch(this,this._DeleteCollateral);this._getModelItemCall=dojo.hitch(this,this._getModelItem);this._UpdateCollateralCallBack=dojo.hitch(this,this._UpdateCollateralCall);this._on_delete_collateral_call_back=dojo.hitch(this,this._on_delete_collateral_call);},postCreate:function(){this.grid.set("structure",this.view);this.baseonCellClick=this.grid["onCellClick"];this.grid["onStyleRow"]=dojo.hitch(this,this._OnStyleRow);this.grid["onCellClick"]=dojo.hitch(this,this.onCellClick);this.grid._setStore(this.model);this.clientid.set("store",this._client_data);this.clientid.set("value",-1);this.newsroomid.set("store",this._newsroom_data);this.newsroomid.set("value",-1);},_OnStyleRow:function(_3){ttl.GridHelpers.onStyleRow(_3);},onCellClick:function(e){if(e.cellIndex==0){var _4=this.grid.getItem(e.rowIndex);this.model.setValue(_4,"selected",!_4.i.selected,true);}else{this.grid.selection.clickSelectEvent(e);this._row=this.grid.getItem(e.rowIndex);this._ShowDetails();}},_ShowDetails:function(){dojo.removeClass(this.display_pane,"prmaxhidden");dojo.attr(this.filename,"innerHTML",this._row.i.filename);dojo.attr(this.prmaxid,"innerHTML",this._row.i.collateralid);this.collateralid.set("value",this._row.i.collateralid);this.code.set("value",this._row.i.collateralcode);this.description.set("value",this._row.i.collateralname);this.clientid.set("value",this._row.i.clientid==null?-1:this._row.i.clientid);this.newsroomid.set("value",this._row.i.newsroomid==null?-1:this._row.i.newsroomid);},_getModelItem:function(){this.tmp_row=arguments[0];},_DeleteCollateral:function(_5){if(_5.success=="OK"){var _6={identity:_5.collateralid,onItem:this._getModelItemCall};this.tmp_row=null;this.model.fetchItemByIdentity(_6);if(this.tmp_row){this.model.deleteItem(this.tmp_row);}this._row=null;dojo.addClass(this.display_pane,"prmaxhidden");dojo.attr(this.filename,"innerHTML","");dojo.attr(this.prmaxid,"innerHTML","");this.clientid.set("value","-1");this.newsroomid.set("value","-1");this.code.set("value","");dojo.attr(this.description,"description","");dojo.removeClass(this.display_pane,"prmaxhidden");}else{alert("Problem Deleting Collateral");}},_AddCollateralEvent:function(_7){var _8=this.model.newItem(_7);},view:{cells:[[{name:" ",width:"15px",styles:"text-align: center;",width:"20px",field:"selected",formatter:ttl.utilities.formatButtonCell},{name:"Code",width:"100px",field:"collateralcode"},{name:"Description",width:"200px",field:"collateralname"},{name:"Client",width:"150px",field:"clientname"},{name:"Newsroom",width:"150px",field:"description"},{name:"Releases",width:"auto",field:"emailtemplatename"}]]},destroy:function(){try{this.inherited(arguments);}catch(e){}delete this.model;},Clear:function(){this.grid.setQuery(ttl.utilities.getPreventCache({}));this.addctrl.Clear();},resize:function(){this.borderControl.resize(arguments[0]);},_Delete:function(){if(confirm("Delete Collateral ("+this._row.i.collateralname+")?")){dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._DeleteCollateralCallBack),url:"/icollateral/collateral_delete",content:{collateralid:this._row.i.collateralid}}));}},_Preview:function(){ttl.utilities.gotoDialogPageStatic("/collateral/"+this._row.i.collateralid+this._row.i.ext);},_AddCollateral:function(){this.addctrl.show();},_UpdateCollateralCall:function(_9){if(_9.success=="OK"){alert("Collateral Updated");this.update_form_btn.cancel();this.model.setValue(this._row,"collateralcode",this.code.get("value"),true);this.model.setValue(this._row,"collateralname",this.description.get("value"),true);this.model.setValue(this._row,"clientname",_9.data.clientname,true);this.model.setValue(this._row,"clientid",_9.data.clientid,true);this.model.setValue(this._row,"newsroomid",_9.data.newsroomid,true);this.model.setValue(this._row,"emailtemplatename",_9.data.emailtemplatename,true);}else{if(_9.success=="DU"){alert("Collateral Already Exists");this.update_form_btn.cancel();}else{alert("Problem updating Collateral");this.update_form_btn.cancel();}}},_Update:function(){if(ttl.utilities.formValidator(this.update_form)==false){alert("Not all required field filled in");this.update_form_btn.cancel();return;}if(confirm("Update?")){dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._UpdateCollateralCallBack),url:"/icollateral/collateral_update",content:this.update_form.get("value")}));}},_selection_changed:function(_a){},_get_context:function(){return {};},_delete:function(){if(confirm("Delete Selected Collateral")){dojo.xhrPost(ttl.utilities.makeParams({load:this._on_delete_collateral_call_back,url:"/icollateral/collateral_delete_selection"}));}},_on_delete_collateral_call:function(_b){if(_b.success=="OK"){alert("Collateral Deleted");this.grid.setQuery(ttl.utilities.getPreventCache({}));}else{alert("Problem Deleting Selected Collateral");}},_clear_filter:function(){this.ignore_automated.set("checked",false);},_filter:function(){var _c={};if(this.ignore_automated.get("checked")==true){_c["ignore_automated"]=1;}this.grid.setQuery(ttl.utilities.getPreventCache(_c));dojo.addClass(this.display_pane,"prmaxhidden");},_show_hide_fields:function(){if(this._has_global_newsroom){if(this.clientid.get("value")!=-1&&this.clientid.get("value")!="-1"){this.newsroomid.set("value",-1);dojo.addClass(this.newsroom_label,"prmaxhidden");dojo.addClass(this.newsroomid.domNode,"prmaxhidden");}else{dojo.removeClass(this.newsroom_label,"prmaxhidden");dojo.removeClass(this.newsroomid.domNode,"prmaxhidden");}if(this.newsroomid.get("value")!=-1&&this.newsroomid.get("value")!="-1"){this.clientid.set("value",-1);dojo.addClass(this.clientid.domNode,"prmaxhidden");dojo.addClass(this.client_label,"prmaxhidden");}else{dojo.removeClass(this.clientid.domNode,"prmaxhidden");dojo.removeClass(this.client_label,"prmaxhidden");}}}});}