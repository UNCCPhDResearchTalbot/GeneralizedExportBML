# GeneralizedExportBML
generalized code for converting playscripts to bml

Replace file called InputScript.txt with formatted play-script & modify characters & pawns info for script

Details on what to change:
main.js - three sections:
1) top of file - arrays of pawns & characters & marks, filenames, and additional movement words
2) checkposition function - any special position calculations like skull (closest of two skull objects) or non-viewable pawns like coin
3) bottom of file - creation of all marks, pawns, and characters

client.js - one section:
1) bottom of file - creation of visible pawns & characters (same positions as main.js)

To run:
start python for page hosting
		python -m SimpleHTTPServer 8888
start NodeJS module by running
		node server
Then, open index.html file to begin running the scene and logging the character traces.
		http://localhost:8888/index.html

Results will be in the log directory

