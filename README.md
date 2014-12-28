#Instamap

Before continue, read the API design best practices [here](https://github.com/interagent/http-api-design)

## Installation

Clone the repository, install node and mongodb

Create a database called `mapofmine`

```
rafa@batpc:~/projects$ mongo
MongoDB shell version: 2.4.10
connecting to: test
> db
test
> use mapofmine
switched to db mapofmine
> 
```

Install modules

```
sudo npm install
```

If you don't have grunt installed, install it

```
sudo npm install -g grunt-cli
```

Run grunt 

```
grunt
```

Or run it with node

```
node app.js
//Or pm2 start app

```

Access to 
```
http://localhost:3000
```

## Nitrous
Launch mongodb
```
parts start mongodb
```

