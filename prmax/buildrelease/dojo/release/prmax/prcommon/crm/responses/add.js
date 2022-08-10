/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.crm.responses.add"]){dojo._hasResource["prcommon.crm.responses.add"]=true;dojo.provide("prcommon.crm.responses.add");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Button");dojo.require("prcommon.documents.upload");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("prmax.projects.projectselect");dojo.declare("prcommon.crm.responses.add",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form data-dojo-attach-point=\"statement_form\" data-dojo-type=\"dijit.form.Form\" data-dojo-props='\"onSubmit\":\"return false\", name:\"statement_form\", style:\"margin:5px\"'>\r\n\t\t<table width=\"99%\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\" >\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Description</td><td><input data-dojo-props='style:\"width:400px\", \"class\":\"prmaxrequired\", name:\"statementdescription\", type:\"text\", maxLength:45, trim:true, required:true, invalidMessage:\"Description field must be filled in\"' data-dojo-attach-point=\"statementdescription\" data-dojo-type=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Client</td><td><select data-dojo-attach-point=\"clientid\" data-dojo-props='searchAttr:\"clientname\", labelType:\"html\", style:\"width:400px\", name:\"clientid\"' data-dojo-type=\"dijit.form.FilteringSelect\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Issue</td><td><select data-dojo-attach-point=\"issueid\" data-dojo-props='searchAttr:\"name\", labelType:\"html\", style:\"width:400px\", name:\"issueid\"' data-dojo-type=\"dijit.form.FilteringSelect\" /></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"output_node\"><td align=\"right\" class=\"prmaxrowtag\"><label>Output</td>\r\n\t\t\t\t<td><div data-dojo-type=\"dijit.Editor\" data-dojo-attach-point=\"output\" data-dojo-props='name:\"output\",style:\"width:400px;height:350px;border:1px solid gray\"'  extraPlugins=\"[{name:'dijit._editor.plugins.FontChoice', command:'fontName', generic:false},'fontSize','createLink','viewsource','preview','mergefields']\"></div></td>\r\n\t\t\t\t<td valign=\"top\"><button data-dojo-attach-event=\"onClick:_LoadWord\" data-dojo-attach-point=\"uploaddocbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-upload\",type:\"button\",\"class\":\"prmaxdefault\", title:\"Upload document\", sourcename:\"response_add\"' ></button><br/></td>\r\n\t\t\t</tr>            \r\n\t\t\t<tr><td colspan = \"2\" align=\"left\"><button data-dojo-props='\"class\":\"prmaxbutton prmaxhidden\", label:\"Close\", type:\"button\"' data-dojo-attach-point=\"clearNode\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Close\"></button></td>\r\n\t\t\t\t<td align=\"right\"><button data-dojo-props='\"class\":\"prmaxbutton\", type:\"button\", label:\"Add\"' data-dojo-attach-point=\"saveNode\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Add\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"upload_doc_dlg\" data-dojo-props='title:\"Upload document\",style:\"width:450px;height:260px\"'>\r\n\t\t<div data-dojo-type=\"prcommon.documents.upload\" data-dojo-attach-point=\"upload_doc_ctrl\" data-dojo-props='sourcename:\"response_add\"'></div><br/>\r\n\t\t<div data-dojo-attach-event=\"onClick:_close_dlg\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='label:\"Close\",style:\"float:left;padding-right:20px\"'></div>\r\n\t</div>\t\r\n</div>\r\n",constructor:function(){this._AddedCallback=dojo.hitch(this,this._Added);this._client_data=new dojox.data.JsonRestStore({target:"/clients/rest_combo",idAttribute:"id"});this._issues_data=new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest",idAttribute:"id"});this._mode="";this._output="";dojo.subscribe(PRCOMMON.Events.Word_Html_Data,dojo.hitch(this,this._word_html_data_event));this.inherited(arguments);},postCreate:function(){this.icustomerid=PRMAX.utils.settings.cid;this.upload_doc_ctrl.Load(this.upload_doc_dlg);this.clientid.store=this._client_data;this.clientid.set("value",-1);this.issueid.store=this._issues_data;this.issueid.set("value",-1);this.inherited(arguments);},Load:function(_1,_2,_3){this._dialog=_1;if(_2!=undefined&&_2!=null){this._mode=_2;}if(_3!=undefined&&_3!=null){this._output=_3;}if(this._mode=="save"){dojo.addClass(this.output_node,"prmaxhidden");this._dialog.resize({w:600,h:200});}},_Clear:function(){this.statementdescription.set("value","");this.output.set("value","");this.clientid.set("value","-1");this.issueid.set("value","-1");this.saveNode.set("disabled",false);},_Added:function(_4){if(_4.success=="DU"){alert("Statement Already Exists");}else{if(_4.success=="OK"){dojo.publish("/statement/add",[_4.data]);alert("Statement Added");this._Close();}else{if(_4.success=="FA"){alert(_4.message);}else{alert("Problem Adding Statement");}}}},_Add:function(){if(ttl.utilities.formValidator(this.statement_form)==false){alert("Please Enter Details");return false;}var _5=this.statement_form.get("value");if(this._output){_5["output"]=this._output;}dojo.xhrPost(ttl.utilities.makeParams({load:this._AddedCallback,url:"/statement/statement_add",content:_5}));},Clear:function(){this._Clear();},showClose:function(_6){this.dlg=_6;dojo.removeClass(this.clearNode,"prmaxhidden");},_LoadWord:function(){this.upload_doc_dlg.show();},_close_dlg:function(){this.upload_doc_ctrl.Clear();this.upload_doc_dlg.hide();},_upload_doc:function(){this.upload_doc_dlg.show();},_word_html_data_event:function(_7){if(_7.sourcename=="response_add"){this.output.set("value",_7.html);}},_Close:function(){this.upload_doc_ctrl.Clear();this.upload_doc_dlg.hide();this._dialog.hide();},});}