const db = require('../db/db');

exports.getUserLists = (req, res) => {
  let user_name = req.session.user_name;
  // user_name="spideyfan67";

  db.all('SELECT * FROM User_comic_list WHERE user_name = ?', [user_name], (err, lists) => {
    if (err) return res.status(500).send('Error fetching comic lists');
    res.render('my-lists', { lists });
  });
};

exports.getListComics = (req, res) => {

  const list_id = req.params.list_id;

  const sqlComics = `
    SELECT 
      cb.comic_id, 
      cb.title, 
      cb.comic_release_date, 
      cb.publisher, 
      cb.version,
      cb.cover_image_url, -- Include the cover_image_url in the selection
      ucl.list_name AS listname,
      gc.grade_company_title, 
      g.number AS grade_number,
      g.grade_description,
      g.colour AS grade_colour
    FROM 
      User_comic_list_item ucli
      JOIN User_comic_list ucl ON ucl.list_id = ucli.list_id
      JOIN Comic_book cb ON ucli.comic_id = cb.comic_id
      LEFT JOIN Grade g ON cb.comic_id = g.comic_id
      LEFT JOIN Grade_Company gc ON g.company = gc.grade_company
    WHERE 
      ucli.list_id = ?;
  `;

  const sqlComicsWithCreator = `
    SELECT 
      cr.name AS creator_name,
      c.role AS contributorRole,
      c.comic_id
    FROM 
      User_comic_list_item ucli
      JOIN User_comic_list ucl ON ucl.list_id = ucli.list_id
      JOIN Comic_book cb ON ucli.comic_id = cb.comic_id
      LEFT JOIN Contributes c ON cb.comic_id = c.comic_id
      LEFT JOIN Creator cr ON c.create_id = cr.creator_id
    WHERE 
      ucli.list_id = ?;
  `;

  db.all(sqlComics, [list_id], (err, comics) => {
    if (err) {
      return res.status(500).send('Error fetching comics for the list ' + list_id);
    }

    db.all(sqlComicsWithCreator, [list_id], (err, creators) => {
      if (err) {
        return res.status(500).send('Error fetching creators for the list ' + list_id);
      }

      comics.forEach((comic) => {
        comic.creators = creators.filter(creator => creator.comic_id === comic.comic_id);
      });

      res.render('list-details', { comics, list_id });
    });
  });
};

exports.addComicToList = (req, res) => {
  const comic_id = req.body.comic_id;
  const list_name = req.body.list_name;
  let user_name = req.session.user_name;
  
  //Session
  // Check if the list exists
  db.get('SELECT * FROM User_comic_list WHERE list_name = ? AND user_name = ?', [list_name, user_name], (err, list) => {
    if (err) return res.status(500).send('Error checking list');
    
    if (list) {
      // Add comic to existing list
      const list_id = list.list_id;
      db.run('INSERT INTO User_comic_list_item (list_id, comic_id) VALUES (?, ?)', [list_id, comic_id], (err) => {
        if (err) return res.status(500).send('Error adding comic to list, comic may already be in list.');
        res.redirect(`/list/${list_id}`);
      });
    } else {
      // Create a new list
      db.run('INSERT INTO User_comic_list (user_name, list_name) VALUES (?, ?)', [user_name, list_name], function (err) {
        if (err) return res.status(500).send('Error creating list');
        
        const list_id = this.lastID;
        db.run('INSERT INTO User_comic_list_item (list_id, comic_id) VALUES (?, ?)', [list_id, comic_id], (err) => {
          if (err) return res.status(500).send('Error adding comic to list, comic may already be in list.');
          res.redirect(`/list/${list_id}`);
        });
      });
    }
  });
};

exports.deleteComicFromList =  (req, res) => {

  const { list_id, comic_id } = req.body;
  const sql = 'DELETE FROM User_comic_list_item WHERE list_id = ? AND comic_id = ?';

    db.run(sql, [list_id, comic_id], (err) => {
      if (err) return res.status(500).send('Error adding comic to list, comic may already be in list.');
      res.redirect(`/list/${list_id}`);
    });

};