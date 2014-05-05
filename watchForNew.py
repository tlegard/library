import sys
import time
import logging
import re
import io
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from pymongo import MongoClient

client = None
try:
    client = MongoClient('localhost', 27017)
except:
    print "Couldn't connect to database, are you sure it's running?"
    sys.exit(0);

db = client.library
stopWords = stopwords.words('english')

class MyHandler(FileSystemEventHandler):
    patterns = ["AMEEncodingLog.txt"]

    def process(self, event):
        """
        event.event_type 
            'modified' | 'created' | 'moved' | 'deleted'
        event.is_directory
            True | False
        event.src_path
            path/to/observed/file
        """
        # the file will be processed there
        logfile = io.open(event.src_path, 'r+', encoding="utf-16")
        data = logfile.read()
        if not data:
            return

        p = re.compile("Source File: (.+)\n - Output File: (.+)")
        couplets = p.findall(data)
        

        for couplet in couplets: 
            if re.match("\S+\.cit$", couplet[1]):
                toName = os.path.basename(couplet[0])
                destination = 'D:\\library\\xml files\\' + toName.split('.')[0] + '.xml'
                xmlFile = couplet[1].split('.')[0] + '_stt.xml';
                print xmlFile
                try:
                    os.rename(xmlFile, destination);
                except:
                    sys.exit(0);

            xmlfile = io.open(destination, 'r');
            xmlData = xmlfile.read();

            cuelist = [];

            cuePoints = BeautifulSoup(xmlData).flvcorecuepoints.findAll('cuepoint');

            for cue in cuePoints:
                name = cue.find('name').string
                confidence = None
                duration = None

                if name in stopWords:
                    print "skipping" + name
                    continue

                time = cue.find('time').string

                for parameter in cue.findAll('parameter'):
                    if parameter.find('name').string == "duration":
                        duration = parameter.find('value').string
                    elif parameter.find('name').string == "confidence":
                        confidence = parameter.find('value').string;

                if name and time and duration and confidence:
                    cuelist.append({
                       "name": name,
                       "time": time,
                       "duration": duration,
                       "confidence": confidence
                   })
                else:
                    continue


            json = {
                "name": toName.split('.')[0],
                "list": cuelist
            }

            try:
                db.videos.insert(json);
                print "inserted"
            except: 
                print "Couldn't insert"
                sys.exit(0)
            
        logfile.seek(0)
        logfile.truncate()
        logfile.close()
    
    def on_modified(self, event):
        self.process(event)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = 'C:\\Users\\Tucker\\AppData\\Roaming\\Adobe\\Adobe Media Encoder\\6.0'
    event_handler = MyHandler();
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()