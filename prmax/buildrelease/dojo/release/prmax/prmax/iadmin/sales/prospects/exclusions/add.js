/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.sales.prospects.gather.add"]){dojo._hasResource["prmax.iadmin.sales.prospects.gather.add"]=true;dojo.provide("prmax.iadmin.sales.prospects.gather.add");dojo.require("ttl.BaseWidget");dojo.require("dojox.validate.regexp");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Button");dojo.require("dojox.form.BusyButton");dojo.require("prmax.iadmin.sales.prospects.companies.add");dojo.require("dijit.Dialog");dojo.declare("prmax.iadmin.sales.prospects.gather.add",[ttl.BaseWidget],{url:"/iadmin/prospects/prospect/add_prospect",mode:"add",templateString:dojo.cache("prmax","iadmin/sales/prospects/gather/templates/add.html","<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit.form.Form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"prospectid\"' data-dojo-attach-point=\"prospectid\" data-dojo-type=\"dijit.form.TextBox\" >\r\n\t\t<table width=\"500px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-props='required:true,\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:20em\",trim:\"true\",regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\"' data-dojo-type=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Family Name</td><td><input data-dojo-props='type:\"text\",name:\"familyname\"' data-dojo-attach-point=\"familyname\" data-dojo-type=\"dijit.form.TextBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >First Name</td><td><input data-dojo-props='type:\"text\",name:\"firstname\"' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit.form.TextBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Title</td><td><input data-dojo-props='type:\"text\",name:\"title\"' data-dojo-attach-point=\"title\" data-dojo-type=\"dijit.form.TextBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Company</td><td>\r\n\t\t\t\t<select data-dojo-props='searchAttr:\"prospectcompanyname\",required:false,\"class\":\"prmaxinput\",name:\"prospectcompanyid\",style:\"width:19em\",autoComplete:true' data-dojo-attach-point=\"prospectcompanyid\" data-dojo-type=\"dijit.form.FilteringSelect\" ></select>\r\n\t\t\t\t<button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_add_company\">New </button>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Source</td><td><select data-dojo-props='searchAttr:\"prospectsourcename\",required:false,\"class\":\"prmaxinput\",name:\"prospectsourceid\",style:\"width:19em\",autoComplete:true' data-dojo-attach-point=\"prospectsourceid\" data-dojo-type=\"dijit.form.FilteringSelect\" ></select>\r\n\t\t\t\t\t<button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_add_source\">New </button>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Type</td><td>\r\n\t\t\t\t\t<select data-dojo-props='searchAttr:\"prospecttypename\",required:false,\"class\":\"prmaxinput\",name:\"prospecttypeid\",style:\"width:19em\",autoComplete:true' data-dojo-attach-point=\"prospecttypeid\" data-dojo-type=\"dijit.form.FilteringSelect\" ></select>\r\n\t\t\t\t\t<button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_add_type\">New </button>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Region</td><td>\r\n\t\t\t\t\t<select data-dojo-props='searchAttr:\"prospectregionname\",required:false,\"class\":\"prmaxinput\",name:\"prospectregionid\",style:\"width:19em\",autoComplete:true' data-dojo-attach-point=\"prospectregionid\" data-dojo-type=\"dijit.form.FilteringSelect\" ></select>\r\n\t\t\t\t\t<button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_add_region\">New </button>\r\n\t\t\t</td></tr>\r\n\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Www:</td><td><input data-dojo-attach-point=\"web\" data-dojo-props='name:\"web\",type:\"text\",maxlength:120,regExpGen:dojox.validate.regexp.url' data-dojo-type=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Tel:</td><td><input data-dojo-attach-point=\"telephone\" data-dojo-props='name:\"telephone\",type:\"text\",maxlength:40,trim:true' data-dojo-type=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"prmaxrowlabel\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"closebtn\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_close\">Close</button></td>\r\n\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\"><button data-dojo-type=\"dojox.form.BusyButton\" data-dojo-attach-point=\"addbtn\" data-dojo-props='busyLabel:\"Saving ...\",type:\"button\"' data-dojo-attach-event=\"onClick:_update\">Save</button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Add New Company\"' data-dojo-attach-point=\"adddialog\">\r\n\t\t<div data-dojo-attach-point=\"addctrl\" data-dojo-type=\"prmax.iadmin.sales.prospects.companies.add\" ></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Add New Prospect Source\"' data-dojo-attach-point=\"addsourcedialog\">\r\n\t\t<div data-dojo-attach-point=\"addsourcectrl\" data-dojo-type=\"prmax.iadmin.sales.prospects.sources.add\" ></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Add New Prospect Type\"' data-dojo-attach-point=\"addtypedialog\">\r\n\t\t<div data-dojo-attach-point=\"addtypectrl\" data-dojo-type=\"prmax.iadmin.sales.prospects.types.add\" ></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Add New Prospect Region\"' data-dojo-attach-point=\"addregiondialog\">\r\n\t\t<div data-dojo-attach-point=\"addregionctrl\" data-dojo-type=\"prmax.iadmin.sales.prospects.regions.add\" ></div>\r\n\t</div>\r\n</div>\r\n"),constructor:function(){this._dialog=null;this._store=new dojox.data.JsonRestStore({target:"/iadmin/prospects/companies/list",idAttribute:"prospectcompanyid"});dojo.subscribe("/prospect/comp/add",dojo.hitch(this,this._add_event));this._update_call_back=dojo.hitch(this,this._update_call);},postCreate:function(){this.inherited(arguments);this.prospectcompanyid.set("store",this._store);},_close:function(){this._dialog.hide();},_update:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Please Enter Details");this.addbtn.cancel();return false;}dojo.xhrPost(ttl.utilities.makeParams({load:this._update_call_back,url:this.url,content:this.form.get("value")}));},_update_call:function(_1){if(_1.success=="OK"){dojo.publish("/prospect/prospect/add",[_1.data]);if(this.mode=="add"){alert("Prospect Added");}else{alert("Prospect Updated");}this._close();this.clear();}else{if(_1.success=="DU"){alert("Email Address already exists");}else{if(_1.message!=null){alset(_1.message);}else{alert("Problem adding Entry");}}}this.addbtn.cancel();},load:function(_2){this._dialog=_2;this.clear();},clear:function(){this.email.set("value","");this.familyname.set("value","");this.firstname.set("value","");this.title.set("value","");this.prospectcompanyid.set("value",null);this.addbtn.cancel();},_add_company:function(){this.addctrl.clear();this.addctrl.load(this.adddialog);this.adddialog.show();},_add_event:function(_3){this.prospectcompanyid.set("value",_3.prospectcompanyid);}});}