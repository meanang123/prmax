from fabric.api import local, put, env, run #lcd
from fabric.context_managers import cd, lcd
from fabric.decorators import hosts, roles
import os

env.rolesdef = { "test": ["prmax01.vm.bytemark.co.uk"],
                 "live": ["prmax-d01.dh.bytemark.co.uk"] }

python_27 = "c:\python27\python"
python_egg_27 = "2.7"

python_path = python_27
python_egg = python_egg_27

test_location = r"prmax\development"
min_test_location = "prmaxtest-min"
live_location = r"prmax\live"

def build_folders ( location ) :
    if location == min_test_location:
        return (
            (test_location+ r"\ttl","ttl") ,
            (test_location+ r"\prcommon", "prcommon"),
            (test_location+ r"\prmax", "prmax"),
            (test_location+ r"\prmaxapi","prmaxapi"),
            (test_location+ r"\prmaxutilities","prmaxutilities"),
            (test_location+ r"\prpublish","prpublish"),
            (test_location+ r"\prmaxresearch","prmaxresearch"),
            (test_location+ r"\prmaxquestionnaires", "prmaxquestionnaires"),
            (test_location+ r"\prservices","prservices"),
            (test_location + r"\prmaxcontrol", "prmaxcontrol"))
    else:
        return (
            (location+ r"\ttl","ttl") ,
            (location+ r"\prcommon", "prcommon"),
            (location+ r"\prmax", "prmax"),
            (location+ r"\prmaxapi","prmaxapi"),
            (location+ r"\prmaxcollateral","prmaxcollateral"),
            (location+ r"\prmaxutilities","prmaxutilities"),
            (location+ r"\prpublish","prpublish"),
            (location+ r"\prmaxresearch","prmaxresearch"),
            (location+ r"\prmaxquestionnaires", "prmaxquestionnaires"),
            (location+ r"\prservices","prservices"),
            (location + r"\prmaxcontrol", "prmaxcontrol"))

def build_live_dojo():
    local('python c:\Projects\%s\prmax\setup_dojo.py --live' % live_location, capture=False)
    build_test_dojo_live("--prmaxresearchlive")
    build_test_dojo_live("--prmaxquestionnaireslive")
    build_test_dojo_live("--prmaxclippingslive")
    build_test_dojo_live("--prmaxcontrollive")


def build_test_dojo():
    local('python c:\Projects\%s\prmax\setup_dojo.py --test' % test_location, capture=False)
    build_test_dojo_2("--prmaxclippingstest")
    build_test_dojo_2("--prmaxresearchtest")
    build_test_dojo_2("--prmaxquestionnairestest")
    build_test_dojo_2("--prmaxcontroltest")

def build_test_main_dojo():
    local('python c:\Projects\%s\prmax\setup_dojo.py --test' % test_location, capture=False)

def build_live_eggs():
    for fd in build_folders ( live_location ) :
        with lcd("\Projects\\" + fd[0] ):
            print fd[1]
            local('%s setup.py clean --all bdist_egg' % python_path , capture=True)

def build_test_eggs():
    for fd in build_folders ( test_location ) :
        print "\Projects\\" + fd[0]
        with lcd("\Projects\\" + fd[0] ):
            print fd[1]
            local('%s setup.py clean --all bdist_egg' % python_path , capture=False)

def prepare_live_deploy():
    build_live_dojo()
    build_live_eggs()

def prepare_test_deploy():
    build_test_dojo()
    build_test_eggs()

@hosts("prmax2013.dh.bytemark.co.uk")
def deploy_live_to_test():
    _do_deploy(live_location)


@hosts("prmax2013.dh.bytemark.co.uk")
def deploy_test_to_test():
    _do_deploy(test_location)

@hosts("prmax2013.dh.bytemark.co.uk")
def deploy_test_to_min_test():
    _do_deploy(min_test_location)


def _do_deploy( location ) :
    # user too login as
    env.password = "JUrSke8MNYHz"
    env.user = "root"
    env.hosts =  "prmax2013.dh.bytemark.co.uk"

    # copy the .egg files
    for fd in build_folders(location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg),
            '/home/prmax/upload/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ) )

    # execute the standard install script
    run ( "/home/prmax/scripts/installprmax")
    # update database
    run ( " psql -d prmax -U postgres -f /usr/local/lib/python2.7/dist-packages/prmax-1.0.0.1-py2.7.egg/prmax/setup/sql/temp_tables.sql")
    run ( " psql -d prmax -U postgres -f /usr/local/lib/python2.7/dist-packages/prmax-1.0.0.1-py2.7.egg/prmax/setup/sql/temp_scripts.sql")

    run("supervisorctl restart all")

@hosts("prmax-d2013.dh.bytemark.co.uk")
def deploy_live():
    # copy to live
    env.password = "mGu9y5x6v4En"
    env.user = "prmax"
    env.hosts =  "prmax-d2013.dh.bytemark.co.uk"

    for fd in build_folders(live_location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg ) ,
            '/home/prmax/upload/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ))

@hosts("prmax-a01.dh.bytemark.co.uk")
def deploy_app_server_1():
    env.password = "mGu9y5x6v4En"
    env.user = "prmax"
    env.hosts = "prmax-a01.dh.bytemark.co.uk"

    for fd in build_folders(live_location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg),
            '/home/prmax/prmax-release/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ) )

@hosts("prmax-a03.dh.bytemark.co.uk")
def deploy_app_server_2():
    env.password = "mGu9y5x6v4En"
    env.user = "prmax"
    env.hosts = "prmax-a01.dh.bytemark.co.uk"

    for fd in build_folders(live_location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg),
            '/home/prmax/prmax-release/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ) )

prmax_servers = (
       'prmax-a01.dh.bytemark.co.uk',
    'prmax-a04.dh.bytemark.co.uk',
    'prmax-a03.dh.bytemark.co.uk',
    'prmax-d2013.dh.bytemark.co.uk',
    'fe1.default.prmax.uk0.bigv.io',
    'prmaxdb.default.prmax.uk0.bigv.io',
    'prmaxprocess.default.prmax.uk0.bigv.io',
    'prmaxemail.test1.prmax.uk0.bigv.io',

)

def deploy_to_new_system():
    'global app update'

    env.password = "mGu9y5x6v4En"
    env.user = "prmax"

    for app_server in prmax_servers:
        print "Doing - ", app_server

        env.host_string  = app_server

        run("/home/prmax/scripts/make_backup")

        for fd in build_folders(live_location):
            put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg),
                '/home/prmax/prmax-release/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg) )

@hosts("prmax2013.dh.bytemark.co.uk")
def deploy_backup():
    # copy to live
    env.password = "JUrSke8MNYHz"
    env.user = "root"
    env.hosts =  "prmax2013.dh.bytemark.co.uk"

    for fd in build_folders(live_location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg ) ,
            '/home/prmax/upload/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ))


@hosts("pprdata.dh.bytemark.co.uk")
def deploy_twitter():
    # copy to live
    env.password = "b8YPzCwT9Z"
    env.user = "prmax"
    env.hosts =  "pprdata.dh.bytemark.co.uk"

    for fd in build_folders(live_location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg) ,
            '/home/prmax/eggs/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ))


def prepare_test_research_deploy():
    """build research test """
    build_test_dojo_2("--prmaxresearchtest")
    build_test_eggs_2( ppr_research_build_folders ( test_location ))

def prepare_test_questionnaires_deploy():
    """build research test """
    build_test_dojo_2("--prmaxquestionnairestest")
    build_test_eggs_2( ppr_research_build_folders ( test_location ))


def ppr_research_build_folders ( location ) :
    return (
        (location+"\ttl","ttl") ,
        (location+"\prcommon", "prcommon"),
        (location+"\prmaxresearch","prmaxresearch"),
        (location+"\prmaxquestionnaires", "prmaxquestionnaires")
    )

def build_test_dojo_2( command ):
    local('python /Projects/prmax/development/deployment/setup_dojo.py %s' % command, capture=False)

def build_test_dojo_live( command ):
    local('python /Projects/prmax/live/deployment/setup_dojo.py %s' % command, capture=False)


def build_test_eggs_2( egg_list ):
    for fd in egg_list:
        with lcd("\Projects\\" + fd[0] ):
            print fd[1]
            local('%s setup.py clean --all bdist_egg' % python_path  , capture=True)


@hosts("prmax-d2013.dh.bytemark.co.uk")
def deploy_test_new_db_server():
    # copy to live
    env.password = "mGu9y5x6v4En"
    env.user = "prmax"
    env.hosts =  "prmax-d2013.dh.bytemark.co.uk"

    for fd in build_folders(test_location):
        put('\projects\%s\dist\%s-1.0.0.1-py%s.egg' % (fd[0], fd[1], python_egg) ,
            '/home/prmax/upload/%s-1.0.0.1-py%s.egg' % (fd[1], python_egg ))
