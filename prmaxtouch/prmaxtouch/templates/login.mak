# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html style="width:100%;height:100%;background:#dfeffb">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Prmax Ltd</title>
<link rel="shortcut icon" type="image/x-icon" href="/prmaxtouch_s/images/prmax.ico">
<meta name="author" content="Chris Hoy"/>
<meta name="COPYRIGHT" content="PRmax V${prmax['dojoversion']} ${prmax['copyright']}"/>
<meta name="ROBOTS" content="NOINDEX"/>
<meta http-equiv="Cache-Control"  content='no-cache'/>
<meta http-equiv='pragma'  content='no-cache' />
<link rel="stylesheet" type="text/css" media="screen" href="/prmaxtouch_s/css/login_prmaxtouch.css"/>
<%include file="/prmaxtouch/templates/prmaxtouch_header.mak"/>
</head>
<body style="width:100%;height:100%">

<table style="width:100%;height:100%;font-family:Calibri" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#dfeffb;vertical-align:top;text-align:center;height:100%">
	<div id="header" style="background:rgb(2,130,169);height:13vmin;border-bottom:solid 0.6vmin #026F8E">
			<div style="width:100%">
				<img id="pr-logo" src="/prmax_common_s/images/prmax_logo.png" style="height:11vmin;margin:1vmin 2vmin;float:right" alt="Prmax Ltd" />        </div>
			</div>
		<div style="margin-top:9.5vmin;background:#dfeffb">
					<div>
							<div style="width:100%;color:#0282a9">
	<p style="font-size:13pt;font-size:2.6vmin;margin:0px;padding:0px;color:red">&nbsp;
	%if message:
	${message|h}
	%endif
	&nbsp;<br/><br/><br/><br/></p>

									<form align="center" action="${tg.url(previous_url)}" method="post">
									<table>
									<tr><td style="min-width:10vw;max-width:20vmin"></td>
									<td style="width:50vmin;font-size:13pt;font-size:2.6vmin;text-align:left;padding-right:8vmin">
											<p><label for="username">Username</label><br /><input style="padding: 1.2vmin 1.3vmin;margin-top:1vmin;width:100%" type="text" id="username" name="user_name" /></p><p style="margin-top:4vmin"></p>
											<p><label for="password">Password</label><br /><input style="padding: 1.2vmin 1.3vmin;margin-top:1vmin;width:100%" type="password" id="password" name="password" /></p>
											<p style="margin-top:4.2vmin">
											<input type="hidden" name="login_page" value="1"/>
											<input type="hidden" name="login" value="Login"/></p>
	% if forward_url:
					<input type="hidden" name="forward_url" value="${forward_url}"/>
	% endif
	% for name,value in original_parameters.items():
	<input type="hidden" name="${name}" value="${value}"/>
	% endfor
									<td style="width:20vmin;font-size:6.8vmin;font-weight:bold;padding-top:0px" class="touch-button touch-button-fill touch-button-green">
									<button id="login-button" style="font-family:Calibri;font-size:4vmin;padding:1vmin;padding-left:2vmin"><i style="color:rgb(240,215,50);font-size:13vmin" class="fa fa-key"></i><br/>Login&nbsp;</button></td>
									<td style="min-width:10vw;max-width:20vmin"></td>
									</tr></table>
									</div>
									</form>
							</div>
					</div>
			</div>
	</td></tr><tr><td style="padding:2vmin;text-align:center;color:#0282a9">
		Prmax Ltd
	</td></tr><tr><td style="padding:4vmin 2vmin 0px 1vmin;background-color:rgb(2,130,169);vertical-align:top;height:10px;border-top:solid 0.6vmin #026F8E">
		<div id="bottom-strip" style="background-color:rgb(2,130,169);background-size:contain;background-position:left bottom;height:16vmin">
		</div>
	</td></tr>
	</table>
	<div class="tool-tip" style="margin-left:24vw" data-dojo-type="dijit/TooltipDialog" data-dojo-attach-point="keyboardtooltip">
		<div data-dojo-type="prmaxtouch/keyboard" data-dojo-attach-point="keyboard"></div>
	</div>
</body>
</html>

