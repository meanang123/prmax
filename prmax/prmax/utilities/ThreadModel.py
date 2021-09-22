import threading,Queue,time,sys,traceback

class ThreadProcess(object):
    def __init__(self,nbr):
        self.nbr = nbr
        self._pool = []
        self._inqueue = Queue.Queue() 
        self._outqueue = Queue.Queue()
        self._stop = false

    def err_msg():
        trace= sys.exc_info()[2]
        try:
            exc_value=str(sys.exc_value)
        except:
            exc_value=''
        return str(traceback.format_tb(trace)),str(sys.exc_type),exc_value

    def process_queue(self):
        flag='ok'
        while flag !='stop':
            try:
                flag,command,context=Qin.get() #will wait here!
                if flag=='ok':
                    result = command(context)
                Qout.put(result)
            except:
                print (err_msg())
            
    def start_threads(self):
        for i in range(self.nbr):
            thread = threading.Thread(target=process_queue)
            thread.start()
            self._pool.append(thread)
            
    def put(self,data,flag='ok'):
        Qin.put([flag,data]) 

    def stop_threads(self):    
        for i in range(len(Pool)):
            Qin.put(('stop',None,None))
        while Pool:
            time.sleep(1)
            for index,the_thread in enumerate(Pool):
                if the_thread.isAlive():
                    continue
                else:
                    del Pool[index]
                break
    
    def stop(self):
        self._stop = true
        self.stop_threads()
        
    def start(self):
        while not self._stop:
            time.sleep(1)
            self.schedule()
    
    def schedule(self):
        # override this to allow process to work 
        pass
        
