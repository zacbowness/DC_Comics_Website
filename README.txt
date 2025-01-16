PDF with application description and final ER diagram: Comic Website/description/Description.pdf
Database location : Comic Website/db/ComicStore.db
YouTube Demonstration Link: https://youtu.be/SisI2AaUnSA

DB Setup
-----
1. Open terminal in Comic Website folder and cd ./db
2. type  sqlite3 ComicStore.db to open the database in sqlite3

Start the Web Application
---------------------
1. cd .. to the base of the application
2. Open up a terminal in that directory and type "npm install" to install the dependencies specified in the package.json file
2. In the terminal type "node app.js"
3. Browse to  http://localhost:3000 

Database File Location
--------
Database file and setup files. 
 - ./db/ComicStore.db

DB SETUP files (Not required)
---------------
Files inside the ./db/load folder are used to setup and populate the database with information. They are not required in order to run the application or use the database.

The below files are run to accomplish the setup
1. ./db/load/ComicSetup.sql - Sets up the ComicStore.db
2. ./db/load/CreateComics.sql  - Creates the ComicStore schema


 


