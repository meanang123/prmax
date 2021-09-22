from release_build import buildRelease
import sys, os, os.path
import getopt

def _captureVersion( basepath , appname ):
	""" get the dojo version info for the build"""
	version = "missing"
	tmp = file ( os.path.normpath(os.path.join( basepath,appname, 'config/app.cfg')) )
	for l in tmp.readlines():
		if l.find ( "prmax.dojoversion =" ) != -1:
			version = l.split("\"")[1]
			break
	return version


if __name__=='__main__':
	opts, args = getopt.getopt(sys.argv[1:],"" , ["prmaxresearchtest",
	                                              "prmaxresearchlive",
	                                              "prmaxquestionnaireslive",
	                                              "prmaxquestionnairestest",
	                                              "prmaxcontroltest",
	                                              "prmaxcontrollive",
	                                              "prmaxclippingstest",
	                                              "prmaxclippingslive"])
	done = False
	for o, a in opts:
		if o in ("--prmaxresearchlive",):
			p = "/Projects/prmax/live/prmaxresearch"
			buildRelease(True,True,_captureVersion(p, "prmaxresearch"), "prmaxresearch")
			done = True
		if o in ("--prmaxresearchtest",):
			p = "/Projects/prmax/development/prmaxresearch"
			buildRelease(True,False,_captureVersion(p, "prmaxresearch"), "prmaxresearch")
			done = True

		if o in ("--prmaxquestionnaireslive",):
			p = "/Projects/prmax/live/prmaxquestionnaires"
			buildRelease(True,True,_captureVersion(p, "prmaxquestionnaires"), "prmaxquestionnaires")
			done = True
		if o in ("--prmaxquestionnairestest",):
			p = "/Projects/prmax/development/prmaxquestionnaires"
			buildRelease(True,False,_captureVersion(p, "prmaxquestionnaires"), "prmaxquestionnaires")
			done = True

		if o in ("--prmaxcontrollive",):
			p = "/Projects/prmax/live/prmaxcontrol"
			buildRelease(True,True,_captureVersion(p, "prmaxcontrol"), "prmaxcontrol")
			done = True
		if o in ("--prmaxcontroltest",):
			p = "/Projects/prmax/development/prmaxcontrol"
			buildRelease(True,False,_captureVersion(p, "prmaxcontrol"), "prmaxcontrol")
			done = True

		if o in ("--prmaxclippingslive",):
			p = "/Projects/prmax/live/prmax"
			buildRelease(True,True,_captureVersion(p, "prmax"), "prmaxclippings")
			done = True
		if o in ("--prmaxclippingstest",):
			p = "/Projects/prmax/development/prmax"
			buildRelease(True,False,_captureVersion(p, "prmax"), "prmaxclippings")
			done = True

	if not done:
		print ("Missing Environment")
