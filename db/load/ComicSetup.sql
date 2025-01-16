
DROP TABLE IF EXISTS 'All_DC';

.echo ON
.mode columns
.headers ON

.read ./load/CreateComics.sql   
.read ./load/LoadData.sql    
.read ./load/LoadRoles.sql
.read ./load/LoadUserLists.sql 

.mode csv

-- .import ./raw_data/DC_Comic_Books_all.csv All_DC 
.import ./raw_data/Complete_DC_Comic_Books.csv All_DC 

-- Insert records from All_DC while ignoring duplicates based on title and release_date
INSERT OR IGNORE INTO Comic_book (title, comic_release_date)
SELECT "Issue_Name", "Release_Date"
FROM All_DC;


.read ./load/creators.sql
.read ./load/creatorsLetterers.sql
.read ./load/creatorsPencilers.sql
.read ./load/creatorsCA.sql
.read ./load/series.sql