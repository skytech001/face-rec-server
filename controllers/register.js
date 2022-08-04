const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  const saltRounds = 10; //this is required to use bcrypt
  const hash = bcrypt.hashSync(password, saltRounds); //this is the syntax to hash
  db.transaction((trx) => {
    //the transaction() is used to do multiple transactions at a time
    //if one fails them it all fail. here we use it to insert email & password into login table
    //and also add the same email, name and joined to the users table.
    trx // trx is what we recieve from transaction()
      .insert({
        //then we insert (sql command)
        hash: hash,
        email: email,
      })
      .into("login") //into the login table
      .returning("email") //we return  only the email
      .then((loginEmail) => {
        //then we recieve the email and
        return trx("users") //now we enter into trx('users)(which now represents our db('users'))
          .insert({
            //then we insert everything into the users table
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .returning("*") //return everything in the users
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit) //for the transaction() to work you have to commit it.
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
