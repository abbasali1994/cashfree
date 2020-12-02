# cashfree
NPM Scripts
"start": "npm run dev",
"server": "node ./app",
"transpile": "babel ./app.js --out-dir dist-server",
"dev": "NODE_ENV=development npm-run-all build server",
"clean": "rimraf dist-server",
"build": "npm-run-all clean transpile",
"watch:dev": "nodemon"