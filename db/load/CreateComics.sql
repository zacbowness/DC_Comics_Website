
DROP TABLE IF EXISTS 'Contains';
DROP TABLE IF EXISTS 'User_comic_list';
DROP TABLE IF EXISTS 'Contributes';
DROP TABLE IF EXISTS 'User_comic_list_item';
DROP TABLE IF EXISTS 'Comic_book';
DROP TABLE IF EXISTS 'Comic_Series';
DROP TABLE IF EXISTS 'Creator';
DROP TABLE IF EXISTS 'Grade';
DROP TABLE IF EXISTS 'Role';
DROP TABLE IF EXISTS 'Series';
DROP TABLE IF EXISTS 'User';
DROP TABLE IF EXISTS 'Users';
DROP TABLE IF EXISTS 'Grade_Company';
DROP TABLE IF EXISTS 'Belongs_to';


CREATE TABLE IF NOT EXISTS  User(
      user_name TEXT PRIMARY KEY NOT NULL, --user_name is a prinary key
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      DOB TEXT
    );

CREATE TABLE IF NOT EXISTS Role( -- Creater roles
role TEXT PRIMARY KEY NOT NULL,
role_desc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Grade_Company(
grade_company TEXT PRIMARY KEY NOT NULL,
grade_company_title TEXT NOT NULL,
grade_company_description TEXT
);

CREATE TABLE IF NOT EXISTS  Grade(
      grading_id text primary key, -- same as certification # for many
      company text,
      number integer,
      grade_description TEXT,
      comic_id TEXT NOT NULL,
      colour TEXT,
      FOREIGN KEY(company) REFERENCES Grade_Company(grade_company),
      FOREIGN KEY(comic_id) REFERENCES User_comic_list_item(comic_id) -- Added 
      );



-- Table for storing Comic book information
CREATE TABLE IF NOT EXISTS Comic_book (
    comic_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title TEXT NOT NULL,
    comic_release_date TEXT NOT NULL,
    version TEXT,
    publisher TEXT DEFAULT 'DC Comics',
    cover_image_url TEXT,
    UNIQUE(title, comic_release_date)
);

-- Table for storing Creator information
CREATE TABLE IF NOT EXISTS Creator (
    creator_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(name)
);

-- Table for tracking creator contributions to comics
CREATE TABLE IF NOT EXISTS Contributes (
    create_id INT NOT NULL,
    comic_id INT NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY(create_id, comic_id, role),
    FOREIGN KEY(create_id) REFERENCES Creator(creator_id),
    FOREIGN KEY(comic_id) REFERENCES Comic_book(comic_id),
    FOREIGN KEY(role) REFERENCES Role(role)
);

-- Table for representing the many-to-many relationship between Series and Comics
CREATE TABLE IF NOT EXISTS Belongs_to (
    series_id INT NOT NULL,
    comic_id INT NOT NULL,
    FOREIGN KEY(series_id) REFERENCES Series(series_id),
    FOREIGN KEY(comic_id) REFERENCES Comic_book(comic_id),
    PRIMARY KEY (series_id, comic_id)  -- Composite primary key for many-to-many mapping
);

-- Table for storing Series information
CREATE TABLE IF NOT EXISTS Series (
    series_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL

);

-- Table for storing user comic lists
CREATE TABLE IF NOT EXISTS User_comic_list (
    list_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier for each comic list
    user_name TEXT NOT NULL,  -- The user's name (to be linked to the User table)
    list_name TEXT NOT NULL,  -- Name of the comic list
    UNIQUE (user_name, list_name),  -- Ensure that each user can have only one list with a particular name
    FOREIGN KEY (user_name) REFERENCES User(user_name)  -- Link to the User table, assuming user_name is a primary/unique key in User table
);

-- Table for storing comic items in a user's list
CREATE TABLE IF NOT EXISTS User_comic_list_item (
    list_id INTEGER NOT NULL,
    comic_id INTEGER NOT NULL,
    quantity INT DEFAULT 1,
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (list_id, comic_id),
    FOREIGN KEY (list_id) REFERENCES User_comic_list(list_id),
    FOREIGN KEY (comic_id) REFERENCES Comic_book(comic_id)
);

-- Ensure the 'Role' table exists, as referenced in 'Contributes'
CREATE TABLE IF NOT EXISTS Role (
    role TEXT PRIMARY KEY NOT NULL,
    role_desc TEXT NOT NULL
);


