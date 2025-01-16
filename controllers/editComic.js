const db = require('../db/db');
// Show the form to add a new comic
exports.showEditComicForm = (req, res) => { // Doesn't work. 
    const comic_id = req.params.comic_id;

    // Fetch comic data, roles, creators, and series data for the edit form
    db.getComicById(comic_id)
        .then(comic => {
            return Promise.all([  // Wait for all these promises to resolve
                db.getCreators(),
                db.getSeries(),
                db.getRoles(),
                Promise.resolve(comic)  // Ensure comic is included in the result
            ]);
        })
        .then(([creators, series, roles, comic]) => {
            // Map creators to roles for pre-population
            const comicRoles = comic.creators.reduce((acc, creator) => {
                acc[creator.role] = creator.name;
                return acc;
            }, {});

            // Add series_ids to comic object for pre-population
            comic.series_ids = comic.series_ids || [];

            res.render('editComic', { comic, creators, series, roles });
        })
        .catch(err => {
            res.status(500).send("Error fetching data: " + err.message);
        });
};

// Handle the form submission to add the new comic

exports.editComic = (req, res) => {

    const comic_id = req.params.comic_id;
    const { title, release_date, version, publisher,  series_ids, roles } = req.body;

    // Update comic in the database
    db.updateComic(comic_id, { title, release_date, version, publisher })
        .then(() => {
            // Update series and roles associations
            const promises = [];
            series_ids.forEach(series_id => {
                promises.push(db.updateComicSeries(comic_id, series_id));
            });
            roles.forEach(role => {
                promises.push(db.updateCreatorRoleInComic(comic_id, role.creator_id, role.role));
            });

            return Promise.all(promises);
        })
        .then(() => {
            res.redirect('/comics/edit' + comic_id);
        })
        .catch(err => {
            res.status(500).send("Error updating comic: " + err.message);
        });
}





    
