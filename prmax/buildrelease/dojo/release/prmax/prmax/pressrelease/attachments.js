/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.pressrelease.attachments"]){dojo._hasResource["prmax.pressrelease.attachments"]=true;dojo.provide("prmax.pressrelease.attachments");dojo.declare("prmax.pressrelease.attachments",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div dojoAttachPoint=\"frame\" dojoType=\"dijit.layout.BorderContainer\" gutters=\"false\" style=\"width:100%;height:100%\">\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" region=\"right\" style=\"width:10em;height:100%\">\r\n\t\t\t<button class=\"prmaxbutton\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_AddFile\" type=\"button\" >Add File</button>\r\n\t\t\t<br/>\r\n\t\t\t<button class=\"prmaxbutton\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_AddCollateral\" type=\"button\" >Add From Collateral</button>\r\n\t\t</div>\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" region=\"center\">\r\n\t\t\t<div dojoAttachPoint=\"attgrid\" dojoType=\"dojox.grid.DataGrid\" query=\"{ }\" rowsPerPage=\"150\" style=\"width:100%;height:100%\"></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div dojoType=\"dijit.Dialog\" title=\"Add Attachment From File\" dojoAttachPoint=\"attfiledlg\">\r\n\t\t<form dojoAttachPoint=\"attfileform\" method=\"post\" name=\"form\" enctype=\"multipart/form-data\" onSubmit=\"return false;\">\r\n\t\t\t<input type=\"hidden\"  dojoAttachPoint=\"emailtemplateid1\" name=\"emailtemplateid\" dojoType=\"dijit.form.TextBox\" ></input>\r\n\t\t\t<table width=\"300px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">File</td><td><input class=\"prmaxinput\" type=\"file\" dojoAttachPoint=\"attfilename\" name=\"attfilename\" size=\"50\"></input></td></tr>\r\n\t\t\t\t<tr><td align=\"left\"><button dojoAttachEvent=\"onClick:_CloseAttFileDlg\" dojoAttachPoint=\"closeNode\" dojoType=\"dijit.form.Button\" type=\"button\" label=\"Close\"></button></td>\r\n\t\t\t\t\t\t<td align=\"right\"><button dojoAttachPoint=\"attfilebtn\" dojoType=\"dojox.form.BusyButton\" type=\"button\" busyLabel=\"Please Wait Uploading file\" dojoAttachEvent=\"onClick:_UploadFile\">Add File</button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div dojoType=\"dijit.Dialog\" title=\"Add Attachment From Collateral\" dojoAttachPoint=\"attcolldlg\">\r\n\t\t<form class=\"prmaxdefault\" dojoAttachPoint=\"attcollform\" dojoType=\"dijit.form.Form\" onSubmit=\"return false\">\r\n\t\t\t<input type=\"hidden\"  dojoAttachPoint=\"emailtemplateid2\" name=\"emailtemplateid\" dojoType=\"dijit.form.TextBox\" ></input>\r\n\t\t\t<table width=\"300px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">Collateral Code</td><td><input name=\"collateralid\" dojoType='dijit.form.FilteringSelect' required=\"true\" labelType=\"html\" labelAttr=\"collateralcode\" searchAttr=\"collateralcode\" dojoAttachPoint='collateralcodes' /></td></tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"left\"><button dojoAttachEvent=\"onClick:_CloseAttCollDlg\" dojoAttachPoint=\"closeNode\" dojoType=\"dijit.form.Button\" type=\"button\" label=\"Close\"></button></td>\r\n\t\t\t\t\t<td align=\"right\" ><button dojoAttachPoint=\"attcollbtn\" dojoType=\"dojox.form.BusyButton\" type=\"button\" busyLabel=\"Please Wait Adding Collateral\" dojoAttachEvent=\"onClick:_UploadCollateral\">New Collateral</button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this._loaded=false;this._AddFileCallBack=dojo.hitch(this,this._AddFileCall);this._DeleteAttCallBack=dojo.hitch(this,this._DeleteAttCall);this._AddCollCallBack=dojo.hitch(this,this._AddCollCall);this._ErrorCallBack=dojo.hitch(this,this._Error);},Load:function(_1){if(this._loaded==false){this.model=new prcommon.data.QueryWriteStore({url:"/emails/attachement_list?emailtemplateid="+_1,onError:ttl.utilities.globalerrorchecker,nocallback:true});this.attgrid.setStore(this.model);}else{this.attgrid.setQuery(ttl.utilities.getPreventCache({emailtemplateid:_1}));}this.emailtemplateid1.set("value",_1);this.emailtemplateid2.set("value",_1);this.coll_store=new dojox.data.QueryReadStore({url:"/icollateral/collateral_list?emailtemplateid="+_1,onError:ttl.utilities.globalerrorchecker});this.collateralcodes.set("store",this.coll_store);},postCreate:function(){this.attgrid.set("structure",this.view);this.attgrid["onCellClick"]=dojo.hitch(this,this._OnCellClick);this.inherited(arguments);},view:{cells:[[{name:"Name",width:"auto",field:"filename"},{name:"Size",width:"50px",field:"size",formatter:ttl.utilities.formatMb},{name:" ",width:"13px",styles:"text-align: center;",width:"20px",formatter:ttl.utilities.deleteRowCtrl}]]},_DeleteAttCall:function(_2){if(_2.success=="OK"){this.model.deleteItem(this._Row);alert("Attachment Removed");}else{alert("Problem removing Attachment");}},_OnCellClick:function(e){if(e.cellIndex==2){this._Row=this.attgrid.getItem(e.rowIndex);if(confirm("Remove Attachment?")){dojo.xhrPost(ttl.utilities.makeParams({load:this._DeleteAttCallBack,url:"/emails/attachement_delete",content:{emailtemplateid:this.emailtemplateid,emailtemplatesattachementid:this._Row.i.emailtemplatesattachementid}}));}}},resize:function(){this.frame.resize(arguments[0]);this.inherited(arguments);},_AddCollateral:function(){this.attcollbtn.cancel();this.attcolldlg.show();},_AddFile:function(){this.attfilebtn.cancel();this.attfiledlg.show();},_AddFileCall:function(_3){if(_3.success=="OK"){this.model.newItem(_3.data);this.attfiledlg.hide();this._ClearAttForm();}else{alert("Problem Adding file");this.attfilebtn.cancel();}},_ClearAttForm:function(){this.attfilebtn.cancel();dojo.attr(this.attfilename,"value","");},_CloseAttFileDlg:function(){this.attfiledlg.hide();},_CloseAttCollDlg:function(){this.attcolldlg.hide();},_UploadFile:function(){if(confirm("Upload Attachment")){dojo.io.iframe.send({url:"/emails/attachement_add_file",contentType:"multipart/form-data",method:"post",handleAs:"json",load:this._AddFileCallBack,form:this.attfileform,error:this._ErrorCallBack,preventCache:true,timeout:600000});}},_UploadCollateral:function(){if(ttl.utilities.formValidator(this.attcollform)==false){alert("Not all required field filled in");this.attcollbtn.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._AddCollCallBack,url:"/emails/attachement_add_coll",content:this.attcollform.get("value")}));},_AddCollCall:function(_4){if(_4.success=="OK"){this.model.newItem(_4.data);this.attcollbtn.cancel();this.attcolldlg.hide();}else{alert("Problem Adding Collateral");this.attcollbtn.cancel();}},isValid:function(){var _5=0;if(this.model){for(var c=0;c<this.model._items.length;c++){if(this.model._items[c]==null){continue;}_5+=parseFloat(this.model._items[c].i.size);}}if(_5>3000000){alert("Attachments limited to less than 3MB");return false;}else{return true;}},_Error:function(_6,_7){alert("Problem Uploading Attachment");this.attfilebtn.cancel();}});}