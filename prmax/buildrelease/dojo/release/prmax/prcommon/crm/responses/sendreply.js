/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.crm.responses.sendreply"]){dojo._hasResource["prcommon.crm.responses.sendreply"]=true;dojo.provide("prcommon.crm.responses.sendreply");dojo.require("prcommon.clippings.add_server");dojo.require("prcommon.documents.upload");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("prmax.email.loadworddocument");dojo.require("prcommon.crm.responses.search");dojo.require("prcommon.crm.responses.add");dojo.require("dijit.ProgressBar");dojo.declare("prcommon.crm.responses.sendreply",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit.form.Form\" data-dojo-props='\"onSubmit\":\"return false\", style:\"margin:5px\"'>\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" >\r\n\t\t\t<tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>Subject</label></td><td><input data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-attach-point=\"emailsubject\" data-dojo-props='placeHolder:\"Enter Email Subject\",required:true,name:\"emailsubject\",trim:true,type:\"text\",style:\"width:400px\"'></td></tr>\r\n\t\t\t<tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>From</label></td><td><select data-dojo-props='name:\"customeremailserverid\",autoComplete:true,labelType:\"html\", style:\"width:400px\"' data-dojo-type=\"dijit.form.Select\" data-dojo-attach-point=\"customeremailserverid\" ></select></td>\r\n\t\t\t<td><button data-dojo-attach-event=\"onClick:_add_server\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"'>Add</button><br/></td></tr>\r\n\t\t\t<tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>To</label></td><td><input data-dojo-props='name:\"toemailaddress\",required:true,trim:true,type:\"text\",style:\"width:400px\"' data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-attach-point=\"toemailaddress\" ></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>CC</label></td><td><input data-dojo-props='name:\"ccemailaddresses\",required:true,trim:true,type:\"text\",style:\"width:400px\"' data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"ccemailaddresses\" ></input></td></tr>\r\n\r\n\t\t\t<tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>Body</label></td><td><div data-dojo-type=\"dijit.Editor\" data-dojo-attach-point=\"emailbody\" data-dojo-props='name:\"emailbody\",style:\"width:400px;height:350px;border:1px solid gray\"'  extraPlugins=\"[{name:'dijit._editor.plugins.FontChoice', command:'fontName', generic:false},'fontSize','createLink','viewsource','preview','mergefields']\"></div></td>\r\n\t\t\t\t<td valign=\"top\">\r\n\t\t\t\t\t<span><button data-dojo-attach-event=\"onClick:_LoadWord\" data-dojo-attach-point=\"uploaddocbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-upload\",type:\"button\",\"class\":\"prmaxdefault\", title:\"Upload document\", sourcename:\"sendreply\"' ></button><br/><br/></span>\r\n\t\t\t\t\t<span><button data-dojo-attach-event=\"onClick:_SearchStatement\" data-dojo-attach-point=\"searchstatementbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-search\",type:\"button\",\"class\":\"prmaxdefault\", title:\"Search Statement\"' ></button><br/><br/></span>\r\n\t\t\t\t\t<span><button data-dojo-attach-event=\"onClick:_AddStatement\" data-dojo-attach-point=\"addstatementbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-floppy-o\",type:\"button\",\"class\":\"prmaxdefault\", title:\"Add Statement\"' ></button><br/><br/></span>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td colspan=\"3\"><button data-dojo-attach-event=\"onClick:_send\" data-dojo-attach-point=\"sendbtn\" data-dojo-type=\"dojox.form.BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Sending...\",label:\"Send\",\"class\":\"btnright\"'></button></td></tr>\r\n\t\t</table></br></br>\r\n\t</form>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"add_server_dialog\" data-dojo-props='title:\"Add Email Server\",style:\"width:500px;height:300px\"'>\r\n\t\t<div data-dojo-type=\"prcommon.clippings.add_server\" data-dojo-attach-point=\"add_server_ctrl\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"upload_doc_dlg\" data-dojo-props='title:\"Upload document\",style:\"width:450px;height:260px\"'>\r\n\t\t<div data-dojo-type=\"prcommon.documents.upload\" data-dojo-attach-point=\"upload_doc_ctrl\" data-dojo-props='sourcename:\"sendreply\"'></div><br/>\r\n\t\t<div data-dojo-attach-event=\"onClick:_close_dlg\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='label:\"Close\",style:\"float:left;padding-right:20px\"'></div>\r\n\t</div>\r\n\t<div>\r\n\t\t<div data-dojo-attach-point=\"search_statement_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Search Statement\", style:\"width:400px;height:150px\"'>\r\n\t\t<div data-dojo-attach-point=\"searchstatementctrl\" data-dojo-type=\"prcommon.crm.responses.search\" style=\"width:400px;height:150px\"></div>\r\n\t</div>\r\n\t<div>\r\n\t\t<div data-dojo-attach-point=\"add_statement_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"New Statement\", style:\"width:600px;height:500px\"'>\r\n\t\t<div data-dojo-attach-point=\"addstatementctrl\" data-dojo-type=\"prcommon.crm.responses.add\" style=\"width:600px;height:500px\"></div>\r\n\t</div>\r\n</div>\r\n</div>\r\n",constructor:function(){this._send_call_back=dojo.hitch(this,this._send_call);this._customerid=PRMAX.utils.settings.cid;this._customeremailserver=new prcommon.data.QueryWriteStore({url:"/common/lookups?searchtype=customeremailserver"});this._statements=new prcommon.data.QueryWriteStore({url:"/common/lookups?searchtype=statements"});dojo.subscribe("customeremailserver/add",dojo.hitch(this,this._add_customeremailserver_event));this.userid=PRMAX.utils.settings.uid;this.userccaddresses=PRMAX.utils.settings.ccaddresses;this._contacthistoryid="";this._statementid="";dojo.subscribe(PRCOMMON.Events.Word_Html_Data,dojo.hitch(this,this._word_html_data_event));dojo.subscribe("/statement/get",dojo.hitch(this,this._get_statement_event));dojo.subscribe("/usersettings/ccaddresses",dojo.hitch(this,this._get_ccaddresses_event));},postCreate:function(){this.upload_doc_ctrl.Load(this.upload_doc_dlg);this.inherited(arguments);this.customeremailserverid.set("store",this._customeremailserver);},load:function(_1,_2,_3,_4){this._dialog=_1;this.emailsubject.set("value",_2);this.toemailaddress.set("value",_4);this._contacthistoryid=_3;this.emailbody.set("value","");this.ccemailaddresses.set("value",this.userccaddresses);},_LoadWord:function(){this.upload_doc_ctrl.Clear();this.upload_doc_dlg.show();},_SearchStatement:function(){this.searchstatementctrl.Load(this.search_statement_dlg);this.search_statement_dlg.show();},_AddStatement:function(){this.addstatementctrl.Load(this.add_statement_dlg,"save",this.emailbody.value);this.add_statement_dlg.show();this.add_statement_dlg.resize({w:600,h:200});},_Close:function(){this.upload_doc_ctrl.Clear();this.upload_doc_dlg.hide();},_word_html_data_event:function(_5){if(_5.sourcename=="sendreply"){this.emailbody.set("value",_5.html);}},_get_statement_event:function(_6){this._statementid=_6.data.statementid;this.emailbody.set("value",_6.data.output);},_get_ccaddresses_event:function(_7){this.userccaddresses=_7.control.ccaddresses;this.ccemailaddresses.set("value",this.userccaddresses);},_add_server:function(){this.add_server_dialog.show();this.add_server_ctrl.load(this.add_server_dialog,this._customerid);},_add_customeremailserver_event:function(_8){var _9={};_9.id=_8.customeremailserverid;_9.name=_8.fromemailaddress;this._customeremailserver.newItem(_9);this.customeremailserverid.set("value",_8.customeremailserverid);},_send:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Please Enter Details");this.sendbtn.cancel();return false;}var _a=this.form.get("value");_a["userid"]=this.userid;_a["contacthistoryid"]=this._contacthistoryid;_a["exclude_images"]=true;_a["statementid"]=this._statementid;dojo.xhrPost(ttl.utilities.makeParams({load:this._send_call_back,url:"/crm/update_response",content:_a}));},_send_call:function(_b){if(_b.success=="OK"){dojo.publish("/crm/update_response",[_b]);alert("Reply has been sent");this.sendbtn.cancel();this._dialog.hide();}else{alert("Problem sending reply");}this.sendbtn.cancel();},_upload_doc:function(){this.upload_doc_dlg.show();},_close_dlg:function(){this.upload_doc_ctrl.Clear();this.upload_doc_dlg.hide();}});}