/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.crm.responses.resend"]){dojo._hasResource["prcommon.crm.responses.resend"]=true;dojo.provide("prcommon.crm.responses.resend");dojo.require("prcommon.clippings.add_server");dojo.require("prcommon.crm.responses.update");dojo.require("prmax.pressrelease.update");dojo.declare("prcommon.crm.responses.resend",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n    <div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-point='style:\"width:100%;height:100%\",gutters:false' >\r\n        <div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-attach-point=\"resendview\">\r\n            <form data-dojo-attach-point=\"resendForm\" onsubmit=\"return false\" data-dojo-type=\"dijit.form.Form\" data-dojo-point='style:\"margin:15px\"'>\r\n                <table width=\"98%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n                    <tr><td >&nbsp;</td></tr>\r\n                    <tr><td></td><td><input data-dojo-attach-point=\"option0\" data-dojo-attach-event=\"onClick:_option_changed\" data-dojo-props='\"class\":\"prmaxlabeltag\",type:\"radio\",name:\"option\",value:\"0\",checked:\"checked\"' data-dojo-type=\"dijit.form.RadioButton\" /><label>Statement</label></td></tr>\r\n                    <tr><td></td><td><input data-dojo-attach-point=\"option1\" data-dojo-attach-event=\"onClick:_option_changed\" data-dojo-props='\"class\":\"prmaxlabeltag\",type:\"radio\",name:\"option\",value:\"1\"' data-dojo-type=\"dijit.form.RadioButton\" /><label data-dojo-attach-point=\"distr_label\">Distribution</label></td></tr>\r\n                    <tr><td >&nbsp;</td></tr>\r\n                    <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\" data-dojo-attach-point=\"statement_label\"><label>Statement</label></td>\r\n                        <td data-dojo-attach-point=\"statement_node\">\r\n                            <span><select data-dojo-attach-point=\"statementid\" data-dojo-props='searchAttr:\"statementdescription\", name:\"statementid\",autoComplete:true,labelType:\"html\", style:\"width:300px\", value:\"-1\"' data-dojo-type=\"dijit.form.FilteringSelect\"></select></span>\r\n                            <span><button data-dojo-attach-event=\"onClick:_AddStatement\" data-dojo-attach-point=\"addstatementbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"' >Add</button><br/></span>\r\n                        </td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td align=\"right\" width=\"15%\" class=\"prmaxrowtag prmaxhidden\" data-dojo-attach-point=\"emailtemplate_label\">Distribution22</td>\r\n                        <td data-dojo-attach-point=\"emailtemplate_node\" class=\"prmaxhidden\"><select  data-dojo-attach-point=\"emailtemplateid\" data-dojo-props='searchAttr:\"emailtemplatename\", name:\"emailtemplateid\", labelType:\"html\",style:\"width:300px\", value:\"-1\"' data-dojo-type=\"dijit.form.FilteringSelect\"></select></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>From</label></td><td>\r\n                            <span><select data-dojo-props='name:\"customeremailserverid\",autoComplete:true,labelType:\"html\", style:\"width:300px\",' data-dojo-type=\"dijit.form.Select\" data-dojo-attach-point=\"customeremailserverid\" ></select></span>\r\n                            <span><button data-dojo-attach-event=\"onClick:_add_server\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"'>Add</button><br/></span>\r\n                        </td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>To</label></td>\r\n                        <td data-dojo-props='\"class:\"prmaxinput\"'><input data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-attach-point=\"toemailaddress\" data-dojo-props='placeHolder:\"Enter Email Address\",required:true,name:\"toemailaddress\",trim:true,type:\"text\",style:\"width:300px\"'></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>CC</label></td>\r\n                        <td><input data-dojo-props='name:\"ccemailaddresses\",required:true,trim:true,type:\"text\",style:\"width:300px\"' data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"ccemailaddresses\" ></input></td>\r\n                    </tr>\r\n                    <tr><td align=\"left\"><button class=\"prmaxbutton\" data-dojo-attach-point=\"editbtn\" data-dojo-attach-event=\"onClick:_edit\" data-dojo-type=\"dijit.form.Button\">Edit</button></td></tr>\r\n                    <tr><td align=\"left\"><button class=\"prmaxbutton\" data-dojo-attach-point=\"previewbtn\" data-dojo-attach-event=\"onClick:_preview\" data-dojo-type=\"dijit.form.Button\">Preview</button></td>\r\n                    <td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\" data-dojo-attach-point=\"resendbtn\" data-dojo-attach-event=\"onClick:_resend\" data-dojo-type=\"dijit.form.Button\">Re-send</button></td></tr>\r\n                </table>\r\n            </form>\r\n        </div>\r\n    </div>\r\n\r\n    <div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"add_server_dialog\" data-dojo-props='title:\"Add Email Server\",style:\"width:500px;height:300px\"'>\r\n        <div data-dojo-type=\"prcommon.clippings.add_server\" data-dojo-attach-point=\"add_server_ctrl\"></div>\r\n    </div>\r\n    <div>\r\n        <div data-dojo-attach-point=\"add_statement_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"New Statement\", style:\"width:600px;height:500px\"'>\r\n        <div data-dojo-attach-point=\"addstatementctrl\" data-dojo-type=\"prcommon.crm.responses.add\" style=\"width:600px;height:500px\"></div>\r\n    </div>\r\n    <div>\r\n        <div data-dojo-attach-point=\"update_statement_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Edit Statement\", style:\"width:800px;height:600px\"'>\r\n        <div data-dojo-attach-point=\"updatestatementctrl\" data-dojo-type=\"prcommon.crm.responses.update\" style=\"width:600px;height:500px\"></div>\r\n    </div>\r\n    <div>\r\n        <div data-dojo-attach-point=\"update_emailtemplate_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Edit Press Release\", style:\"width:800px;height:600px\"'>\r\n        <div data-dojo-attach-point=\"updateemailtemplatectrl\" data-dojo-type=\"prmax.pressrelease.update\" style=\"width:600px;height:500px\"></div>\r\n    </div>\r\n\r\n</div>\r\n",constructor:function(){this._ResendCallback=dojo.hitch(this,this._ResendCall);this._StatementCallBack=dojo.hitch(this,this._StatementCall);this._UpdateStatementCallBack=dojo.hitch(this,this._UpdateStatementCall);this._EmailTemplateCallBack=dojo.hitch(this,this._EmailTemplateCall);this._customerid=PRMAX.utils.settings.cid;this.userccaddresses=PRMAX.utils.settings.ccaddresses;this._customeremailserver=new prcommon.data.QueryWriteStore({url:"/common/lookups?searchtype=customeremailserver"});dojo.subscribe("/statement/add",dojo.hitch(this,this._AddStatementEvent));dojo.subscribe("/usersettings/ccaddresses",dojo.hitch(this,this._get_ccaddresses_event));dojo.subscribe("customeremailserver/add",dojo.hitch(this,this._add_customeremailserver_event));dojo.subscribe("/update/distribution_label",dojo.hitch(this,this._UpdateDistributionLabelEvent));this._statements=new dojox.data.JsonRestStore({target:"/statement/statement_combo_rest",idAttribute:"id"});this._emailtemplates=new dojox.data.JsonRestStore({target:"/emails/templates_list_rest",idAttribute:"id"});},postCreate:function(){this.customeremailserverid.set("store",this._customeremailserver);this.statementid.set("store",this._statements);this.emailtemplateid.set("store",this._emailtemplates);this.statementid.set("value",-1);dojo.attr(this.distr_label,"innerHTML",PRMAX.utils.settings.distribution_description);dojo.attr(this.emailtemplate_label,"innerHTML",PRMAX.utils.settings.distribution_description);this.inherited(arguments);},_UpdateDistributionLabelEvent:function(){dojo.attr(this.distr_label,"innerHTML",PRMAX.utils.settings.distribution_description);dojo.attr(this.emailtemplate_label,"innerHTML",PRMAX.utils.settings.distribution_description);},_resend:function(){if(this.toemailaddress.get("value")==undefined||this.toemailaddress.get("value")==""){alert("Please Enter Details");this.toemailaddress.focus();return false;}var _1={};_1["customeremailserverid"]=this.customeremailserverid.get("value");_1["toemailaddress"]=this.toemailaddress.get("value");_1["ccemailaddresses"]=this.ccemailaddresses.get("value");_1["employeeid"]=this._employeeid;if(this.option0.get("checked")){_1["statementid"]=this.statementid.value;}if(this.option1.get("checked")){_1["emailtemplateid"]=this.emailtemplateid.value;}dojo.xhrPost(ttl.utilities.makeParams({load:this._ResendCallback,url:"/crm/resend",content:_1}));},_ResendCall:function(_2){if(_2.success=="OK"){alert("Email has been sent");}else{alert("Problem Sending Email");}},_Clear:function(){},Load:function(_3,_4){this.toemailaddress.set("value",_3);this.statementid.set("value",-1);this.emailtemplateid.set("value",-1);this.ccemailaddresses.set("value",this.userccaddresses);this._employeeid=_4;},_add_server:function(){this.add_server_dialog.show();this.add_server_ctrl.load(this.add_server_dialog,this._customerid);},_add_customeremailserver_event:function(_5){var _6={};_6.id=_5.customeremailserverid;_6.name=_5.fromemailaddress;this._customeremailserver.newItem(_6);this.customeremailserverid.set("value",_5.customeremailserverid);},_AddStatement:function(){this.addstatementctrl.Load(this.add_statement_dlg);this.add_statement_dlg.show();},_AddStatementEvent:function(_7){_7.id=_7.statementid;_7.name=_7.statementdescription;this._statements.newItem(_7);this.statementid.set("value",_7.statementid);},_get_ccaddresses_event:function(_8){this.userccaddresses=_8.control.ccaddresses;this.ccemailaddresses.set("value",this.userccaddresses);},_add_customeremailserver_event:function(_9){var _a={};_a.id=_9.customeremailserverid;_a.name=_9.fromemailaddress;this._customeremailserver.newItem(_a);this.customeremailserverid.set("value",_9.customeremailserverid);},_option_changed:function(){if(this.option0.get("checked")){dojo.removeClass(this.statement_label,"prmaxhidden");dojo.removeClass(this.statement_node,"prmaxhidden");dojo.addClass(this.emailtemplate_label,"prmaxhidden");dojo.addClass(this.emailtemplate_node,"prmaxhidden");this.emailtemplateid.set("value",-1);this.statementid.set("value",-1);}else{if(this.option1.get("checked")){dojo.addClass(this.statement_label,"prmaxhidden");dojo.addClass(this.statement_node,"prmaxhidden");dojo.removeClass(this.emailtemplate_label,"prmaxhidden");dojo.removeClass(this.emailtemplate_node,"prmaxhidden");this.statementid.set("value",-1);this.emailtemplateid.set("value",-1);}}},_preview:function(){if(this.option0.get("checked")){this._show_statement();}if(this.option1.get("checked")){this._show_emailtemplate();}},_show_statement:function(id){var _b={};_b["statementid"]=this.statementid.get("value");dojo.xhrPost(ttl.utilities.makeParams({load:this._StatementCallBack,url:"/statement/statement_get",content:_b}));},_StatementCall:function(_c){if(_c.success=="OK"){content="<html>\n\t<head></head>\n\t<body>\n"+_c.data.output+"\n\t</body>\n</html>";var _d=window.open("javascript: ''","","status=1,menubar=0,location=0,toolbar=0");_d.document.open();_d.document.write(content);_d.document.close();}},_show_emailtemplate:function(id){var _e={};_e["emailtemplateid"]=this.emailtemplateid.get("value");dojo.xhrPost(ttl.utilities.makeParams({load:this._EmailTemplateCallBack,url:"/emails/templates_get",content:_e}));},_EmailTemplateCall:function(_f){if(_f.success=="OK"){content="<html>\n\t<head></head>\n\t<body>\n"+_f.data.emailtemplatecontent+"\n\t</body>\n</html>";var win=window.open("javascript: ''","","status=1,menubar=0,location=0,toolbar=0");win.document.open();win.document.write(content);win.document.close();}},_edit:function(){if(this.option0.get("checked")){this._edit_statement();}if(this.option1.get("checked")){this._edit_emailtemplate();}},_edit_statement:function(id){this.update_statement_dlg.show();this.updatestatementctrl.Load(this.update_statement_dlg,this.statementid.get("value"));},_edit_emailtemplate:function(id){this.update_emailtemplate_dlg.show();this.updateemailtemplatectrl.Load(this.update_emailtemplate_dlg,this.emailtemplateid.get("value"));},});}