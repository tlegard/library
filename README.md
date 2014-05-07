library
=======


## Overview

This is a collection of code needed for the CS 4264: Library Transcription Project. It is
intended to work with Adobe Premerie CS6 and provide a GUI for transcribing and filtering out key words of a video. 

## Running the Server
  0. Clone this repo
  
  1. Install [node](http://nodejs.org)
  
  2. Install the depednecies for your project. From the root of this repo, run `npm install`. This will read the package.json file and isstall the packages into `./node_modules`
  
  3. Run the server with `grunt server.js`
  
## Running the Python Watch Script
This program is intended to interact with Adobe Premerie CS6. However, the file structure for Adobe makes it difficult for the _sst.xml
to be accessible. So! In comes hacky python script. 

### pip install
You'll need to install the following packages using pip
```
pip install watchdog		// used for file watching
pip install bs4			// used for XML parsing
pip install ntlk			// used for stopword filtering
pip install pymongo			// used for insertion into mongodb
```

### nltk Stop Words
You'll also need to install from the [ntlk corpus](http://www.nltk.org/data.html) stop words. 


### Configuration
You'll also need to change the two variables in the `watchForNew.py`
```
PREMERIE_PATH: "" // this is the path to the directory in which the log file 
                     for Adobe Premiere's Media Encoder is kept
XML_PATH: ""      // this is the path you which for the XML files to be moved to and 
                     renamed. 
```

## Database
You'll also need to spend up a `mongod` process from [mongodb](http://mongodb.org) and configure the dbpath to a logical location. 

### Importing the Test Data
Our program will watch for the changes on the video collection. We’ve provided the test data we used in this program.

It can easily be imported after ensuring the mongod process is running by running the following command from the root of the project directory.

	mongoimport --db library --collection videos ./testData.json