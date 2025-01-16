-- Step 1: Insert unique creators into the Creator table

INSERT OR IGNORE INTO Creator (name)
SELECT DISTINCT Pencilers AS name FROM All_DC;


-- Step 2: Insert contributions for each creator into the Contributes table


-- Insert contributions for Pencilers
INSERT OR IGNORE INTO Contributes (create_id, comic_id, role)
SELECT
    Creator.creator_id,
    Comic_book.comic_id,
    'Pencilers' AS role  -- The role is set to "Pencilers"

FROM All_DC
JOIN Creator ON Creator.name = All_DC.Pencilers
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name 
               AND Comic_book.comic_release_date = All_DC.Release_Date
WHERE Creator.name IS NOT NULL;


