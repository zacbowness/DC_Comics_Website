-- Step 1: Update existing records in the Series table
UPDATE Series
SET 
    name = (
        SELECT All_DC.Comic_Series
        FROM All_DC
        WHERE All_DC.Issue_Name = Comic_book.title 
          AND All_DC.Release_Date = Comic_book.comic_release_date
    ),
    comic_id = Comic_book.comic_id
FROM Comic_book
WHERE Series.comic_id = Comic_book.comic_id;

-- Step 2: Insert new Series records if they don't already exist
INSERT OR IGNORE INTO Series (series_id, name, start_date, end_date, comic_id)
SELECT
    ROW_NUMBER() OVER (ORDER BY Comic_book.comic_id) AS series_id,  -- Generate a unique series_id
    All_DC.Comic_Series AS name, 
    Comic_book.comic_release_date AS start_date, 
    NULL AS end_date,  -- Assuming end_date is not available, adjust if needed
    Comic_book.comic_id
FROM All_DC
JOIN Comic_book ON All_DC.Issue_Name = Comic_book.title 
               AND All_DC.Release_Date = Comic_book.comic_release_date
WHERE NOT EXISTS (
    SELECT 1 FROM Series 
    WHERE Series.comic_id = Comic_book.comic_id
);

-- Step 3: Populate the Belongs_to table (many-to-many relationship between Series and Comic_book)
INSERT OR IGNORE INTO Belongs_to (series_id, comic_id)
SELECT
    Series.series_id,      -- The series_id from the Series table
    Comic_book.comic_id    -- The comic_id from the Comic_book table
FROM All_DC
JOIN Comic_book ON Comic_book.title = All_DC.Issue_Name 
               AND Comic_book.comic_release_date = All_DC.Release_Date
JOIN Series ON Series.name = All_DC.Comic_Series  -- Match Comic_Series from All_DC with Series.name
WHERE Comic_book.comic_id IS NOT NULL
  AND Series.series_id IS NOT NULL;
