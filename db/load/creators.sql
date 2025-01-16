-- Step 1: Insert unique creators into the Creator table
INSERT OR IGNORE INTO Creator (name)
SELECT DISTINCT Inkers AS name FROM All_DC
UNION
SELECT DISTINCT Writers AS name FROM All_DC
UNION
SELECT DISTINCT Editors AS name FROM All_DC;


INSERT OR IGNORE INTO Creator (name)

SELECT DISTINCT Colourists AS name FROM All_DC
UNION
SELECT DISTINCT Executive_Editor AS name FROM All_DC;

-- Step 2: Insert contributions for each creator into the Contributes table
INSERT OR IGNORE INTO Contributes (create_id, comic_id, role)
SELECT
    Creator.creator_id,
    Comic_book.comic_id,
    'Inker' AS role  -- The role is set to "Inker" for the Inkers

FROM All_DC
JOIN Creator ON Creator.name = All_DC.Inkers
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name 
               AND Comic_book.comic_release_date = All_DC.Release_Date
WHERE Creator.name IS NOT NULL;

-- Repeat similar inserts for each role (Writers, Editors, etc.)
-- Insert contributions for Writers
INSERT OR IGNORE INTO Contributes (create_id, comic_id, role)
SELECT
    Creator.creator_id,
    Comic_book.comic_id,
    'Writer' AS role  -- The role is set to "Writer" for the Writers

FROM All_DC
JOIN Creator ON Creator.name = All_DC.Writers
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name 
               AND Comic_book.comic_release_date = All_DC.Release_Date
WHERE Creator.name IS NOT NULL;

-- Insert contributions for Editors
INSERT OR IGNORE INTO Contributes (create_id, comic_id, role)
SELECT
    Creator.creator_id,
    Comic_book.comic_id,
    'Editor' AS role  -- The role is set to "Editor" for the Editors
 
FROM All_DC
JOIN Creator ON Creator.name = All_DC.Editors
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name 
               AND Comic_book.comic_release_date = All_DC.Release_Date
WHERE Creator.name IS NOT NULL;

-- Insert contributions for Executive Editors
INSERT OR IGNORE INTO Contributes (create_id, comic_id, role)
SELECT
    Creator.creator_id,
    Comic_book.comic_id,
    'Executive Editor' AS role  -- The role is set to "Executive Editor"

FROM All_DC
JOIN Creator ON Creator.name = All_DC.Executive_Editor
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name 
               AND Comic_book.comic_release_date = All_DC.Release_Date
WHERE Creator.name IS NOT NULL;






