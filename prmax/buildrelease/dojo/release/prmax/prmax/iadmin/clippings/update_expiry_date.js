/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.clippings.update_expiry_date"]){dojo._hasResource["prmax.iadmin.clippings.update_expiry_date"]=true;dojo.provide("prmax.iadmin.clippings.update_expiry_date");dojo.require("ttl.BaseWidget");dojo.declare("prmax.iadmin.clippings.update_expiry_date",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div><br/>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit.form.Form\" data-dojo-props='onSubmit:\"return false\",\"class\":\"common_prmax_layout\"'>\r\n\t\t<label class=\"label_2\">New Expiry Date:</label><input data-dojo-props='name:\"enddate\",style:\"width:10em\",type:\"text\",required:true' data-dojo-attach-point=\"enddate\" data-dojo-type=\"dijit.form.DateTextBox\"/><br/><br/>\r\n\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-attach-point=\"closebtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Close\",style:\"float:left\"'></button>\r\n\t\t<button data-dojo-attach-event=\"onClick:_update_expiry_date\" data-dojo-attach-point=\"upddatebtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Update\",style:\"float:right\"'></button>\r\n\t</form><br/>\r\n</div>\r\n\r\n",constructor:function(){this._update_expiry_date_call_back=dojo.hitch(this,this._update_expiry_date_call);},postCreate:function(){this._clear();this.inherited(arguments);},load:function(_1,_2){this._dialog=_1;this._icustomerid=_2;},_close:function(){this._dialog.hide();},_update_expiry_date:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Please Enter Details");return false;}var _3={};_3["enddate"]=ttl.utilities.toJsonDate(this.enddate.get("value"));_3["icustomerid"]=this._icustomerid;dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._update_expiry_date_call_back),url:"/iadmin/clippings/update_expiry_date",content:_3}));},_update_expiry_date_call:function(_4){if(_4.success=="OK"){this._dialog.hide();this._clear();dojo.publish("/clippings/order/update_expiry_date",[ttl.utilities.toJsonDate2(this.enddate.get("value"))]);}else{alert("Problem Updating Expiry Date");}},_clear:function(){this.enddate.set("value",this.end_date);},clear:function(){this._clear();},});}