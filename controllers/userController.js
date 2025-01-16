exports.getUserForm = (req, res) => {
    res.render('set-user');
  };
  
  exports.setUser = (req, res) => {
    const user_name = req.body.user_name;
    if (user_name) {
      req.session.user_name = user_name;  // Store in session
      res.redirect('/my-lists');
    } else {
      res.status(400).send('User name is required!');
    }
  };
  