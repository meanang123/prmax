cd \Projects\prmax\development\prmax\buildrelease\dojo\util\buildscripts
java -Xmx2048m -classpath ../shrinksafe/js.jar;../shrinksafe/shrinksafe.jar org.mozilla.javascript.tools.shell.Main build.js profile=prmax releaseName=prmax action=clean,release copyTests=false version=%1 optimize=shrinksafe cssOptimize=comments  stripConsole=all
