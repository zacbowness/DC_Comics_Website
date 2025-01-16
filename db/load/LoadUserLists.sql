PRAGMA foreign_keys = OFF;

INSERT INTO User_comic_list_item (list_id, comic_id, quantity)
VALUES
(1, 1, 1);

INSERT INTO Grade ( grading_id, company, number, grade_description, comic_id, colour )
VALUES
(
    '123456', 'CGC', '9.2', 
    'Slight fold at bottom left corner' ,
    1,
    'blue'

); 