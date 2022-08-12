/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.sales.ReActivateDemo"]){dojo._hasResource["prmax.iadmin.sales.ReActivateDemo"]=true;dojo.provide("prmax.iadmin.sales.ReActivateDemo");dojo.declare("prmax.iadmin.sales.ReActivateDemo",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-type=\"dijit.form.Form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"icustomerid\"' data-dojo-attach-point=\"icustomerid\" data-dojo-type=\"dijit.form.TextBox\" ></input>\r\n\t\t<table class=\"prmaxtable\" width=\"500px\"  border=\"0\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Email Address</td><td><input data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",size:\"40\",maxlength:\"80\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\"' data-dojo-attach-point=\"email\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Contact Name</td><td><input data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"displayname\",type:\"text\",size:\"80\",maxlength:\"80\",trim:true,required:true' data-dojo-attach-point=\"displayname\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >End Date</td><td><input data-dojo-props='type:\"text\",required:true,name:\"licence_expire\",style:\"width:8em\"' data-dojo-attach-point=\"licence_expire\" data-dojo-type=\"dijit.form.DateTextBox\"><td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Send Email</td><td><input data-dojo-attach-point=\"sendemail\" data-dojo-props='value:\"true\",name:\"sendemail\",type:\"checkBox\"' data-dojo-type=\"dijit.form.CheckBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Assigned To</td><td><select data-dojo-props='\"class\":\"prmaxrequired\",required:true,name:\"assigntoid\",autoComplete:true,style:\"width:15em\",labelType:\"html\"' data-dojo-attach-point=\"assigntoid\"  data-dojo-type=\"dijit.form.FilteringSelect\" ></select></td></td></tr>\r\n\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-point=\"updBtn\" data-dojo-type=\"dojox.form.BusyButton\" data-dojo-props='busyLabel:\"Please Wait Updating...\",label:\"Re-Activate\",\"class\":\"prmaxbutton\"' data-dojo-attach-event=\"onClick:_Update\" ></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n\r\n",constructor:function(){this._UpdatedCallBack=dojo.hitch(this,this._UpdatedCall);this._LoadedCallBack=dojo.hitch(this,this._LoadedCall);this._userfilter=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=users&group=sales"});},postCreate:function(){this.assigntoid.set("store",this._userfilter);},Load:function(_1,_2){this.updBtn.set("disabled",true);this.icustomerid.set("value",_1);this._dialog=_2;dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadedCallBack,url:"/iadmin/get_internal",content:{icustomerid:_1}}));},_LoadedCall:function(_3){if(_3.success=="OK"){var td=new Date();var t=new Date(td.getTime()+4*24*60*60*1000);this.licence_expire.set("value",t);this.email.set("value",_3.data.cust.email);this.displayname.set("value",_3.data.cust.displayname);this.sendemail.set("checked",true);this.updBtn.set("disabled",false);this._dialog.show();this.updBtn.cancel();}else{alert("Problem Loading Expire Details");}},_UpdatedCall:function(_4){if(_4.success=="OK"){if(this._dialog){this._dialog.hide();}}else{if(_4.message){alert(_4.message);}else{alert("Problem Upating");}}this.updBtn.cancel();},_Update:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Missing Data");this.updBtn.cancel();return false;}var _5=this.form.get("value");_5["licence_expire"]=ttl.utilities.toJsonDate(this.licence_expire.get("value"));dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._UpdatedCallBack),url:"/iadmin/re_activate_trial",content:_5}));}});}