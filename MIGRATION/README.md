C:\Program Files\MongoDB\Tools\100\bin

## POUR SAVE
cmd en mode admin : 
cd C:\Program Files\MongoDB\Tools\100\bin
mongodump mongodb+srv://adminMain:2r2fRIk9e7Ru1CK7@maisonisen.jwkhliv.mongodb.net

et pouf ca fait une save dans le dossier dump (probalbement dans C:\Program Files\MongoDB\Tools\100\bin)

## POUR RESTORE
cmd en mode admin : 
cd C:\Program Files\MongoDB\Tools\100\bin
mongorestore mongodb+srv://adminMain:2r2fRIk9e7Ru1CK7@maisonisen.jwkhliv.mongodb.net

et pouf ca revient


### Pour migrer depuis la base SQL, voir le Python