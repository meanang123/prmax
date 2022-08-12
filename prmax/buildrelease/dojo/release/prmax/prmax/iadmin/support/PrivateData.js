/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.support.PrivateData"]){dojo._hasResource["prmax.iadmin.support.PrivateData"]=true;dojo.provide("prmax.iadmin.support.PrivateData");dojo.declare("prmax.iadmin.support.PrivateData",[dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form  dojoAttachPoint=\"private_form\" method=\"post\" name=\"private_form\" enctype=\"multipart/form-data\"  onSubmit=\"return false;\">\r\n\t\t<input class=\"prmaxinput\" type=\"hidden\" dojoAttachPoint=\"private_cache\" name=\"private_cache\" value=\"-1\">\r\n\t\t<table width=\"50%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t\t<tr><td class=\"prmaxrowtag\">File Name</td><td><input size=\"30\" class=\"prmaxinput\" type=\"file\" dojoAttachPoint=\"private_file\" name=\"private_file\"></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Customer</td><td>\r\n\t\t\t<select name=\"icustomerid\"\r\n\t\t\t\tautoComplete=\"true\"\r\n\t\t\t\tdojoType=\"dijit.form.FilteringSelect\"\r\n\t\t\t\tlabelType=\"html\"\r\n\t\t\t\tsearchAttr=\"customername\"\r\n\t\t\t\tdojoAttachPoint=\"icustomerid\"\r\n\t\t\t\tsearch></select></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Add to existing Outlets</td><td><input type=\"checkbox\" name=\"no_add_outlet\" dojoType=\"dijit.form.CheckBox\"></td></tr>\r\n\t\t\t<tr><td colspan = \"2\" >&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan = \"2\" ><span dojoAttachPoint=\"progressNode\" style=\"display:none;\"><div dojoType=\"dijit.ProgressBar\" dojoAttachPoint=\"progressControl\" style=\"width:200px\" indeterminate=\"true\"></div></span></td></tr>\r\n\t\t\t<tr><td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\"  dojoAttachPoint=\"saveNode\" type=\"button\"  dojoType=\"dijit.form.Button\" label=\"Upload Private Data\" dojoAttachEvent=\"onClick:_Add\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this.icustomerid_data=new dojox.data.QueryReadStore({url:"/iadmin/customers_combo",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,urlPreventCache:true});this._AddedCallback=dojo.hitch(this,this._Added);},postCreate:function(){this.icustomerid.store=this.icustomerid_data;},_Added:function(_1){this.progressNode.style.display="none";if(_1.success=="OK"){alert("Private Data Added");this._Close();}else{if(_1.success=="FA"){alert(_1.message);}else{alert("Problem Adding Private Data");}}},_Add:function(){this.private_cache.value=new Date().valueOf();this.progressNode.style.display="block";dojo.io.iframe.send({url:"/iadmin/import_customer_outlets",handleAs:"json",load:this._AddedCallback,form:this.private_form});}});}