/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.crm.issues.briefingnoteadd"]){dojo._hasResource["prcommon.crm.issues.briefingnoteadd"]=true;dojo.provide("prcommon.crm.issues.briefingnoteadd");dojo.require("prmax.customer.clients.pickcolour");dojo.declare("prcommon.crm.issues.briefingnoteadd",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div style=\"width:500px;margin:10px\">\r\n\t<form class=\"common_prmax_layout prmaxdefault\" data-dojo-attach-point=\"formnode\" data-dojo-type=\"dijit.form.Form\" onSubmit=\"return false\">\r\n\t\t<br/>\r\n\t\t<label class=\"label_2\" data-dojo-attach-point=\"briefing_notes_status_label\">Note Status</label><input data-dojo-props='\"class\":\"prmaxrequired prmaxinput\",name:\"briefingnotesstatusdescription\",type:\"text\",maxlength:80,trim:true,required:true,style:\"width:26em\"' data-dojo-attach-point=\"briefingnotesstatusdescription\" data-dojo-type=\"dijit.form.ValidationTextBox\"/><br/>\r\n\t\t<label class=\"label_2\">Background Color</label><div data-dojo-type=\"prmax.customer.clients.pickcolour\" data-dojo-attach-point=\"background_colour\" data-dojo-props='name:\"background_colour\",style:\"width:200px\"'></div>\r\n\t\t<label class=\"label_2\">Text Color</label><div data-dojo-type=\"prmax.customer.clients.pickcolour\" data-dojo-attach-point=\"text_colour\" data-dojo-props='name:\"text_colour\",style:\"width:200px\"'></div><br/>\r\n\r\n\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-attach-point=\"closebtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Close\",\"class\":\"btnleft\"'></button>\r\n\t\t<button data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox.form.BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Adding...\",label:\"Add\",\"class\":\"btnright\",style:\"float:right\"'></button><br/><br/>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this._save_call_back=dojo.hitch(this,this._save_call);},postCreate:function(){dojo.attr(this.briefing_notes_status_label,"innerHTML",PRMAX.utils.settings.briefing_notes_description+" Status");},_save:function(){if(ttl.utilities.formValidator(this.formnode)==false){alert("Not all required field filled in");this.savebtn.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._save_call_back,url:"/crm/issues/briefingnoteadd",content:this.formnode.get("value")}));},_setDialogAttr:function(_1){this._dialog=_1;},_save_call:function(_2){if(_2.success=="OK"){this._close();dojo.publish("/bn/add",[_2.data]);}else{alert("Problem Adding Status");this.savebtn.cancel();}},_clear:function(){this.savebtn.cancel();this.briefingnotesstatusdescription.set("value","");this.background_colour.set("value","");this.text_colour.set("value","");},_close:function(){if(this._dialog!=null){this._dialog.hide();}this._clear();},clear:function(){this._clear();}});}