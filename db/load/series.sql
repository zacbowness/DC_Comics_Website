-- Step 1: Insert or Update the Series table
INSERT OR IGNORE INTO Series (name)
SELECT DISTINCT All_DC.Comic_Series
FROM All_DC
WHERE All_DC.Comic_Series IS NOT NULL;

-- Step 2: Update the Belongs_to table and populate the relationship between Series and Comic_book
INSERT OR IGNORE INTO Belongs_to (series_id, comic_id)
SELECT
    Series.series_id,
    Comic_book.comic_id
FROM All_DC
JOIN Series ON Series.name = All_DC.Comic_Series  -- Match Comic_Series from All_DC with Series.name
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name  -- Match Issue_Name from All_DC with Comic_book.title
                AND Comic_book.comic_release_date = All_DC.Release_Date  -- Match Release_Date from All_DC with Comic_book.comic_release_date
WHERE Series.name IS NOT NULL
  AND Comic_book.comic_id IS NOT NULL;


