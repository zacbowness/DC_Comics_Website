const db = require('../db/db');
// Show the form to add a new comic
exports.showAddComicForm = (req, res) => {
    // Get a list of all available creators and series to populate the dropdowns in the form
    const sqlCreators = 'SELECT * FROM Creator ORDER BY name';
    const sqlSeries = 'SELECT * FROM Series ORDER By Series.name';
    
    db.all(sqlCreators, (err, creators) => {
        if (err) return res.status(500).send('Error fetching creators');
        
        db.all(sqlSeries, (err, series) => {
            if (err) return res.status(500).send('Error fetching series');
            
            res.render('addComic', { creators, series });
        });
    });
};

// Handle the form submission to add the new comic

exports.addComic = (req, res) => {
    const { title, release_date, version, publisher, cover_image_url, series_ids } = req.body;
    // Extract creator role data from the form
    let creatorRoles = [];
    // Loop through all the roles sent in the form
    for (let role in req.body) {
        if (role !== 'title' && role !== 'release_date' && role !== 'version' && role !== 'publisher' && role !== 'cover_image_url' && role !== 'series_ids') {
            // For each role, collect the corresponding creator name and store the information
            creatorRoles.push({ role, creator_name: req.body[role] });
        }
    }

    // Insert comic into Comic_book table
    const insertComicSql = `
        INSERT INTO Comic_book (title, comic_release_date, version, publisher, cover_image_url)
        VALUES (?, ?, ?, ?, ?)`;

    db.run(insertComicSql, [title, release_date, version, publisher, cover_image_url], function (err) {
        if (err) {
            return res.status(500).send('Error inserting comic');
        }

        const comic_id = this.lastID; // The ID of the newly inserted comic

        // Insert creator-role mappings into Contributes table
        creatorRoles.forEach((creatorRole) => {
            const { role, creator_name } = creatorRole;

            // First check if the creator exists, if not, create a new one
            const findCreatorSql = `SELECT creator_id FROM Creator WHERE name = ?`;
            db.get(findCreatorSql, [creator_name], (err, creatorRow) => {
                if (err) {
                    return res.status(500).send('Error fetching creator');
                }

                let creator_id;
                if (creatorRow) {
                    // If creator already exists, get their ID
                    creator_id = creatorRow.creator_id;
                } else {
                    // If creator does not exist, insert them into the Creator table
                    const insertCreatorSql = `INSERT INTO Creator (name) VALUES (?)`;
                    db.run(insertCreatorSql, [creator_name], function (err) {
                        if (err) {
                            return res.status(500).send('Error inserting creator');
                        }
                        creator_id = this.lastID;
                    });
                }

                // Insert into Contributes table
                const insertContributeSql = `
                    INSERT INTO Contributes (create_id, comic_id, role)
                    VALUES (?, ?, ?)`;

                db.run(insertContributeSql, [creator_id, comic_id, role], (err) => {
                    if (err) {
                        return res.status(500).send('Error inserting contributor');
                    }
                });
            });
        });
        // Ensure series_ids is an array (in case it's not)
        const seriesIdsArray = Array.isArray(series_ids) ? series_ids : [series_ids];
        // Insert into Belongs_to table (Many-to-many relationship between Series and Comic_book)
        if (series_ids && series_ids.length > 0) {
            seriesIdsArray.forEach((series_id) => {
                const insertBelongsToSql = `
                    INSERT INTO Belongs_to (series_id, comic_id)
                    VALUES (?, ?)`;

                db.run(insertBelongsToSql, [series_id, comic_id], (err) => {
                    if (err) {
                        return res.status(500).send('Error linking comic to series');
                    }
                });
            });
        }

        // Redirect after successfully adding comic
        res.redirect('/');
    });
};

