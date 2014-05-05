# -----------------------------------------------------------------------------#
#   Required Packages                                                          #
# -----------------------------------------------------------------------------#
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

# -----------------------------------------------------------------------------#
#   CONFIG                   Please change me                                  #
# -----------------------------------------------------------------------------#
PREMEIRE_PATH = ""                  # the path to adobe media encoder's log file
XML_DESTINATION_PATH = ""           # the directory where you would like to move
                                    # the xml files too

# -----------------------------------------------------------------------------#
#   Connect to Database                                                        #
# -----------------------------------------------------------------------------#
client = None
try:
    client = MongoClient('localhost', 27017)
except:
    print "Couldn't connect to database, are you sure it's running?"
    sys.exit(0);

db = client.library

# -----------------------------------------------------------------------------#
#   Load Stop Words                                                            #
# -----------------------------------------------------------------------------#
stopWords = stopwords.words('english')


class MyHandler(FileSystemEventHandler):
    patterns = ["AMEEncodingLog.txt"]

    # -------------------------------------------------------------------------#
    # Import into database on log update                                       #
    # -------------------------------------------------------------------------
    def process(self, event):
        # Read in the contents from the log file
        logfile = io.open(event.src_path, 'r+', encoding="utf-16")
        data = logfile.read()
        if not data:
            return

        # Look for the specific entry in the log file that means a subtitle
        # _stt.xml file was created. 
        p = re.compile("Source File: (.+)\n - Output File: (.+)")
        couplets = p.findall(data)
    

        # For each of the log files created
        for couplet in couplets: 
            # Find the .cit file and change it's extension to _sst.xml
            # move this file to XML_DESTINATION_PATH
            if re.match("\S+\.cit$", couplet[1]):
                toName = os.path.basename(couplet[0])
                destination = XML_DESTINATION_PATH + toName.split('.')[0] + '.xml'
                xmlFile = couplet[1].split('.')[0] + '_stt.xml';
                print xmlFile + "was moved"
                try:
                    os.rename(xmlFile, destination);
                except:
                    sys.exit(0);

            # --------------------------------------------------------------------------------
            # Convert the XML into JSON
            #   ~ Essentially boing down the <Name>Confidence</Name><Value>100</Value> into
            #     more lightweight JSON {confidence: value}
            # --------------------------------------------------------------------------------
            xmlfile = io.open(destination, 'r');
            xmlData = xmlfile.read();

            cuelist = [];

            cuePoints = BeautifulSoup(xmlData).flvcorecuepoints.findAll('cuepoint');

            for cue in cuePoints:
                name = cue.find('name').string
                confidence = None
                duration = None

                # skip stop words
                if name in stopWords:
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


            # JSON file to insert
            json = {
                "name": toName.split('.')[0],
                "list": cuelist
            }

            # Put it in the database!
            try:
                db.videos.insert(json);
                print "inserted"
            except: 
                print "Couldn't insert"
                sys.exit(0)
        
        # Clear the log file so we don't reimport the XML file that happened
        logfile.seek(0)
        logfile.truncate()
        logfile.close()
    
    def on_modified(self, event):
        self.process(event)

# -----------------------------------------------------------------------------#
#   Watch for file changes and response according the method described above   #
# -----------------------------------------------------------------------------#
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    event_handler = MyHandler();
    observer = Observer()
    observer.schedule(event_handler, REMEIRE_PATH, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()