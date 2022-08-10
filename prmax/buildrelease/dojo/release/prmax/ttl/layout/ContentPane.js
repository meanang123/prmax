/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.layout.ContentPane"]){dojo._hasResource["ttl.layout.ContentPane"]=true;dojo.provide("ttl.layout.ContentPane");dojo.require("dijit.layout.ContentPane");dojo.require("ttl.utilities");dojo.declare("ttl.layout.ContentPane",[dijit.layout.ContentPane],{onDownloadError:function(_1){return ttl.utilities.onDownloadError(_1)||this.errorMessage;}});}