from buildrelease.release_build import buildRelease
import sys, os, os.path
import getopt

def _captureVersion():
	""" get the dojo version info for the build"""
	version = "missing"
	tmp = file ( os.path.normpath(os.path.join(os.path.dirname(__file__),'prmax/config/app.cfg')) )
	for l in tmp.readlines():
		if l.find ( "prmax.dojoversion =" ) != -1:
			version = l.split("\"")[1]
			break
	return version


if __name__=='__main__':
	opts, args = getopt.getopt(sys.argv[1:],"" , ["live","test"])
	done = False
	for o, a in opts:
		if o in ("--live",):
			buildRelease(True,True,_captureVersion())
			done = True
		if o in ("--test",):
			buildRelease(True,False,_captureVersion())
			done = True
	if not done:
		print ("Missing Environment")