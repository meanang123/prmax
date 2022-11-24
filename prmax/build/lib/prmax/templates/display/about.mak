<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:py="http://genshi.edgewall.org/"
      xmlns:xi="http://www.w3.org/2001/XInclude">
<div dojotype="dijit.layout.ContentPane">
<p>Prmax Version: ${prmax.dojoversion}</p>
<p>Debug Info</p>
<div id="test_1"></div>
<div >${tg.request.base}</div>
<div >${tg.useragent.browser} ${tg.useragent.majorVersion}</div>
<div >${prmax.build}</div>
</div>
<script type="text/JavaScript" language="JavaScript">
var popUpsBlocked = false;
var mine = window.open('','','width=1,height=1,left=0,top=0,scrollbars=no');
 if(mine)
    mine.close();
 else
    popUpsBlocked = true;

 if(popUpsBlocked)
  alert('We have detected that you are using popup blocking software.\nThis easy article can show you how to detect this using Javascript...');
else
    alert("abc");
</script>
</html>