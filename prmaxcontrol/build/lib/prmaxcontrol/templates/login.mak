# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
<head>
  <meta content="text/html; charset=utf-8"/>
  <meta charset="utf-8">
  <title>Prmax Control</title>
	<link rel="shortcut icon" type="image/x-icon" href="/prmax_common_s/images/favicon.ico"/>
  <link rel="stylesheet" type="text/css" media="screen" href="/prmax_control_s/css/controllogin.css"/>
  <meta name="author" content="Chris Hoy"/>
  <meta name="COPYRIGHT" content="PRmax V${prmax['dojoversion']} ${prmax['copyright']}"/>
  <meta name="ROBOTS" content="NOINDEX"/>
  <meta http-equiv="Cache-Control"  content='no-cache'/>
  <meta http-equiv='pragma'  content='no-cache' />
</head>
<body>
  <div id="loginform">
    <form class="loginfields" action="${tg.url(previous_url)}" method="post" >
      <h2><span>Login</span></h2>
      <div>
        <label for="user_name">Username:</label><input class="inp" type="text" id="user_name" name="user_name" /><br/>
        <label for="password">Password:</label><input class="inp" type="password" id="password" name="password" />
        <input type="submit" id="submit" name="login" value="Login"/>
% if forward_url:
        <input type="hidden" name="forward_url" value="${forward_url}"/>
% endif
% for name,value in original_parameters.items():
<input type="hidden" name="${name}" value="${value}"/>
% endfor
      </div>
    </form>
  </div>
</body>
</html>
