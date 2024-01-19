const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;  // Use a porta fornecida pelo ambiente

app.use(express.json())

  

  


// Permita que o servidor use qualquer porta atribuída dinamicamente
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Use variáveis de ambiente para configurar a conexão com o banco de dados em produção
const db = mysql.createConnection({
    user: process.env.DB_USER || 'root',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'plantdb',
});

// Resto do seu código...


// let us now create a route to the server that will register a user.

app.post('/register', (req, res)=>{
    // We need to get variables sent from the form
    const sentEmail = req.body.Email
    const sentUserName = req.body.UserName
    const sentPassword = req.body.Password

    // Lets create SLQ statement to insert the user to the Database table Users
    const SQL = 'INSERT INTO Users (email, username,password) VALUES (?,?,?)'
   //We are going to enter these values through a variable
   const Values = [sentEmail, sentUserName, sentPassword]

   // query to execute the sql statement stated above
   db.query(SQL, Values, (err, results)=>{
    if(err){
        res.send(err)
    }
    else{
        console.log('Usuário inserido com sucesso!')
        res.send({message: 'User Added1'})
        // let try and see
        // user has not been submitted, we need to use Express and cors
    }
   })
})

//Now we need to Login with these credentials from o registered User
// Lets create another route
app.post('/login', (req, res)=>{
        // We need to get variables sent from the form
        const sentloginUserName = req.body.LoginUserName
        const sentLoginPassword = req.body.LoginPassword
    
        // Lets create SLQ statement to insert the user to the Database table Users
        const SQL = 'SELECT * FROM users WHERE username = ? && password = ?'
       //We are going to enter these values through a variable
       const Values = [sentloginUserName, sentLoginPassword]

       // Adicionamos logs para depuração
    console.log('Executing SQL Query:', SQL);
    console.log('Query Values:', Values);

    db.query(SQL, Values, (err, results) => {
        if (err) {
            console.error('Erro durante a consulta SQL:', err);
            res.send({ error: err });
        }
        if (results.length > 0) {
            console.log('Usuário encontrado:', results);
            res.send(results);
        } else {
            console.log('Credenciais não existem!');
            res.send({ message: 'Credenciais não existem!' });
        }
    });
});