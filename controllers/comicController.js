const db = require('../db/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for image upload
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Store files in 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

 exports.upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed.'));
        }
        cb(null, true);
    }
});

// Upload Comic Cover
exports.uploadComicCover = (req, res) => {
    const comic_id = req.params.comic_id;
    const list_id = req.body.list_id;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.filename;
    db.run('UPDATE Comic_book SET cover_image_url = ? WHERE comic_id = ?', [filePath, comic_id], function(err) {
        if (err) {
            return res.status(500).send('Error saving cover image.');
        }
        res.redirect(`/list/${list_id}`);
    });
};

// Update Comic Cover
exports.updateComicCover = (req, res) => {
    const comic_id = req.params.comic_id;
    const list_id = req.body.list_id;
    const cover_image = req.file;

    if (!cover_image) {
        return res.status(400).send('No file uploaded');
    }

    const oldCoverImagePath = `uploads/${req.body.old_cover_image_url}`;
    if (fs.existsSync(oldCoverImagePath)) {
        fs.unlinkSync(oldCoverImagePath);
    }

    db.run('UPDATE Comic_book SET cover_image_url = ? WHERE comic_id = ?', [cover_image.filename, comic_id], function(err) {
        if (err) {
            return res.status(500).send('Error updating cover image');
        }
        res.redirect(`/list/${list_id}`);
    });
};

// Delete Comic Cover
exports.deleteComicCover = (req, res) => {
    const comic_id = req.params.comic_id;
    const list_id = req.body.list_id;

    db.get('SELECT cover_image_url FROM Comic_book WHERE comic_id = ?', [comic_id], (err, row) => {
        if (err) {
            return res.status(500).send('Error retrieving comic data');
        }

        if (row && row.cover_image_url) {
            const imagePath = `uploads/${row.cover_image_url}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            db.run('UPDATE Comic_book SET cover_image_url = NULL WHERE comic_id = ?', [comic_id], function(err) {
                if (err) {
                    return res.status(500).send('Error updating comic record');
                }
                res.redirect(`/list/${list_id}`);
            });
        } else {
            res.status(404).send('Cover image not found');
        }
    });
};

// Function to delete a comic, its associated 'Belongs_to' entry, and 'Contributes' entry
exports.deleteComic = (req, res) => {
    const comic_id = req.params.comic_id;
    // Function to delete a comic, its associated 'Belongs_to' entry, 'Contributes' entry, and 'User_comic_list_item' entry
    function deleteComic(comicId, callback) {
        if (typeof callback !== 'function') {
            console.error('Callback is not defined properly.');
            return;
        }

        db.serialize(() => {
            // Start transaction
            db.run("BEGIN TRANSACTION");

            // Step 1: Delete creator contributions for the comic
            db.run("DELETE FROM Contributes WHERE comic_id = ?", [comicId], function (err) {
                if (err) {
                    console.error("Error deleting from Contributes:", err.message);
                    db.run("ROLLBACK");
                    return callback(err);
                }

                // Step 2: Delete comic's association with any series in the Belongs_to table
                db.run("DELETE FROM Belongs_to WHERE comic_id = ?", [comicId], function (err) {
                    if (err) {
                        console.error("Error deleting from Belongs_to:", err.message);
                        db.run("ROLLBACK");
                        return callback(err);
                    }

                    // Step 3: Delete the comic itself from the Comic_book table
                    db.run("DELETE FROM Comic_book WHERE comic_id = ?", [comicId], function (err) {
                        if (err) {
                            console.error("Error deleting from Comic_book:", err.message);
                            db.run("ROLLBACK");
                            return callback(err);
                        }

                            // Commit the transaction if everything is successful
                            db.run("COMMIT", function (err) {
                                if (err) {
                                    console.error("Error committing transaction:", err.message);
                                    db.run("ROLLBACK");
                                    return callback(err);
                                }
                                console.log(`Comic with ID ${comicId} and its related entries deleted successfully.`);
                                res.redirect('/');  // Success, no error
  
                        });
                    });
                });
            });
        });
    }
};


