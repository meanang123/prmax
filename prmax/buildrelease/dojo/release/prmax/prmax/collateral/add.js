/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.collateral.add"]){dojo._hasResource["prmax.collateral.add"]=true;dojo.provide("prmax.collateral.add");dojo.require("ttl.BaseWidget");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.Button");dojo.require("prmax.projects.projectselect");dojo.declare("prmax.collateral.add",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form  data-dojo-attach-point=\"collateral_form\" method=\"post\" name=\"collateral_form\" enctype=\"multipart/form-data\"  onSubmit=\"return false;\">\r\n\t\t<input class=\"prmaxinput\" type=\"hidden\" data-dojo-attach-point=\"collateral_cache\" name=\"collateral_cache\" value=\"-1\">\r\n\t\t<table width=\"99%\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\" >\r\n\t\t\t<tr><td width=\"120px\" align=\"right\" class=\"prmaxrowtag\">File Name</td><td><input size=\"30\" class=\"prmaxinput\" type=\"file\" data-dojo-attach-point=\"collateral_file\" name=\"collateral_file\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Code</td><td><input data-dojo-props='style:\"width:98%\", \"class\":\"prmaxrequired\", name:\"collateralcode\", type:\"text\", invalidMessage:\"Code field must be filled in\", maxLength:20, trim:true, required:true' data-dojo-attach-point=\"collateral_code\" data-dojo-type=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Description</td><td><input data-dojo-props='style:\"width:98%\", \"class\":\"prmaxrequired\", name:\"collateralname\", type:\"text\", maxLength:45, trim:true, required:true, invalidMessage:\"Description field must be filled in\"' data-dojo-attach-point=\"collateral_name\" data-dojo-type=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" data-dojo-attach-point=\"client_label\">Client</td><td><select data-dojo-attach-point=\"clientid\" data-dojo-props='searchAttr:\"clientname\", labelType:\"html\", style:\"width:98%\", name:\"clientid\"' data-dojo-type=\"dijit.form.FilteringSelect\" data-dojo-attach-event=\"onChange: _show_hide_fields\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag prmaxhidden\" data-dojo-attach-point=\"newsroom_label\">Newsroom</td><td><select data-dojo-attach-point=\"newsroomid\" data-dojo-props='\"class\":\"prmaxhidden\", searchAttr:\"description\", labelType:\"html\", style:\"width:98%\", name:\"newsroomid\"' data-dojo-type=\"dijit.form.FilteringSelect\" data-dojo-attach-event=\"onChange: _show_hide_fields\"/></td></tr>\r\n\t\t\t<tr><td colspan = \"2\" >&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\" colspan=\"2\" ><div data-dojo-props='\"class\":\"prmaxhidden\", name:\"collateral_projects\", startopen:true' data-dojo-attach-point=\"collateral_projects\" data-dojo-type=\"prmax.projects.projectselect\"></div></td></tr>\r\n\t\t\t<tr><td colspan = \"2\" >&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan = \"2\" ><span data-dojo-attach-point=\"progressNode\" style=\"display:none;\"><div data-dojo-type=\"dijit.ProgressBar\" data-dojo-attach-point=\"progressControl\" data-dojo-props='style:\"width:200px\", indeterminate:true'></div></span></td></tr>\r\n\t\t\t<tr><td align=\"left\"><button data-dojo-props='\"class\":\"prmaxbutton prmaxhidden\", label:\"Close\", type:\"button\"' data-dojo-attach-point=\"clearNode\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Close\"></button></td>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-props='\"class\":\"prmaxbutton\", type:\"button\", label:\"Add\"' data-dojo-attach-point=\"saveNode\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Add\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this._has_global_newsroom=PRMAX.utils.settings.has_global_newsroom;this._AddedCallback=dojo.hitch(this,this._Added);this._client_data=new dojox.data.QueryReadStore({url:"/clients/combo?include_no_select",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,urlPreventCache:true});this._newsroom_data=new dojox.data.QueryReadStore({url:"/newsroom/combo?include_no_select",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,urlPreventCache:true});this.inherited(arguments);},postCreate:function(){this.dlg=null;this.clientid.store=this._client_data;this.clientid.set("value",-1);this.newsroomid.store=this._newsroom_data;this.newsroomid.set("value",-1);if(PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro){dojo.removeClass(this.collateral_projects.domNode,"prmaxhidden");}this.inherited(arguments);},_Clear:function(){this.collateral_file.value="";this.collateral_name.set("value","");this.collateral_code.set("value","");this.progressNode.style.display="none";this.saveNode.set("disabled",false);},_Added:function(_1){this.progressNode.style.display="none";if(_1.success=="DU"){alert("Collateral Code Already Exists");}else{if(_1.success=="OK"){dojo.publish(PRCOMMON.Events.Collateral_Add,[_1.data]);alert("Collateral Added");this._Close();}else{if(_1.success=="FA"){alert(_1.message);}else{alert("Problem Adding Collateral");}}}},_Add:function(){if(this.collateral_name.get("value").length==0){alert("The Name field must be filled in");this.collateral_name.focus();return;}if(this.collateral_code.get("value").length==0){alert("The Code field must be filled in");this.collateral_code.focus();return;}var _2=dojo.attr(this.collateral_file,"value");if(_2==""||_2==null){alert("No Collateral File Specified");this.collateral_file.focus();return;}this.collateral_cache.value=new Date().valueOf();this.progressNode.style.display="block";dojo.io.iframe.send({url:"/icollateral/collateral_add",handleAs:"json",load:this._AddedCallback,form:this.collateral_form});},Clear:function(){this._Clear();},_Close:function(){this.Clear();this.dlg.hide();},showClose:function(_3){this.dlg=_3;dojo.removeClass(this.clearNode,"prmaxhidden");},_show_hide_fields:function(){if(this._has_global_newsroom){if(this.clientid.get("value")!=-1&&this.clientid.get("value")!="-1"){this.newsroomid.set("value",-1);dojo.addClass(this.newsroomid.domNode,"prmaxhidden");dojo.addClass(this.newsroom_label,"prmaxhidden");}else{dojo.removeClass(this.newsroomid.domNode,"prmaxhidden");dojo.removeClass(this.newsroom_label,"prmaxhidden");}if(this.newsroomid.get("value")!=-1&&this.newsroomid.get("value")!="-1"){this.clientid.set("value",-1);dojo.addClass(this.clientid.domNode,"prmaxhidden");dojo.addClass(this.client_label,"prmaxhidden");}else{dojo.removeClass(this.clientid.domNode,"prmaxhidden");dojo.removeClass(this.client_label,"prmaxhidden");}}}});}